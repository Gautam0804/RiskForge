const { Pool } = require("pg");
const env = require("./env");

const pool = new Pool({
    connectionString: env.databaseUrl,

    max: 20,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 5000
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL error:", error);
});

async function checkDatabaseConnection() {
    const client = await pool.connect();

    try {
        await client.query("SELECT 1");
        console.log("✅ PostgreSQL connected");
    } finally {
        client.release();
    }
}

module.exports = {
    pool,
    query: (text, params) => pool.query(text, params),
    checkDatabaseConnection
};