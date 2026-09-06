const alertModel =
    require("../models/alert.model");

async function createRiskAlert(
    transaction
) {
    if (
        transaction.risk_score < 65
    ) {
        return null;
    }

    const severity =
        transaction.risk_score >= 85
            ? "critical"
            : "high";

    return alertModel.createAlert({
        transactionId:
            transaction.id,

        alertType:
            "Transaction Risk",

        severity,

        title:
            transaction.risk_score >= 85
                ? "Critical-risk transaction detected"
                : "High-risk transaction detected",

        description:
            `Transaction ${transaction.transaction_id} received a risk score of ${transaction.risk_score}.`
    });
}

async function getAlerts(limit) {
    return alertModel.listAlerts(limit);
}

module.exports = {
    createRiskAlert,
    getAlerts
};