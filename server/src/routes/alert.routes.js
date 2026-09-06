const express = require("express");

const controller =
    require("../controllers/alert.controller");

const {
    authenticate
} = require("../middleware/auth.middleware");

const asyncHandler =
    require("../utils/asyncHandler");

const router =
    express.Router();

router.use(authenticate);

router.get(
    "/",
    asyncHandler(controller.list)
);

module.exports = router;