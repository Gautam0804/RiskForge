const db =
    require("../config/database");

async function createAuditLog({
    userId,
    action,
    entityType,
    entityId,
    metadata = {},
    ipAddress
}) {
    await db.query(
        `
        INSERT INTO audit_logs (
            user_id,
            action,
            entity_type,
            entity_id,
            metadata,
            ip_address
        )
        VALUES (
            $1, $2, $3, $4, $5, $6
        )
        `,
        [
            userId || null,
            action,
            entityType || null,
            entityId || null,
            JSON.stringify(metadata),
            ipAddress || null
        ]
    );
}

module.exports = {
    createAuditLog
};