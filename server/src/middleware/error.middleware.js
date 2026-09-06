const { error } = require("../utils/apiResponse");

function notFoundHandler(req, res) {
    return error(
        res,
        `Route not found: ${req.method} ${req.originalUrl}`,
        404
    );
}

function errorHandler(err, req, res, next) {
    console.error("API Error:", err);

    if (res.headersSent) {
        return next(err);
    }

    if (err.code === "23505") {
        return error(
            res,
            "A record with this value already exists",
            409
        );
    }

    if (err.code === "23503") {
        return error(
            res,
            "Referenced record does not exist",
            400
        );
    }

    return error(
        res,
        process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message,
        err.statusCode || 500
    );
}

module.exports = {
    notFoundHandler,
    errorHandler
};