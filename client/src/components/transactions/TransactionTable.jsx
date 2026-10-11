
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RiskBadge from "../common/RiskBadge";
import StatusBadge from "../common/StatusBadge";
import "./TransactionTable.css";

function formatAmount(amount, currency = "INR") {
    const numericAmount = Number(amount);

    return `${currency} ${
        Number.isFinite(numericAmount)
            ? numericAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })
            : "0.00"
    }`;
}

function formatDate(date) {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function getTransactionId(transaction) {
    return transaction?.transaction_id ?? transaction?.id ?? null;
}

export default function TransactionTable({
    transactions = [],
    loading = false,
    error = null,
    onEdit,
    onDelete,
    actionLoadingId = null,
}) {
    const navigate = useNavigate();

    const [deleteCandidate, setDeleteCandidate] = useState(null);
    const [actionError, setActionError] = useState("");
    const [deleting, setDeleting] = useState(false);

    async function handleEdit(event, transaction) {
        event.stopPropagation();
        setActionError("");

        if (typeof onEdit !== "function") {
            setActionError(
                "Edit handler is missing. Check Transactions.jsx."
            );
            return;
        }

        try {
            await onEdit(transaction);
        } catch (err) {
            setActionError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Unable to open the edit form."
            );
        }
    }

    function handleDeleteClick(event, transaction) {
        event.stopPropagation();
        setActionError("");

        if (typeof onDelete !== "function") {
            setActionError(
                "Delete handler is missing. Check Transactions.jsx."
            );
            return;
        }

        setDeleteCandidate(transaction);
    }

    async function confirmDelete() {
        if (!deleteCandidate || deleting) return;

        try {
            setDeleting(true);
            setActionError("");

            await onDelete(deleteCandidate);

            setDeleteCandidate(null);
        } catch (err) {
            setActionError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Unable to delete this transaction."
            );
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="table-state" role="status">
                Loading transactions...
            </div>
        );
    }

    if (error) {
        return (
            <div className="table-state table-error" role="alert">
                {error}
            </div>
        );
    }

    if (!transactions.length) {
        return (
            <div className="table-state">
                No transactions found.
            </div>
        );
    }

    const actionButtonStyle = {
        display: "inline-flex",
        visibility: "visible",
        opacity: 1,
        position: "relative",
        zIndex: 5,
        alignItems: "center",
        justifyContent: "center",
        minWidth: "54px",
        minHeight: "32px",
        marginRight: "6px",
        padding: "6px 10px",
        borderRadius: "7px",
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
    };

    return (
        <div className="transaction-table-section">
            {actionError && (
                <div
                    className="transaction-action-error"
                    role="alert"
                >
                    <span>{actionError}</span>

                    <button
                        type="button"
                        onClick={() => setActionError("")}
                        aria-label="Dismiss error"
                    >
                        ×
                    </button>
                </div>
            )}

            <div
                className="transaction-table-wrapper"
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    overflowX: "auto",
                }}
            >
                <table
                    className="transaction-table"
                    style={{
                        width: "100%",
                        minWidth: "1120px",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                    }}
                >
                    <thead>
                        <tr>
                            <th>Transaction</th>
                            <th>Merchant</th>
                            <th>Amount</th>
                            <th>Risk Score</th>
                            <th>Risk Level</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th
                                style={{
                                    minWidth: "160px",
                                    position: "sticky",
                                    right: 0,
                                    zIndex: 10,
                                    background: "#151e2e",
                                }}
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((transaction) => {
                            const transactionId =
                                getTransactionId(transaction);

                            const rowActionLoading =
                                String(actionLoadingId) ===
                                String(transactionId);

                            return (
                                <tr
                                    key={
                                        transactionId ??
                                        `${transaction.merchant}-${transaction.created_at}`
                                    }
                                    className="transaction-row-clickable"
                                    onClick={() => {
                                        if (transactionId) {
                                            navigate(
                                                `/transactions/${transactionId}`
                                            );
                                        }
                                    }}
                                    title="View transaction details"
                                >
                                    <td className="transaction-id">
                                        {transactionId ?? "-"}
                                    </td>

                                    <td>
                                        {transaction.merchant || "-"}
                                    </td>

                                    <td className="amount-cell">
                                        {formatAmount(
                                            transaction.amount,
                                            transaction.currency
                                        )}
                                    </td>

                                    <td>
                                        <span className="risk-score">
                                            {transaction.risk_score ?? 0}
                                        </span>
                                    </td>

                                    <td>
                                        <RiskBadge
                                            risk={transaction.risk_level}
                                        />
                                    </td>

                                    <td>
                                        <StatusBadge
                                            status={transaction.status}
                                        />
                                    </td>

                                    <td className="time-cell">
                                        {formatDate(transaction.created_at)}
                                    </td>

                                    <td
                                        className="transaction-row-actions"
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                        style={{
                                            minWidth: "160px",
                                            whiteSpace: "nowrap",
                                            position: "sticky",
                                            right: 0,
                                            zIndex: 5,
                                            background: "#111827",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            className="transaction-edit-button"
                                            style={{
                                                ...actionButtonStyle,
                                                color: "#ffffff",
                                                background: "#2563eb",
                                                border: "1px solid #60a5fa",
                                            }}
                                            disabled={rowActionLoading}
                                            onClick={(event) =>
                                                handleEdit(event, transaction)
                                            }
                                            title="Edit transaction"
                                        >
                                            {rowActionLoading
                                                ? "Working..."
                                                : "Edit"}
                                        </button>

                                        <button
                                            type="button"
                                            className="transaction-delete-button"
                                            style={{
                                                ...actionButtonStyle,
                                                color: "#ffffff",
                                                background: "#dc2626",
                                                border: "1px solid #f87171",
                                            }}
                                            disabled={rowActionLoading}
                                            onClick={(event) =>
                                                handleDeleteClick(
                                                    event,
                                                    transaction
                                                )
                                            }
                                            title="Delete transaction"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {deleteCandidate && (
                <div
                    className="transaction-confirm-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !deleting
                        ) {
                            setDeleteCandidate(null);
                        }
                    }}
                >
                    <section
                        className="transaction-confirm-dialog"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-transaction-title"
                        aria-describedby="delete-transaction-description"
                    >
                        <h2 id="delete-transaction-title">
                            Delete transaction?
                        </h2>

                        <p id="delete-transaction-description">
                            This will permanently delete transaction{" "}
                            <strong>
                                {getTransactionId(deleteCandidate) ??
                                    "selected transaction"}
                            </strong>
                            . This action cannot be undone.
                        </p>

                        <div className="transaction-confirm-actions">
                            <button
                                type="button"
                                className="transaction-cancel-button"
                                disabled={deleting}
                                onClick={() =>
                                    setDeleteCandidate(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="transaction-confirm-delete-button"
                                disabled={deleting}
                                onClick={confirmDelete}
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Confirm delete"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
