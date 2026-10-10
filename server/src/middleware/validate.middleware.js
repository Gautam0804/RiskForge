const { error } = require("../utils/apiResponse");

function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body || {},
            params: req.params || {},
            query: req.query || {}
        });

        if (!result.success) {
            // Never log request bodies: they may contain passwords or tokens.
            console.warn("Request validation failed:", {
                method: req.method,
                url: req.originalUrl,
                issues: result.error.issues.map((issue) => ({
                    path: issue.path,
                    message: issue.message,
                    code: issue.code
                }))
            });

            return error(
                res,
                "Validation failed",
                400,
                result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            );
        }

        req.validated = result.data;
        next();
    };
}

module.exports = validate;