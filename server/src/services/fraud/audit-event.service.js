const db = require("../../config/database");

async function createAuditEvent({
    userId,
    action,
    entityType,
    entityId,
    metadata = {}
}) {
    const result = await db.query(
        `
        INSERT INTO audit_logs (
            user_id,
            action,
            entity_type,
            entity_id,
            metadata
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
            userId,
            action,
            entityType,
            entityId,
            JSON.stringify(metadata)
        ]
    );

    return result.rows[0];
}

module.exports = {
    createAuditEvent
};