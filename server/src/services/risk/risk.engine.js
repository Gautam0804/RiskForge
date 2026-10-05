const RISK_RULES = require("./risk.rules");

function calculateRisk(transaction) {
    let score = 0;

    const factors = {};

    const amount = Number(transaction.amount);

    // Amount anomaly
    if (amount >= RISK_RULES.amount.high) {
        score += RISK_RULES.scoring.amountHigh;

        factors.amount_anomaly = {
            score: RISK_RULES.scoring.amountHigh,
            severity: "high",
            reason: "Transaction amount is unusually high"
        };
    } else if (amount >= RISK_RULES.amount.medium) {
        score += RISK_RULES.scoring.amountMedium;

        factors.amount_anomaly = {
            score: RISK_RULES.scoring.amountMedium,
            severity: "medium",
            reason: "Transaction amount is above normal range"
        };
    }

    // New device anomaly
    if (
        transaction.deviceId &&
        transaction.deviceId.startsWith(
            RISK_RULES.device.newDevicePrefix
        )
    ) {
        score += RISK_RULES.scoring.device;

        factors.device_anomaly = {
            score: RISK_RULES.scoring.device,
            severity: "high",
            reason: "Transaction originated from a new device"
        };
    }

    // Velocity anomaly
    if (
        transaction.velocity !== undefined &&
        Number(transaction.velocity) >= RISK_RULES.velocity.high
    ) {
        score += RISK_RULES.scoring.velocity;

        factors.velocity_anomaly = {
            score: RISK_RULES.scoring.velocity,
            severity: "high",
            reason: "High transaction velocity detected"
        };
    }

    // Location anomaly
    if (transaction.locationAnomaly === true) {
        score += RISK_RULES.scoring.location;

        factors.location_anomaly = {
            score: RISK_RULES.scoring.location,
            severity: "medium",
            reason:
                "Transaction location differs from historical behavior"
        };
    }

    score = Math.min(score, 100);

    let riskLevel = "low";
    let status = "approved";

    if (score >= 85) {
        riskLevel = "critical";
        status = "blocked";
    } else if (score >= 65) {
        riskLevel = "high";
        status = "review";
    } else if (score >= 35) {
        riskLevel = "medium";
    }

    return {
        riskScore: score,
        riskLevel,
        status,
        fraudProbability: Number((score / 100).toFixed(5)),
        riskFactors: factors
    };
}

module.exports = {
    calculateRisk
};