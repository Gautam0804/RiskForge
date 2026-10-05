const jwt = require("jsonwebtoken");

const env =
    require("../config/env");


/* =========================================
   GENERATE TOKEN
========================================= */

function generateToken(payload) {

    return jwt.sign(
        payload,
        env.jwtSecret,
        {
            expiresIn:
                env.jwtExpiresIn
        }
    );
}


/* =========================================
   VERIFY TOKEN
========================================= */

function verifyToken(token) {

    return jwt.verify(
        token,
        env.jwtSecret
    );
}


module.exports = {
    generateToken,
    verifyToken
};