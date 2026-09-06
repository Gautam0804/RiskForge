const { verifyToken } = require("../utils/jwt");
const { error } = require("../utils/apiResponse");

function authenticate(req, res, next) {
    const authorization =
        req.headers.authorization;

    if (!authorization) {
        return error(
            res,
            "Authentication required",
            401
        );
    }

    const [scheme, token] =
        authorization.split(" ");

    if (
        scheme !== "Bearer" ||
        !token
    ) {
        return error(
            res,
            "Invalid authorization format",
            401
        );
    }

    try {
        const decoded = verifyToken(token);

        req.user = decoded;

        next();
    } catch {
        return error(
            res,
            "Invalid or expired token",
            401
        );
    }
}

function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return error(
                res,
                "Authentication required",
                401
            );
        }

        if (!roles.includes(req.user.role)) {
            return error(
                res,
                "Insufficient permissions",
                403
            );
        }

        next();
    };
}

module.exports = {
    authenticate,
    authorize
};