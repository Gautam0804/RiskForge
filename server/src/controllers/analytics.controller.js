const pool =
    require("../config/database");

async function getAnalyticsSummary(req, res, next) {
    try {
        const userId = req.user.sub;

        const summaryResult = await pool.query(
            `
            SELECT
                COUNT(*)::int AS total_transactions,

                COUNT(*) FILTER (
                    WHERE status = 'fraud'
                )::int AS confirmed_fraud,

                COUNT(*) FILTER (
                    WHERE status IN ('review', 'blocked')
                )::int AS suspicious_transactions,

                COUNT(*) FILTER (
                    WHERE status = 'approved'
                )::int AS approved_transactions,

                COUNT(*) FILTER (
                    WHERE status = 'blocked'
                )::int AS blocked_transactions,

                COALESCE(
                    ROUND(AVG(risk_score), 2),
                    0
                ) AS average_risk_score,

                COALESCE(
                    ROUND(
                        AVG(fraud_probability) * 100,
                        2
                    ),
                    0
                ) AS average_fraud_probability
            FROM transactions
            WHERE user_id = $1
            `,
            [userId]
        );

        const riskDistributionResult =
            await pool.query(
                `
                SELECT
                    risk_level,
                    COUNT(*)::int AS count
                FROM transactions
                WHERE user_id = $1
                GROUP BY risk_level
                ORDER BY count DESC
                `,
                [userId]
            );

        const locationResult =
            await pool.query(
                `
                SELECT
                    COALESCE(
                        location_city,
                        'Unknown'
                    ) AS location,
                    COUNT(*)::int AS transactions,
                    COUNT(*) FILTER (
                        WHERE status = 'fraud'
                    )::int AS fraud
                FROM transactions
                WHERE user_id = $1
                GROUP BY location_city
                ORDER BY fraud DESC, transactions DESC
                LIMIT 10
                `,
                [userId]
            );

        const trendResult =
            await pool.query(
                `
                SELECT
                    TO_CHAR(
                        created_at::date,
                        'Mon DD'
                    ) AS day,

                    COUNT(*)::int AS transactions,

                    COUNT(*) FILTER (
                        WHERE status = 'fraud'
                    )::int AS fraud
                FROM transactions
                WHERE user_id = $1
                  AND created_at >= NOW() - INTERVAL '7 days'
                GROUP BY created_at::date
                ORDER BY created_at::date
                `,
                [userId]
            );

        const categoryResult =
            await pool.query(
                `
                SELECT
                    COALESCE(
                        transaction_type,
                        'Unknown'
                    ) AS category,

                    COUNT(*)::int AS count,

                    COALESCE(
                        SUM(amount),
                        0
                    ) AS total_amount
                FROM transactions
                WHERE user_id = $1
                GROUP BY transaction_type
                ORDER BY total_amount DESC
                `,
                [userId]
            );

        const summary =
            summaryResult.rows[0];

        return res.status(200).json({
            success: true,

            data: {
                totalTransactions: Number(
                    summary.total_transactions
                ),

                confirmedFraud: Number(
                    summary.confirmed_fraud
                ),

                suspiciousTransactions: Number(
                    summary.suspicious_transactions
                ),

                approvedTransactions: Number(
                    summary.approved_transactions
                ),

                blockedTransactions: Number(
                    summary.blocked_transactions
                ),

                averageRiskScore: Number(
                    summary.average_risk_score
                ),

                averageFraudProbability: Number(
                    summary.average_fraud_probability
                ),

                fraudRate:
                    Number(summary.total_transactions) > 0
                        ? Number(
                            (
                                (
                                    Number(
                                        summary.confirmed_fraud
                                    ) /
                                    Number(
                                        summary.total_transactions
                                    )
                                ) * 100
                            ).toFixed(2)
                        )
                        : 0,

                riskDistribution:
                    riskDistributionResult.rows.map(
                        (item) => ({
                            risk_level: item.risk_level,
                            count: Number(item.count)
                        })
                    ),

                locations:
                    locationResult.rows.map(
                        (item) => ({
                            location: item.location,
                            transactions: Number(
                                item.transactions
                            ),
                            fraud: Number(item.fraud)
                        })
                    ),

                fraudTrend:
                    trendResult.rows.map(
                        (item) => ({
                            day: item.day,
                            transactions: Number(
                                item.transactions
                            ),
                            fraud: Number(item.fraud)
                        })
                    ),

                categoryData:
                    categoryResult.rows.reduce(
                        (result, item) => {
                            result[item.category] =
                                Number(item.total_amount);

                            return result;
                        },
                        {}
                    )
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAnalyticsSummary
};