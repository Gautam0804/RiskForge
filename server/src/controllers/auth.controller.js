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


async function changePassword(req, res) {
    const userId =
        req.user.sub;

    const {
        currentPassword,
        newPassword
    } = req.body;


    if (
        !currentPassword ||
        !newPassword
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Current password and new password are required"
        });
    }


    if (newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message:
                "New password must be at least 8 characters long"
        });
    }


    if (
        currentPassword ===
        newPassword
    ) {
        return res.status(400).json({
            success: false,
            message:
                "New password must be different from current password"
        });
    }


    await authService.changePassword(
        userId,
        currentPassword,
        newPassword
    );


    return success(
        res,
        null,
        "Password changed successfully"
    );
}


module.exports = {
    register,
    login,
    me,
    changePassword
};