
const { Pool } = require("pg");
const fs = require("fs/promises");
const path = require("path");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
    connectionTimeoutMillis: 10000,
});

const MIGRATIONS_DIR = path.join(__dirname, "migrations");
const LOCK_ID = 74120531;

async function runMigrations() {
    const client = await pool.connect();
    let lockAcquired = false;

    try {
        console.log("🔄 Running database migrations...");

        // Prevent multiple application instances from migrating together.
        await client.query("SELECT pg_advisory_lock($1)", [LOCK_ID]);
        lockAcquired = true;

        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                name VARCHAR(255) PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        const files = (await fs.readdir(MIGRATIONS_DIR))
            .filter((file) => /^\d+.*\.sql$/i.test(file))
            .sort((a, b) =>
                a.localeCompare(b, undefined, {
                    numeric: true,
                    sensitivity: "base",
                })
            );

        if (files.length === 0) {
            throw new Error(
                `No SQL migration files found in ${MIGRATIONS_DIR}`
            );
        }

        for (const file of files) {
            const existing = await client.query(
                "SELECT 1 FROM schema_migrations WHERE name = $1",
                [file]
            );

            if (existing.rowCount > 0) {
                console.log(`⏭️ Already applied: ${file}`);
                continue;
            }

            const filePath = path.join(MIGRATIONS_DIR, file);
            const sql = await fs.readFile(filePath, "utf8");

            console.log(`📄 Applying migration: ${file}`);

            await client.query("BEGIN");

            try {
                await client.query(sql);

                await client.query(
                    `INSERT INTO schema_migrations (name)
                     VALUES ($1)`,
                    [file]
                );

                await client.query("COMMIT");
                console.log(`✅ Applied: ${file}`);
            } catch (error) {
                await client.query("ROLLBACK");
                throw new Error(
                    `Migration ${file} failed: ${error.message}`,
                    { cause: error }
                );
            }
        }

        console.log("✅ Database migrations completed");
    } catch (error) {
        console.error("❌ Database migration failed:", error.message);
        throw error;
    } finally {
        if (lockAcquired) {
            try {
                await client.query("SELECT pg_advisory_unlock($1)", [
                    LOCK_ID,
                ]);
            } catch (error) {
                console.error(
                    "⚠️ Could not release migration lock:",
                    error.message
                );
            }
        }

        client.release();
    }
}

module.exports = { runMigrations, pool };
