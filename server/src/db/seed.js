require("dotenv").config();

const db =
    require("../config/database");

const {
    hashPassword
} = require("../utils/password");

async function seed() {
    const password =
        await hashPassword(
            "RiskForge@123"
        );

    const result =
        await db.query(
            `
            INSERT INTO users (
                email,
                password_hash,
                full_name,
                role
            )
            VALUES (
                $1, $2, $3, $4
            )
            ON CONFLICT (email)
            DO UPDATE SET
                password_hash = EXCLUDED.password_hash,
                role = EXCLUDED.role,
                is_active = TRUE
            RETURNING
                id,
                email,
                full_name,
                role
            `,
            [
                "admin@riskforge.com",
                password,
                "RiskForge Administrator",
                "admin"
            ]
        );

    console.log(
        "✅ Seed user:",
        result.rows[0]
    );

    await db.pool.end();
}

seed().catch((error) => {
    console.error(
        "❌ Seed failed:",
        error
    );

    process.exit(1);
});