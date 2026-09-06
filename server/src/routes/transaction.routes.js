const express = require("express");

const controller =
    require("../controllers/transaction.controller");

const validate =
    require("../middleware/validate.middleware");

const {
    authenticate
} = require("../middleware/auth.middleware");

const asyncHandler =
    require("../utils/asyncHandler");

const {
    createTransactionSchema,
    transactionIdSchema
} = require("../validators/transaction.validator");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    asyncHandler(controller.list)
);

router.get(
    "/:transactionId",
    validate(transactionIdSchema),
    asyncHandler(controller.getOne)
);

router.post(
    "/",
    validate(createTransactionSchema),
    asyncHandler(controller.create)
);

module.exports = router;