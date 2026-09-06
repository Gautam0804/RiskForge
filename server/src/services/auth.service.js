const userModel = require("../models/user.model");

const {
    hashPassword,
    comparePassword
} = require("../utils/password");

const {
    generateToken
} = require("../utils/jwt");

async function register({
    email,
    password,
    fullName
}) {
    const existing =
        await userModel.findByEmail(email);

    if (existing) {
        const error = new Error(
            "Email is already registered"
        );

        error.statusCode = 409;

        throw error;
    }

    const passwordHash =
        await hashPassword(password);

    const user =
        await userModel.createUser({
            email,
            passwordHash,
            fullName
        });

    const token = generateToken({
        sub: user.id,
        email: user.email,
        role: user.role
    });

    return {
        user,
        token
    };
}

async function login({
    email,
    password
}) {
    const user =
        await userModel.findByEmail(email);

    if (
        !user ||
        !user.is_active
    ) {
        const error = new Error(
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
        const error = new Error(
            "Invalid email or password"
        );

        error.statusCode = 401;

        throw error;
    }

    await userModel.updateLastLogin(
        user.id
    );

    const token = generateToken({
        sub: user.id,
        email: user.email,
        role: user.role
    });

    delete user.password_hash;

    return {
        user,
        token
    };
}

module.exports = {
    register,
    login
};