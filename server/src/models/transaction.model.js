const db =
    require("../config/database");

async function createTransaction(data) {
    const result = await db.query(
        `
        INSERT INTO transactions (
            transaction_id,
            user_id,
            merchant,
            amount,
            currency,
            device_id,
            ip_address,
            location_city,
            latitude,
            longitude,
            transaction_type,
            status,
            risk_score,
            fraud_probability,
            risk_level,
            risk_factors,
            metadata,
            processed_at
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15,
            $16, $17, NOW()
        )
        RETURNING *
        `,
        [
            data.transactionId,
            data.userId || null,
            data.merchant,
            data.amount,
            data.currency,
            data.deviceId || null,
            data.ipAddress || null,
            data.locationCity || null,
            data.latitude || null,
            data.longitude || null,
            data.transactionType,
            data.status,
            data.riskScore,
            data.fraudProbability,
            data.riskLevel,
            JSON.stringify(data.riskFactors),
            JSON.stringify(data.metadata || {})
        ]
    );

    return result.rows[0];
}

async function findById(transactionId) {
    const result = await db.query(
        `
        SELECT
            t.*,
            u.full_name AS user_name,
            u.email AS user_email
        FROM transactions t
        LEFT JOIN users u
            ON u.id = t.user_id
        WHERE t.transaction_id = $1
        LIMIT 1
        `,
        [transactionId]
    );

    return result.rows[0] || null;
}

async function listTransactions({
    limit = 20,
    offset = 0,
    search = null
}) {
    const params = [
        limit,
        offset
    ];

    let where = "";

    if (search) {
        params.push(`%${search}%`);

        where = `
            WHERE
                t.transaction_id ILIKE $3
                OR t.merchant ILIKE $3
                OR u.full_name ILIKE $3
                OR u.email ILIKE $3
        `;
    }

    const result = await db.query(
        `
        SELECT
            t.transaction_id,
            t.merchant,
            t.amount,
            t.currency,
            t.status,
            t.risk_score,
            t.risk_level,
            t.fraud_probability,
            t.location_city,
            t.created_at,
            u.full_name AS user_name
        FROM transactions t
        LEFT JOIN users u
            ON u.id = t.user_id
        ${where}
        ORDER BY t.created_at DESC
        LIMIT $1
        OFFSET $2
        `,
        params
    );

    return result.rows;
}

module.exports = {
    createTransaction,
    findById,
    listTransactions
};