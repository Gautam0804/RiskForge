import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    RefreshCw,
    AlertTriangle,
    Plus,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import PageHeader
    from "../../components/common/PageHeader";

import TransactionFilters
    from "../../components/transactions/TransactionFilters";

import TransactionTable
    from "../../components/transactions/TransactionTable";

import { getTransactions }
    from "../../services/transaction.service";

import "./Transactions.css";


export default function Transactions() {

    const navigate =
        useNavigate();


    const [
        transactions,
        setTransactions
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        refreshing,
        setRefreshing
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        search,
        setSearch
    ] = useState("");


    const [
        risk,
        setRisk
    ] = useState("all");


    const [
        status,
        setStatus
    ] = useState("all");


    const [
        page,
        setPage
    ] = useState(1);


    const [
        pagination,
        setPagination
    ] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1
    });


    const limit = 20;


    async function loadTransactions(
        isRefresh = false,
        requestedPage = page
    ) {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }


            setError("");


            const params = {
                page: requestedPage,
                limit,
                search:
                    search.trim() || undefined,
                riskLevel:
                    risk !== "all"
                        ? risk
                        : undefined,
                status:
                    status !== "all"
                        ? status
                        : undefined
            };


            const data =
                await getTransactions(params);


            const transactionList =
                Array.isArray(data)
                    ? data
                    : data?.transactions ||
                      data?.data?.transactions ||
                      [];


            const paginationData =
                data?.pagination ||
                data?.data?.pagination;


            setTransactions(
                transactionList
            );


            if (paginationData) {

                setPagination(
                    paginationData
                );

            } else {

                setPagination({
                    page: requestedPage,
                    limit,
                    total:
                        transactionList.length,
                    totalPages:
                        Math.max(
                            1,
                            Math.ceil(
                                transactionList.length /
                                    limit
                            )
                        )
                });

            }

        } catch (err) {

            console.error(
                "Transaction loading failed:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load transactions"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    }


    useEffect(() => {

        setPage(1);

        loadTransactions(
            false,
            1
        );

        // Search/filter changes intentionally
        // reload the backend dataset.
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [
        search,
        risk,
        status
    ]);


    function handlePageChange(
        nextPage
    ) {

        if (
            nextPage < 1 ||
            nextPage >
                pagination.totalPages
        ) {
            return;
        }


        setPage(nextPage);


        loadTransactions(
            false,
            nextPage
        );
    }


    function resetFilters() {

        setSearch("");
        setRisk("all");
        setStatus("all");
        setPage(1);
    }


    function exportTransactions() {

        if (
            !transactions.length
        ) {
            return;
        }


        const headers = [
            "Transaction ID",
            "Merchant",
            "Amount",
            "Currency",
            "Location",
            "Transaction Type",
            "Risk Score",
            "Fraud Probability",
            "Risk Level",
            "Status",
            "Created At"
        ];


        const rows =
            transactions.map(
                (transaction) => [

                    transaction.transaction_id,

                    transaction.merchant,

                    transaction.amount,

                    transaction.currency,

                    transaction.location_city,

                    transaction.transaction_type,

                    transaction.risk_score,

                    transaction.fraud_probability,

                    transaction.risk_level,

                    transaction.status,

                    transaction.created_at

                ]
            );


        const csv =
            [headers, ...rows]
                .map(
                    (row) =>
                        row
                            .map(
                                (value) =>
                                    `"${String(
                                        value ??
                                            ""
                                    ).replaceAll(
                                        '"',
                                        '""'
                                    )}"`
                            )
                            .join(",")
                )
                .join("\n");


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            `riskforge-transactions-page-${page}.csv`;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );
    }


    return (

        <div className="transactions-page">


            {/* HEADER */}

            <div className="transactions-heading">

                <PageHeader
                    title="Transactions"
                    description="Monitor and investigate transaction activity in real time."
                />


                <div className="transactions-actions">

                    <button
                        type="button"
                        className="create-transaction-button"
                        onClick={() =>
                            navigate(
                                "/transactions/create"
                            )
                        }
                    >

                        <Plus size={16} />

                        Create Transaction

                    </button>


                    <button
                        type="button"
                        className="refresh-button"
                        onClick={() =>
                            loadTransactions(
                                true,
                                page
                            )
                        }
                        disabled={
                            refreshing
                        }
                    >

                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "spin-icon"
                                    : ""
                            }
                        />


                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}

                    </button>

                </div>

            </div>



            {/* ERROR */}

            {error && (

                <div className="dashboard-warning">

                    <AlertTriangle
                        size={18}
                    />

                    <span>
                        {error}
                    </span>

                </div>

            )}



            {/* FILTERS */}

            <TransactionFilters

                search={search}

                setSearch={
                    (value) => {
                        setPage(1);
                        setSearch(value);
                    }
                }

                risk={risk}

                setRisk={
                    (value) => {
                        setPage(1);
                        setRisk(value);
                    }
                }

                status={status}

                setStatus={
                    (value) => {
                        setPage(1);
                        setStatus(value);
                    }
                }

                onReset={
                    resetFilters
                }

                onExport={
                    exportTransactions
                }

            />



            {/* SUMMARY */}

            <div className="transaction-summary">

                Showing{" "}

                <strong>
                    {transactions.length}
                </strong>

                {" "}of{" "}

                <strong>
                    {pagination.total}
                </strong>

                {" "}transactions

                {pagination.totalPages >
                    1 && (

                    <span>
                        {" "}• Page{" "}
                        <strong>
                            {pagination.page}
                        </strong>
                        {" "}of{" "}
                        <strong>
                            {pagination.totalPages}
                        </strong>
                    </span>

                )}

            </div>



            {/* TABLE */}

            <div className="dashboard-card">

                <TransactionTable
                    transactions={
                        transactions
                    }
                    loading={
                        loading
                    }
                    error={
                        error
                    }
                />

            </div>



            {/* PAGINATION */}

            {!loading &&
                pagination.totalPages >
                    1 && (

                <div className="transaction-pagination">

                    <button
                        type="button"
                        onClick={() =>
                            handlePageChange(
                                page - 1
                            )
                        }
                        disabled={
                            page <= 1 ||
                            refreshing
                        }
                    >

                        <ChevronLeft
                            size={15}
                        />

                        Previous

                    </button>


                    <div className="pagination-pages">

                        {Array.from(
                            {
                                length:
                                    pagination.totalPages
                            },
                            (_, index) =>
                                index + 1
                        )
                            .slice(
                                Math.max(
                                    0,
                                    page - 3
                                ),
                                Math.min(
                                    pagination.totalPages,
                                    page + 2
                                )
                            )
                            .map(
                                (
                                    pageNumber
                                ) => (

                                    <button
                                        type="button"
                                        key={
                                            pageNumber
                                        }
                                        className={
                                            pageNumber ===
                                            page
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                pageNumber
                                            )
                                        }
                                    >
                                        {
                                            pageNumber
                                        }
                                    </button>

                                )
                            )}

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            handlePageChange(
                                page + 1
                            )
                        }
                        disabled={
                            page >=
                                pagination.totalPages ||
                            refreshing
                        }
                    >

                        Next

                        <ChevronRight
                            size={15}
                        />

                    </button>

                </div>

            )}

        </div>
    );
}