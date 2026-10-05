require("dotenv").config();

const app = require("./src/app");
const env = require("./src/config/env");
const { checkDatabaseConnection } = require("./src/config/database");
const { runMigrations } = require("./src/db/migrate");

async function startServer() {
    try {
        await checkDatabaseConnection();

        await runMigrations();

        app.listen(env.port, "0.0.0.0", () => {
            console.log(
                `🚀 RiskForge API running on port ${env.port}`
            );

            console.log(
                `🌍 Environment: ${env.nodeEnv}`
            );
        });
    } catch (error) {
        console.error("❌ Failed to start RiskForge:");
        console.error(error);
        process.exit(1);
    }
}

startServer();