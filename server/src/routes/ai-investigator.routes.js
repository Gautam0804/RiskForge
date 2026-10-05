const express = require("express");

const {
    authenticate
} = require("../middleware/auth.middleware");

const asyncHandler =
    require("../utils/asyncHandler");

const controller =
    require("../controllers/ai-investigator.controller");


const router =
    express.Router();


/*
 * All AI Investigator routes
 * require authentication.
 */
router.use(authenticate);


/*
 * GET
 * /api/ai-investigator/:transactionId
 */
router.get(
    "/:transactionId",
    asyncHandler(
        controller.investigate
    )
);


module.exports = router;