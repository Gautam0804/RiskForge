const db = require("../../config/database");
const { getTransactionVelocity } = require("./velocity.service");

async function buildTransactionContext({
    userId,
    deviceId,
    locationCity
}) {
    const velocity = await getTransactionVelocity(userId);

    const deviceResult = await db.query(
        `
        SELECT COUNT(*)::int AS count
        FROM transactions
        WHERE user_id = $1
          AND device_id = $2
        `,
        [userId, deviceId]
    );

    const knownDevice = deviceResult.rows[0].count > 0;

    const locationResult = await db.query(
        `
        SELECT COUNT(*)::int AS count
        FROM transactions
        WHERE user_id = $1
          AND location_city = $2
        `,
        [userId, locationCity]
    );

    const knownLocation = locationResult.rows[0].count > 0;

    return {
        velocity,
        locationAnomaly:
            !knownLocation &&
            locationCity !== undefined &&
            locationCity !== null,
        deviceAnomaly:
            !knownDevice &&
            deviceId !== undefined &&
            deviceId !== null
    };
}

module.exports = {
    buildTransactionContext
};