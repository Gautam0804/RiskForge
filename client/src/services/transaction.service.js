
import api from "./api";

function unwrapData(response) {
    return response?.data?.data ?? response?.data;
}

/*
|--------------------------------------------------------------------------
| GET TRANSACTIONS
|--------------------------------------------------------------------------
*/

export async function getTransactions(params = {}) {
    const queryParams = {};

    if (params.page) {
        queryParams.page = params.page;
    }

    if (params.limit) {
        queryParams.limit = params.limit;
    }

    if (params.search?.trim()) {
        queryParams.search = params.search.trim();
    }

    if (params.riskLevel && params.riskLevel !== "all") {
        queryParams.riskLevel = params.riskLevel;
    }

    if (params.status && params.status !== "all") {
        queryParams.status = params.status;
    }

    const response = await api.get("/transactions", {
        params: queryParams
    });

    return unwrapData(response);
}

/*
|--------------------------------------------------------------------------
| GET TRANSACTION BY ID
|--------------------------------------------------------------------------
*/

export async function getTransactionById(transactionId) {
    if (!transactionId) {
        throw new Error("Transaction ID is required.");
    }

    const response = await api.get(
        `/transactions/${encodeURIComponent(transactionId)}`
    );

    return unwrapData(response);
}

/*
|--------------------------------------------------------------------------
| UPDATE TRANSACTION
|--------------------------------------------------------------------------
*/

export async function updateTransaction(transactionId, payload = {}) {
    if (!transactionId) {
        throw new Error("Transaction ID is required.");
    }

    const response = await api.patch(
        `/transactions/${encodeURIComponent(transactionId)}`,
        payload
    );

    return unwrapData(response);
}

/*
|--------------------------------------------------------------------------
| DELETE TRANSACTION
|--------------------------------------------------------------------------
*/

export async function deleteTransaction(transactionId) {
    if (!transactionId) {
        throw new Error("Transaction ID is required.");
    }

    const response = await api.delete(
        `/transactions/${encodeURIComponent(transactionId)}`
    );

    return unwrapData(response);
}
