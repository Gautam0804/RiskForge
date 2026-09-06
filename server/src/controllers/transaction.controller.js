const transactionService =
    require("../services/transaction.service");

const {
    success,
    error
} = require("../utils/apiResponse");

async function create(req, res) {
    const transaction =
        await transactionService.createTransaction(
            req.validated.body
        );

    return success(
        res,
        { transaction },
        "Transaction processed",
        201
    );
}

async function list(req, res) {
    const page =
        Math.max(
            Number(req.query.page) || 1,
            1
        );

    const limit =
        Math.min(
            Math.max(
                Number(req.query.limit) || 20,
                1
            ),
            100
        );

    const search =
        req.query.search || null;

    const offset =
        (page - 1) * limit;

    const transactions =
        await transactionService.getTransactions({
            limit,
            offset,
            search
        });

    return success(
        res,
        {
            transactions,
            pagination: {
                page,
                limit,
                hasMore:
                    transactions.length === limit
            }
        },
        "Transactions retrieved"
    );
}

async function getOne(req, res) {
    const transaction =
        await transactionService.getTransaction(
            req.validated.params.transactionId
        );

    if (!transaction) {
        return error(
            res,
            "Transaction not found",
            404
        );
    }

    return success(
        res,
        { transaction },
        "Transaction retrieved"
    );
}

module.exports = {
    create,
    list,
    getOne
};