const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
});

async function runMigrations() {
    const client = await pool.connect();

    try {
        console.log("🔄 Running database migrations...");

        await client.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;
        `);

        console.log("✅ Database migrations completed");
    } catch (error) {
        console.error("❌ Database migration failed:");
        console.error(error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

module.exports = { runMigrations };