const userModel =
    require("../models/user.model");


const {
    hashPassword,
    comparePassword
} = require("../utils/password");


const {
    generateToken
} = require("../utils/jwt");


/* =========================================
   REGISTER
========================================= */

async function register({
    email,
    password,
    fullName
}) {

    const existing =
        await userModel.findByEmail(
            email
        );


    if (existing) {

        const error =
            new Error(
                "Email is already registered"
            );

        error.statusCode = 409;

        throw error;
    }


    const passwordHash =
        await hashPassword(
            password
        );


    const user =
        await userModel.createUser({
            email,
            passwordHash,
            fullName
        });


    const token =
        generateToken({
            sub: user.id,
            email: user.email,
            role: user.role,
            tokenVersion:
                user.token_version ?? 0
        });


    return {
        user,
        token
    };
}


/* =========================================
   LOGIN
========================================= */

async function login({
    email,
    password
}) {

    const user =
        await userModel.findByEmail(
            email
        );


    if (
        !user ||
        !user.is_active
    ) {

        const error =
            new Error(
                "Invalid email or password"
            );

        error.statusCode = 401;

        throw error;
    }


    const valid =
        await comparePassword(
            password,
            user.password_hash
        );


    if (!valid) {

        const error =
            new Error(
                "Invalid email or password"
            );

        error.statusCode = 401;

        throw error;
    }


    await userModel.updateLastLogin(
        user.id
    );


    delete user.password_hash;


    const token =
        generateToken({
            sub: user.id,
            email: user.email,
            role: user.role,
            tokenVersion:
                user.token_version ?? 0
        });


    return {
        user,
        token
    };
}


/* =========================================
   CHANGE PASSWORD
========================================= */

async function changePassword(
    userId,
    currentPassword,
    newPassword
) {

    const user =
        await userModel.findByIdWithPassword(
            userId
        );


    if (!user) {

        const error =
            new Error(
                "User account not found"
            );

        error.statusCode = 404;

        throw error;
    }


    if (!user.is_active) {

        const error =
            new Error(
                "User account is inactive"
            );

        error.statusCode = 403;

        throw error;
    }


    /* -------------------------------------
       VERIFY CURRENT PASSWORD
    ------------------------------------- */

    const currentPasswordValid =
        await comparePassword(
            currentPassword,
            user.password_hash
        );


    if (!currentPasswordValid) {

        const error =
            new Error(
                "Current password is incorrect"
            );

        error.statusCode = 401;

        throw error;
    }


    /* -------------------------------------
       PREVENT SAME PASSWORD
    ------------------------------------- */

    const samePassword =
        await comparePassword(
            newPassword,
            user.password_hash
        );


    if (samePassword) {

        const error =
            new Error(
                "New password must be different from the current password"
            );

        error.statusCode = 400;

        throw error;
    }


    /* -------------------------------------
       HASH NEW PASSWORD
    ------------------------------------- */

    const newPasswordHash =
        await hashPassword(
            newPassword
        );


    /* -------------------------------------
       UPDATE PASSWORD + INVALIDATE TOKENS
    ------------------------------------- */

    const updatedUser =
        await userModel.updatePassword(
            userId,
            newPasswordHash
        );


    if (!updatedUser) {

        const error =
            new Error(
                "Unable to update password"
            );

        error.statusCode = 500;

        throw error;
    }


    return {
        success: true
    };
}


/* =========================================
   EXPORTS
========================================= */

module.exports = {
    register,
    login,
    changePassword
};