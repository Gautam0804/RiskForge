const express = require("express");

const controller =
    require("../controllers/investigation.controller");

const {
    authenticate
} = require("../middleware/auth.middleware");

const asyncHandler =
    require("../utils/asyncHandler");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    asyncHandler(controller.list)
);

router.patch(
    "/:id/status",
    asyncHandler(controller.updateStatus)
);

module.exports = router;