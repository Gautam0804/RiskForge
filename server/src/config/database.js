const { Pool } = require("pg");
const env = require("./env");

const isProductionDatabase =
    env.databaseUrl.includes("render.com");

const pool = new Pool({
    connectionString: env.databaseUrl,

    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,

    ...(isProductionDatabase
        ? {
              ssl: {
                  rejectUnauthorized: false
              }
          }
        : {})
});

pool.on("error", (error) => {
    console.error(
        "Unexpected PostgreSQL error:",
        error
    );
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
    query: (text, params) =>
        pool.query(text, params),
    checkDatabaseConnection
};