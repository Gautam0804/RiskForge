const requiredEnv = [
    "DATABASE_URL",
    "JWT_SECRET"
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

module.exports = {
    port: Number(process.env.PORT || 5000),

    nodeEnv: process.env.NODE_ENV || "development",

    databaseUrl: process.env.DATABASE_URL,

    redisUrl: process.env.REDIS_URL,

    jwtSecret: process.env.JWT_SECRET,

    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

    corsOrigins: (process.env.CORS_ORIGINS || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),

    mlServiceUrl:
        process.env.ML_SERVICE_URL ||
        "http://localhost:8000"
};