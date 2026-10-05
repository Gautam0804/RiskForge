const { query } = require("../config/database");


/*
 * Get investigations with
 * related transaction details
 */
async function getInvestigations(limit = 50) {
    const result = await query(
        `
        SELECT
            i.id,
            i.investigation_id,
            i.transaction_id,
            i.investigator_id,
            i.status,
            i.decision,
            i.notes,
            i.ai_summary,
            i.created_at,
            i.updated_at,

            t.merchant,
            t.amount,
            t.currency,
            t.location_city,
            t.transaction_type,
            t.risk_score,
            t.risk_level,
            t.fraud_probability,
            t.risk_factors

        FROM investigations i

        LEFT JOIN transactions t
            ON t.id = i.transaction_id

        ORDER BY i.created_at DESC

        LIMIT $1
        `,
        [limit]
    );

    return result.rows;
}


/*
 * Create a new investigation
 */
async function createInvestigation({
    transactionId,
    aiSummary,
    notes
}) {
    const investigationId =
        `INV-${Date.now()}`;

    const result = await query(
        `
        INSERT INTO investigations (
            investigation_id,
            transaction_id,
            investigator_id,
            status,
            decision,
            notes,
            ai_summary
        )
        VALUES (
            $1,
            $2,
            NULL,
            'open',
            NULL,
            $3,
            $4
        )
        RETURNING
            id,
            investigation_id,
            transaction_id,
            investigator_id,
            status,
            decision,
            notes,
            ai_summary,
            created_at,
            updated_at
        `,
        [
            investigationId,
            transactionId,
            notes,
            aiSummary
        ]
    );

    return result.rows[0];
}


/*
 * Update investigation status
 */
async function updateInvestigationStatus(
    id,
    status,
    decision
) {
    const result = await query(
        `
        UPDATE investigations
        SET
            status = $1,
            decision = $2,
            updated_at = NOW()
        WHERE id = $3
        RETURNING
            id,
            investigation_id,
            transaction_id,
            investigator_id,
            status,
            decision,
            notes,
            ai_summary,
            created_at,
            updated_at
        `,
        [
            status,
            decision,
            id
        ]
    );

    return result.rows[0] || null;
}


module.exports = {
    getInvestigations,
    createInvestigation,
    updateInvestigationStatus
};