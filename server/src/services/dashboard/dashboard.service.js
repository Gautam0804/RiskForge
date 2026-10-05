const db = require("../../config/database");

async function getDashboardOverview(userId) {
    const [
        totalResult,
        suspiciousResult,
        fraudResult,
        distributionResult,
        recentResult
    ] = await Promise.all([
        db.query(
            `
            SELECT COUNT(*)::int AS total
            FROM transactions
            WHERE user_id = $1
            `,
            [userId]
        ),

        db.query(
            `
            SELECT COUNT(*)::int AS total
            FROM transactions
            WHERE user_id = $1
              AND risk_score >= 65
            `,
            [userId]
        ),

        db.query(
            `
            SELECT COUNT(*)::int AS total
            FROM transactions
            WHERE user_id = $1
              AND status = 'blocked'
            `,
            [userId]
        ),

        db.query(
            `
            SELECT
                risk_level,
                COUNT(*)::int AS count
            FROM transactions
            WHERE user_id = $1
            GROUP BY risk_level
            ORDER BY
                CASE risk_level
                    WHEN 'critical' THEN 1
                    WHEN 'high' THEN 2
                    WHEN 'medium' THEN 3
                    WHEN 'low' THEN 4
                    ELSE 5
                END
            `,
            [userId]
        ),

        db.query(
            `
            SELECT
                transaction_id,
                merchant,
                amount,
                currency,
                risk_score,
                risk_level,
                status,
                created_at
            FROM transactions
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 10
            `,
            [userId]
        )
    ]);

    return {
        stats: {
            totalTransactions:
                totalResult.rows[0].total,

            suspiciousTransactions:
                suspiciousResult.rows[0].total,

            confirmedFraud:
                fraudResult.rows[0].total
        },

        riskDistribution:
            distributionResult.rows,

        recentTransactions:
            recentResult.rows
    };
}

module.exports = {
    getDashboardOverview
};