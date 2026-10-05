const db = require("../config/database");

async function findByEmail(email) {
    const result = await db.query(
        `
        SELECT
            id,
            email,
            password_hash,
            full_name,
            role,
            is_active,
            last_login_at,
            created_at,
            token_version
        FROM users
        WHERE email = $1
        LIMIT 1
        `,
        [email.toLowerCase()]
    );

    return result.rows[0] || null;
}

async function findById(id) {
    const result = await db.query(
        `
        SELECT
            id,
            email,
            full_name,
            role,
            is_active,
            last_login_at,
            created_at
        FROM users
        WHERE id = $1
        LIMIT 1
        `,
        [id]
    );

    return result.rows[0] || null;
}

async function findByIdWithPassword(id) {
    const result = await db.query(
        `
        SELECT
            id,
            email,
            password_hash,
            full_name,
            role,
            is_active,
            last_login_at,
            created_at,
            token_version
        FROM users
        WHERE id = $1
        LIMIT 1
        `,
        [id]
    );

    return result.rows[0] || null;
}

async function findAuthStateById(id) {
    const result = await db.query(
        `
        SELECT
            id,
            is_active,
            token_version
        FROM users
        WHERE id = $1
        LIMIT 1
        `,
        [id]
    );

    return result.rows[0] || null;
}

async function createUser({
    email,
    passwordHash,
    fullName,
    role = "analyst"
}) {
    const result = await db.query(
        `
        INSERT INTO users (
            email,
            password_hash,
            full_name,
            role
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            email,
            full_name,
            role,
            is_active,
            created_at,
            token_version
        `,
        [
            email.toLowerCase(),
            passwordHash,
            fullName,
            role
        ]
    );

    return result.rows[0];
}

async function updateLastLogin(id) {
    await db.query(
        `
        UPDATE users
        SET last_login_at = NOW()
        WHERE id = $1
        `,
        [id]
    );
}

async function updatePassword(id, passwordHash) {
    const result = await db.query(
        `
        UPDATE users
        SET
            password_hash = $1,
            token_version = token_version + 1
        WHERE id = $2
        RETURNING
            id,
            email,
            full_name,
            role,
            is_active,
            token_version
        `,
        [
            passwordHash,
            id
        ]
    );

    return result.rows[0] || null;
}

module.exports = {
    findByEmail,
    findById,
    findByIdWithPassword,
    findAuthStateById,
    createUser,
    updateLastLogin,
    updatePassword
};