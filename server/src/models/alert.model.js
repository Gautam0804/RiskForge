const db =
    require("../config/database");

async function createAlert({
    transactionId,
    alertType,
    severity,
    title,
    description
}) {
    const alertId =
        `ALT-${Date.now()
            .toString()
            .slice(-6)}`;

    const result = await db.query(
        `
        INSERT INTO alerts (
            alert_id,
            transaction_id,
            alert_type,
            severity,
            title,
            description
        )
        VALUES (
            $1, $2, $3, $4, $5, $6
        )
        RETURNING *
        `,
        [
            alertId,
            transactionId,
            alertType,
            severity,
            title,
            description
        ]
    );

    return result.rows[0];
}

async function listAlerts(limit = 50) {
    const result = await db.query(
        `
        SELECT
            a.*,
            t.transaction_id,
            t.risk_score,
            t.risk_level
        FROM alerts a
        LEFT JOIN transactions t
            ON t.id = a.transaction_id
        ORDER BY a.created_at DESC
        LIMIT $1
        `,
        [limit]
    );

    return result.rows;
}

module.exports = {
    createAlert,
    listAlerts
};