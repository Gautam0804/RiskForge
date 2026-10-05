const express = require("express");

const controller = require("../controllers/dashboard.controller");

const {
    authenticate
} = require("../middleware/auth.middleware");

const asyncHandler =
    require("../utils/asyncHandler");

const router = express.Router();

router.use(authenticate);

router.get(
    "/overview",
    asyncHandler(controller.overview)
);

module.exports = router;