const db = require("../../config/database");

async function getTransactionVelocity(userId, windowMinutes = 10) {
    const result = await db.query(
        `
        SELECT COUNT(*)::int AS transaction_count
        FROM transactions
        WHERE user_id = $1
          AND created_at >= NOW() - ($2 * INTERVAL '1 minute')
        `,
        [userId, windowMinutes]
    );

    return result.rows[0].transaction_count;
}

module.exports = {
    getTransactionVelocity
};