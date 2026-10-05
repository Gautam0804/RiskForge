import api from "./api";


export async function getTransactions(params = {}) {

    const queryParams = {};


    if (params.page) {
        queryParams.page = params.page;
    }


    if (params.limit) {
        queryParams.limit = params.limit;
    }


    if (params.search?.trim()) {
        queryParams.search =
            params.search.trim();
    }


    if (
        params.riskLevel &&
        params.riskLevel !== "all"
    ) {
        queryParams.riskLevel =
            params.riskLevel;
    }


    if (
        params.status &&
        params.status !== "all"
    ) {
        queryParams.status =
            params.status;
    }


    const response =
        await api.get(
            "/transactions",
            {
                params: queryParams
            }
        );


    return response.data.data;
}


export async function getTransactionById(
    transactionId
) {

    const response =
        await api.get(
            `/transactions/${transactionId}`
        );


    return response.data.data;
}