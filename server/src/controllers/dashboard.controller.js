const db =
    require("../config/database");

const {
    success
} = require("../utils/apiResponse");

async function overview(req, res) {
    const result = await db.query(`
        SELECT
            COUNT(*)::int AS total_transactions,

            COUNT(*) FILTER (
                WHERE risk_score >= 50
            )::int AS suspicious_transactions,

            COUNT(*) FILTER (
                WHERE risk_score >= 65
            )::int AS high_risk_transactions,

            COUNT(*) FILTER (
                WHERE status = 'fraud'
            )::int AS confirmed_fraud,

            ROUND(
                AVG(risk_score),
                2
            ) AS average_risk_score

        FROM transactions
        WHERE created_at >= CURRENT_DATE
    `);

    const riskDistribution =
        await db.query(`
            SELECT
                risk_level,
                COUNT(*)::int AS count
            FROM transactions
            WHERE created_at >= CURRENT_DATE
            GROUP BY risk_level
            ORDER BY risk_level
        `);

    return success(
        res,
        {
            overview: result.rows[0],

            riskDistribution:
                riskDistribution.rows
        },
        "Dashboard overview retrieved"
    );
}

module.exports = {
    overview
};