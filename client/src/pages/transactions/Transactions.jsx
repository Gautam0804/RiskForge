import { useEffect, useRef, useState } from "react";



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



import { getTransactions, updateTransaction, deleteTransaction }
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

    const requestIdRef = useRef(0);

    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editForm, setEditForm] = useState({
        merchant: "",
        amount: "",
        currency: "INR",
        location_city: "",
        transaction_type: "",
        status: "pending"
    });
    const [savingEdit, setSavingEdit] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [mutationError, setMutationError] = useState("");



    async function loadTransactions(

        isRefresh = false,

        requestedPage = page

    ) {

        const requestId = ++requestIdRef.current;



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

                search: search.trim() || undefined,

                riskLevel: risk !== "all" ? risk : undefined,

                status: status !== "all" ? status : undefined

            };



            const data = await getTransactions(params);



            // Ignore responses from older searches/pages that finish late.

            if (requestId !== requestIdRef.current) return;



            const transactionList = Array.isArray(data)

                ? data

                : Array.isArray(data?.transactions)

                    ? data.transactions

                    : Array.isArray(data?.data?.transactions)

                        ? data.data.transactions

                        : Array.isArray(data?.data)

                            ? data.data

                            : [];



            const rawPagination =

                data?.pagination || data?.data?.pagination;



            const total = Number(rawPagination?.total);

            const responseLimit = Number(rawPagination?.limit);

            const totalPages = Number(rawPagination?.totalPages);



            const normalizedPagination = {

                page: Math.max(

                    1,

                    Number(rawPagination?.page) || requestedPage

                ),

                limit: responseLimit > 0 ? responseLimit : limit,

                total: Number.isFinite(total) && total >= 0

                    ? total

                    : transactionList.length,

                totalPages: Number.isFinite(totalPages) && totalPages > 0

                    ? totalPages

                    : Math.max(

                        1,

                        Math.ceil(transactionList.length / limit)

                    )

            };



            setTransactions(transactionList);

            setPagination(normalizedPagination);



            // Keep the visible page aligned with the server response.

            setPage(normalizedPagination.page);

        } catch (err) {

            if (requestId !== requestIdRef.current) return;



            console.error("Transaction loading failed:", err);

            setError(

                err?.response?.data?.message ||

                err?.message ||

                "Unable to load transactions. Please try again."

            );

        } finally {

            if (requestId === requestIdRef.current) {

                setLoading(false);

                setRefreshing(false);

            }

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



    function openEditTransaction(transaction) {
        setMutationError("");
        setEditingTransaction(transaction);
        setEditForm({
            merchant: transaction.merchant ?? "",
            amount: transaction.amount ?? "",
            currency: transaction.currency ?? "INR",
            location_city: transaction.location_city ?? "",
            transaction_type: transaction.transaction_type ?? "",
            status: String(transaction.status ?? "pending").toLowerCase()
        });
    }

    async function saveTransactionEdit(event) {
        event.preventDefault();
        if (!editingTransaction) return;

        const transactionId = editingTransaction.transaction_id ?? editingTransaction.id;
        const amount = Number(editForm.amount);

        if (!editForm.merchant.trim()) {
            setMutationError("Merchant is required.");
            return;
        }
        if (!Number.isFinite(amount) || amount <= 0) {
            setMutationError("Enter an amount greater than zero.");
            return;
        }
        if (!editForm.currency.trim()) {
            setMutationError("Currency is required.");
            return;
        }

        try {
            setSavingEdit(true);
            setMutationError("");
            await updateTransaction(transactionId, {
                merchant: editForm.merchant.trim(),
                amount,
                currency: editForm.currency.trim().toUpperCase(),
                locationCity: editForm.location_city.trim(),
                transactionType: editForm.transaction_type.trim(),
                status: editForm.status
            });
            setEditingTransaction(null);
            await loadTransactions(true, page);
        } catch (err) {
            setMutationError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to update this transaction."
            );
        } finally {
            setSavingEdit(false);
        }
    }

    async function removeTransaction(transaction) {
        const transactionId = transaction?.transaction_id ?? transaction?.id;
        if (!transactionId) {
            throw new Error("This transaction has no valid ID.");
        }

        try {
            setDeletingId(transactionId);
            setMutationError("");
            await deleteTransaction(transactionId);

            // If the last row on this page was deleted, move back one page.
            const nextPage = transactions.length === 1 && page > 1 ? page - 1 : page;
            if (nextPage !== page) setPage(nextPage);
            await loadTransactions(true, nextPage);
        } catch (err) {
            setMutationError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to delete this transaction."
            );
            throw err;
        } finally {
            setDeletingId(null);
        }
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



        // Escape CSV values and neutralize spreadsheet formula prefixes.

        const escapeCsvValue = (value) => {

            let text = String(value ?? "");

            if (/^\s\*[=+\@-]/.test(text)) {

                text = `'${text}`;

            }

            return `"${text.replaceAll('"', '""')}"`;

        };



        const csv = "\uFEFF" + [headers, ...rows]

            .map((row) => row.map(escapeCsvValue).join(","))

            .join("\r\n");



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



        window.setTimeout(() => URL.revokeObjectURL(url), 1000);



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



                        disabled={refreshing || loading}

                        aria-label={refreshing ? "Refreshing transactions" : "Refresh transactions"}

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



                <div className="dashboard-warning" role="alert">



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



            <div className="transaction-summary" aria-live="polite">



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
                    transactions={transactions}
                    loading={loading}
                    error={error}
                    onEdit={openEditTransaction}
                    onDelete={removeTransaction}
                    actionLoadingId={deletingId}
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

                                            pageNumber === page ? "active" : ""

                                        }

                                        aria-current={pageNumber === page ? "page" : undefined}

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




            {mutationError && (
                <div className="dashboard-warning transaction-mutation-warning" role="alert">
                    <AlertTriangle size={18} />
                    <span>{mutationError}</span>
                    <button type="button" onClick={() => setMutationError("")} aria-label="Dismiss message">
                        ×
                    </button>
                </div>
            )}

            {editingTransaction && (
                <div
                    className="transaction-edit-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !savingEdit) {
                            setEditingTransaction(null);
                            setMutationError("");
                        }
                    }}
                >
                    <section
                        className="transaction-edit-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-transaction-title"
                    >
                        <div className="transaction-edit-dialog-header">
                            <div>
                                <h2 id="edit-transaction-title">Edit transaction</h2>
                                <p>{editingTransaction.transaction_id ?? editingTransaction.id}</p>
                            </div>
                            <button
                                type="button"
                                className="transaction-edit-close"
                                onClick={() => {
                                    if (!savingEdit) {
                                        setEditingTransaction(null);
                                        setMutationError("");
                                    }
                                }}
                                disabled={savingEdit}
                                aria-label="Close edit form"
                            >
                                ×
                            </button>
                        </div>

                        <form className="transaction-edit-form" onSubmit={saveTransactionEdit}>
                            <label>
                                Merchant
                                <input
                                    value={editForm.merchant}
                                    onChange={(event) => setEditForm((current) => ({ ...current, merchant: event.target.value }))}
                                    maxLength={160}
                                    required
                                />
                            </label>

                            <div className="transaction-edit-grid">
                                <label>
                                    Amount
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={editForm.amount}
                                        onChange={(event) => setEditForm((current) => ({ ...current, amount: event.target.value }))}
                                        required
                                    />
                                </label>
                                <label>
                                    Currency
                                    <input
                                        value={editForm.currency}
                                        onChange={(event) => setEditForm((current) => ({ ...current, currency: event.target.value }))}
                                        minLength={3}
                                        maxLength={3}
                                        required
                                    />
                                </label>
                            </div>

                            <label>
                                Location
                                <input
                                    value={editForm.location_city}
                                    onChange={(event) => setEditForm((current) => ({ ...current, location_city: event.target.value }))}
                                    maxLength={120}
                                />
                            </label>

                            <div className="transaction-edit-grid">
                                <label>
                                    Transaction type
                                    <input
                                        value={editForm.transaction_type}
                                        onChange={(event) => setEditForm((current) => ({ ...current, transaction_type: event.target.value }))}
                                        maxLength={80}
                                    />
                                </label>
                                <label>
                                    Status
                                    <select
                                        value={editForm.status}
                                        onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="completed">Completed</option>
                                        <option value="review">Review</option>
                                        <option value="flagged">Flagged</option>
                                        <option value="blocked">Blocked</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </label>
                            </div>

                            {mutationError && <p className="transaction-edit-inline-error" role="alert">{mutationError}</p>}

                            <div className="transaction-edit-form-actions">
                                <button
                                    type="button"
                                    className="transaction-edit-cancel"
                                    onClick={() => {
                                        setEditingTransaction(null);
                                        setMutationError("");
                                    }}
                                    disabled={savingEdit}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="transaction-edit-save" disabled={savingEdit}>
                                    {savingEdit ? "Saving…" : "Save changes"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

        </div>



    );



}
