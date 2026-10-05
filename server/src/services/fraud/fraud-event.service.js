const { randomUUID } = require("crypto");
const db = require("../../config/database");

async function createFraudAlert({
    transactionId,
    riskScore,
    riskLevel,
    riskFactors
}) {
    if (riskScore < 65) {
        return null;
    }

    const alertId = `ALT-${randomUUID()}`;

    const severity =
        riskScore >= 85
            ? "critical"
            : "high";

    const title =
        riskScore >= 85
            ? "Critical fraud risk detected"
            : "High fraud risk detected";

    const description =
        Object.values(riskFactors || {})
            .map((factor) => factor.reason)
            .filter(Boolean)
            .join("; ") ||
        "Multiple risk signals detected";

    const result = await db.query(
        `
        INSERT INTO alerts (
            alert_id,
            transaction_id,
            alert_type,
            severity,
            title,
            description,
            status
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7
        )
        RETURNING *
        `,
        [
            alertId,
            transactionId,
            "fraud_detection",
            severity,
            title,
            description,
            "open"
        ]
    );

    return result.rows[0];
}

module.exports = {
    createFraudAlert
};