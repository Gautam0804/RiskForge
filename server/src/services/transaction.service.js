const { randomUUID } = require("crypto");

const db = require("../config/database");

const {
    calculateRisk
} = require("./risk/risk.engine");

const {
    buildTransactionContext
} = require("./fraud/transaction-context.service");

const {
    createFraudAlert
} = require("./fraud/fraud-event.service");

const {
    createAuditEvent
} = require("./fraud/audit-event.service");

const {
    createInvestigation
} = require("./investigation.service");


/*
|--------------------------------------------------------------------------
| CREATE TRANSACTION
|--------------------------------------------------------------------------
*/

async function createTransaction({
    userId,
    merchant,
    amount,
    currency,
    deviceId,
    locationCity,
    transactionType
}) {

    /*
     * Build fraud detection context
     */
    const context =
        await buildTransactionContext({
            userId,
            deviceId,
            locationCity
        });


    /*
     * Calculate transaction risk
     */
    const risk =
        calculateRisk({
            amount,
            deviceId,
            velocity:
                context.velocity,
            locationAnomaly:
                context.locationAnomaly
        });


    /*
     * Public transaction ID
     */
    const transactionId =
        randomUUID();


    /*
     * Insert transaction
     */
    const result =
        await db.query(
            `
            INSERT INTO transactions (
                transaction_id,
                user_id,
                merchant,
                amount,
                currency,
                device_id,
                location_city,
                transaction_type,
                risk_score,
                risk_level,
                fraud_probability,
                risk_factors,
                status
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                $13
            )
            RETURNING *
            `,
            [
                transactionId,
                userId,
                merchant,
                amount,
                currency,
                deviceId,
                locationCity,
                transactionType,
                risk.riskScore,
                risk.riskLevel,
                risk.fraudProbability,
                JSON.stringify(
                    risk.riskFactors
                ),
                risk.status
            ]
        );


    const transaction =
        result.rows[0];


    /*
     * Create fraud alert
     */
    const alert =
        await createFraudAlert({
            transactionId:
                transaction.id,

            riskScore:
                risk.riskScore,

            riskLevel:
                risk.riskLevel,

            riskFactors:
                risk.riskFactors
        });


    /*
     * Automatically create investigation
     * for high-risk transactions.
     */
    let investigation = null;


    if (
        risk.riskLevel === "high" ||
        risk.riskLevel === "critical"
    ) {

        investigation =
            await createInvestigation({
                transactionId:
                    transaction.id,

                notes:
                    "High-risk transaction requires investigation.",

                aiSummary:
                    `Transaction detected with ${risk.riskLevel} risk. ` +
                    `Risk score: ${risk.riskScore}.`
            });
    }


    /*
     * Create audit event
     */
    await createAuditEvent({
        userId,

        action:
            "TRANSACTION_CREATED",

        entityType:
            "transaction",

        entityId:
            transaction.id,

        metadata: {
            merchant,
            amount,
            currency,

            riskScore:
                risk.riskScore,

            riskLevel:
                risk.riskLevel,

            fraudProbability:
                risk.fraudProbability,

            status:
                risk.status
        }
    });


    /*
     * Return complete transaction result
     */
    return {
        transaction,
        risk,
        context,
        alert,
        investigation
    };
}


/*
|--------------------------------------------------------------------------
| LIST TRANSACTIONS
|--------------------------------------------------------------------------
*/

async function listTransactions({
    userId,
    page = 1,
    limit = 20,
    search,
    riskLevel,
    status
}) {

    const pageNumber =
        Math.max(
            Number(page) || 1,
            1
        );


    const limitNumber =
        Math.min(
            Math.max(
                Number(limit) || 20,
                1
            ),
            100
        );


    const offset =
        (pageNumber - 1) *
        limitNumber;


    /*
     * Base condition
     */
    const conditions = [
        "user_id = $1"
    ];


    const params = [
        userId
    ];


    let parameterIndex = 2;


    /*
     * Search filter
     */
    if (search) {

        conditions.push(
            `(merchant ILIKE $${parameterIndex}
             OR transaction_id::text ILIKE $${parameterIndex})`
        );

        params.push(
            `%${search}%`
        );

        parameterIndex++;
    }


    /*
     * Risk level filter
     */
    if (riskLevel) {

        conditions.push(
            `risk_level = $${parameterIndex}`
        );

        params.push(
            riskLevel
        );

        parameterIndex++;
    }


    /*
     * Status filter
     */
    if (status) {

        conditions.push(
            `status = $${parameterIndex}`
        );

        params.push(
            status
        );

        parameterIndex++;
    }


    const whereClause =
        conditions.join(" AND ");


    /*
     * Count transactions
     */
    const countResult =
        await db.query(
            `
            SELECT
                COUNT(*)::int AS total
            FROM transactions
            WHERE ${whereClause}
            `,
            params
        );


    const total =
        countResult.rows[0].total;


    /*
     * Get transactions
     */
    const result =
        await db.query(
            `
            SELECT
                transaction_id,
                merchant,
                amount,
                currency,
                location_city,
                transaction_type,
                risk_score,
                risk_level,
                fraud_probability,
                status,
                created_at
            FROM transactions
            WHERE ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${parameterIndex}
            OFFSET $${parameterIndex + 1}
            `,
            [
                ...params,
                limitNumber,
                offset
            ]
        );


    return {
        transactions:
            result.rows,

        pagination: {
            page:
                pageNumber,

            limit:
                limitNumber,

            total,

            totalPages:
                Math.ceil(
                    total /
                    limitNumber
                )
        }
    };
}


/*
|--------------------------------------------------------------------------
| GET TRANSACTION BY ID
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| We accept BOTH:
|
| 1. transactions.transaction_id
| 2. transactions.id
|
| This fixes the mismatch between
| Investigations and AI Investigator.
|
|--------------------------------------------------------------------------
*/

async function getTransactionById(
    userId,
    transactionId
) {

    const result =
        await db.query(
            `
            SELECT
                t.*,

                u.email,
                u.full_name

            FROM transactions t

            LEFT JOIN users u
                ON u.id = t.user_id

            WHERE
                (
                    t.transaction_id::text = $1
                    OR
                    t.id::text = $1
                )

                AND t.user_id = $2
            `,
            [
                transactionId,
                userId
            ]
        );


    /*
     * Transaction doesn't exist
     * or doesn't belong to user.
     */
    if (
        result.rows.length === 0
    ) {

        const error =
            new Error(
                "Transaction not found"
            );

        error.statusCode = 404;

        throw error;
    }


    return result.rows[0];
}


/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
    createTransaction,
    listTransactions,
    getTransactionById
};