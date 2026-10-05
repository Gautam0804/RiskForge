const transactionService = require("../services/transaction.service");

async function create(req, res) {
    const result =
        await transactionService.createTransaction({
            userId: req.user.sub,
            merchant: req.body.merchant,
            amount: req.body.amount,
            currency: req.body.currency,
            deviceId: req.body.deviceId,
            locationCity: req.body.locationCity,
            transactionType: req.body.transactionType
        });

    return res.status(201).json({
        success: true,
        message: "Transaction processed successfully",
        data: result
    });
}

async function list(req, res) {
    const result =
        await transactionService.listTransactions({
            userId: req.user.sub,
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            riskLevel: req.query.riskLevel,
            status: req.query.status
        });

    return res.status(200).json({
        success: true,
        message: "Transactions retrieved successfully",
        data: result
    });
}

async function getOne(req, res) {
    const result =
        await transactionService.getTransactionById(
            req.user.sub,
            req.params.transactionId
        );

    return res.status(200).json({
        success: true,
        message: "Transaction retrieved successfully",
        data: result
    });
}

module.exports = {
    create,
    list,
    getOne
};
