const crypto = require("crypto");

const transactionModel =
    require("../models/transaction.model");

const {
    calculateRisk
} = require("./risk.service");

function generateTransactionId() {
    return `TXN-${crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase()}`;
}

async function createTransaction(data) {
    const risk =
        calculateRisk(data);

    const transaction =
        await transactionModel.createTransaction({
            ...data,

            transactionId:
                generateTransactionId(),

            ...risk,

            metadata: {}
        });

    return transaction;
}

async function getTransaction(
    transactionId
) {
    return transactionModel.findById(
        transactionId
    );
}

async function getTransactions(options) {
    return transactionModel.listTransactions(
        options
    );
}

module.exports = {
    createTransaction,
    getTransaction,
    getTransactions
};