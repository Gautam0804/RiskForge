function calculateRisk(transaction) {
    let score = 0;

    const factors = {};

    // ---------------------------------------------
    // Amount anomaly
    // ---------------------------------------------

    if (transaction.amount >= 50000) {
        score += 30;

        factors.amount_anomaly = {
            score: 30,
            severity: "high",
            reason: "Transaction amount is unusually high"
        };
    } else if (transaction.amount >= 20000) {
        score += 15;

        factors.amount_anomaly = {
            score: 15,
            severity: "medium",
            reason: "Transaction amount is above normal range"
        };
    }

    // ---------------------------------------------
    // Device anomaly
    // ---------------------------------------------

    if (
        transaction.deviceId &&
        transaction.deviceId.startsWith("NEW-")
    ) {
        score += 25;

        factors.device_anomaly = {
            score: 25,
            severity: "high",
            reason: "Transaction originated from a new device"
        };
    }

    // ---------------------------------------------
    // Velocity anomaly
    // ---------------------------------------------

    if (
        transaction.velocity &&
        transaction.velocity >= 5
    ) {
        score += 25;

        factors.velocity_anomaly = {
            score: 25,
            severity: "high",
            reason: "High transaction velocity detected"
        };
    }

    // ---------------------------------------------
    // Location anomaly
    // ---------------------------------------------

    if (
        transaction.locationAnomaly
    ) {
        score += 20;

        factors.location_anomaly = {
            score: 20,
            severity: "medium",
            reason: "Transaction location differs from historical behavior"
        };
    }

    score = Math.min(score, 100);

    let riskLevel = "low";

    if (score >= 85) {
        riskLevel = "critical";
    } else if (score >= 65) {
        riskLevel = "high";
    } else if (score >= 35) {
        riskLevel = "medium";
    }

    let status = "approved";

    if (score >= 85) {
        status = "blocked";
    } else if (score >= 65) {
        status = "review";
    }

    return {
        riskScore: score,
        riskLevel,
        status,
        fraudProbability: Number(
            (score / 100).toFixed(5)
        ),
        riskFactors: factors
    };
}

module.exports = {
    calculateRisk
};