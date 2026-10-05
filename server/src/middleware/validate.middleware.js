const { error } = require("../utils/apiResponse");

function validate(schema) {
    return (req, res, next) => {
        console.log("VALIDATION REQUEST:", {
            method: req.method,
            url: req.originalUrl,
            params: req.params,
            body: req.body,
            query: req.query
        });

        const result = schema.safeParse({
            body: req.body || {},
            params: req.params || {},
            query: req.query || {}
        });

        if (!result.success) {
            console.log("VALIDATION ERROR:", result.error.issues);

            return error(
                res,
                "Validation failed",
                400,
                result.error.issues.map((issue) => ({
                    path: issue.path,
                    message: issue.message
                }))
            );
        }

        req.validated = result.data;
        next();
    };
}

module.exports = validate;
