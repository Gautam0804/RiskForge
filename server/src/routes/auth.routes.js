const express = require("express");

const controller =
    require("../controllers/auth.controller");

const validate =
    require("../middleware/validate.middleware");

const {
    authenticate
} = require("../middleware/auth.middleware");

const {
    authLimiter
} = require("../middleware/rateLimit.middleware");

const {
    registerSchema,
    loginSchema
} = require("../validators/auth.validator");

const asyncHandler =
    require("../utils/asyncHandler");

const router = express.Router();

router.post(
    "/register",
    authLimiter,
    validate(registerSchema),
    asyncHandler(controller.register)
);

router.post(
    "/login",
    authLimiter,
    validate(loginSchema),
    asyncHandler(controller.login)
);

router.get(
    "/me",
    authenticate,
    asyncHandler(controller.me)
);

module.exports = router;