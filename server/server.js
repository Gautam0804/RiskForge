require("dotenv").config();

const app = require("./src/app");
const env = require("./src/config/env");
const { checkDatabaseConnection } = require("./src/config/database");

async function startServer() {
    try {
        await checkDatabaseConnection();

        app.listen(env.port, "0.0.0.0", () => {
            console.log(
                `🚀 RiskForge API running on port ${env.port}`
            );

            console.log(
                `🌍 Environment: ${env.nodeEnv}`
            );
        });
    } catch (error) {
        console.error(
            "❌ Failed to start RiskForge:",
            error.message
        );

        process.exit(1);
    }
}

startServer();