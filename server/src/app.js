const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const env = require("./config/env");

const {
    apiLimiter
} = require("./middleware/rateLimit.middleware");

const {
    notFoundHandler,
    errorHandler
} = require("./middleware/error.middleware");

const authRoutes =
    require("./routes/auth.routes");

const transactionRoutes =
    require("./routes/transaction.routes");

const alertRoutes =
    require("./routes/alert.routes");

const dashboardRoutes =
    require("./routes/dashboard.routes");

const analyticsRoutes =
    require("./routes/analytics.routes");

const investigationRoutes =
    require("./routes/investigation.routes");

const aiInvestigatorRoutes =
    require("./routes/ai-investigator.routes");


const app = express();


app.disable("x-powered-by");


app.use(
    helmet()
);


app.use(
    cors({
        origin(origin, callback) {

            if (!origin) {
                return callback(null, true);
            }

            if (
                env.corsOrigins.includes(origin)
            ) {
                return callback(null, true);
            }

            return callback(
                new Error(
                    "CORS origin not allowed"
                )
            );
        },

        credentials: false
    })
);


app.use(apiLimiter);


app.use(
    morgan(
        env.nodeEnv === "production"
            ? "combined"
            : "dev"
    )
);


app.use(
    express.json({
        limit: "1mb"
    })
);


app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);


app.get(
    "/api/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            service:
                "RiskForge API",

            status:
                "healthy",

            environment:
                env.nodeEnv,

            timestamp:
                new Date().toISOString()
        });
    }
);


app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/transactions",
    transactionRoutes
);


app.use(
    "/api/alerts",
    alertRoutes
);


app.use(
    "/api/dashboard",
    dashboardRoutes
);


app.use(
    "/api/analytics",
    analyticsRoutes
);


app.use(
    "/api/investigations",
    investigationRoutes
);


/*
|--------------------------------------------------------------------------
| AI Investigator
|--------------------------------------------------------------------------
*/

app.use(
    "/api/ai-investigator",
    aiInvestigatorRoutes
);


app.use(
    notFoundHandler
);


app.use(
    errorHandler
);


module.exports = app;