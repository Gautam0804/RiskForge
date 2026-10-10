
const { verifyToken } = require("../utils/jwt");
const { error } = require("../utils/apiResponse");
const userModel = require("../models/user.model");

async function authenticate(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return error(
            res,
            "Authentication required",
            401
        );
    }

    const [scheme, token, ...extra] = authorization.split(" ");

    if (
        scheme !== "Bearer" ||
        !token ||
        extra.length > 0
    ) {
        return error(
            res,
            "Invalid authorization format",
            401
        );
    }

    let decoded;

    try {
        decoded = verifyToken(token);
    } catch {
        return error(
            res,
            "Invalid or expired token",
            401
        );
    }

    // Validate required JWT claims.
    if (
        !decoded.sub ||
        !Number.isInteger(decoded.tokenVersion)
    ) {
        return error(
            res,
            "Invalid or expired token",
            401
        );
    }

    try {
        // Fetch the latest authentication state from PostgreSQL.
        const user = await userModel.findAuthStateById(
            decoded.sub
        );

        if (!user || !user.is_active) {
            return error(
                res,
                "Invalid or expired token",
                401
            );
        }

        // Reject tokens issued before a password/security change.
        if (user.token_version !== decoded.tokenVersion) {
            return error(
                res,
                "Session expired. Please log in again.",
                401
            );
        }

        // Use the current database role, not a stale JWT role.
        req.user = {
            ...decoded,
            id: user.id,
            role: user.role
        };

        return next();
    } catch (err) {
        // Let Express handle database/server errors.
        return next(err);
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

        return next();
    };
}

module.exports = {
    authenticate,
    authorize
};
