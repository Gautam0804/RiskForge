const authService =
    require("../services/auth.service");

const userModel =
    require("../models/user.model");

const {
    success
} = require("../utils/apiResponse");

async function register(req, res) {
    const result =
        await authService.register(
            req.validated.body
        );

    return success(
        res,
        result,
        "Account created successfully",
        201
    );
}

async function login(req, res) {
    const result =
        await authService.login(
            req.validated.body
        );

    return success(
        res,
        result,
        "Login successful"
    );
}

async function me(req, res) {
    const user =
        await userModel.findById(
            req.user.sub
        );

    return success(
        res,
        { user },
        "User profile"
    );
}

module.exports = {
    register,
    login,
    me
};