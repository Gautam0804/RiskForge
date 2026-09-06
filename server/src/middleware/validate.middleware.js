const { error } = require("../utils/apiResponse");

function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        });

        if (!result.success) {
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