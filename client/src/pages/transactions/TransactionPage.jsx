import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../../services/transaction.service";

function TransactionPage() {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [riskLevel, setRiskLevel] = useState("all");
    const [status, setStatus] = useState("all");

    async function loadTransactions() {
        try {
            setLoading(true);
            setError("");

            const data = await getTransactions();

            setTransactions(data?.transactions || []);
        } catch (err) {
            console.error("Transactions loading failed:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load transactions"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    const filteredTransactions = transactions.filter((transaction) => {
        const merchant = transaction.merchant || "";
        const transactionId = transaction.transaction_id || "";

        const matchesSearch =
            merchant.toLowerCase().includes(search.toLowerCase()) ||
            transactionId.toLowerCase().includes(search.toLowerCase());

        const transactionRisk = (
            transaction.risk_level ||
            ""
        ).toLowerCase();

        const transactionStatus = (
            transaction.status ||
            ""
        ).toLowerCase();

        const matchesRisk =
            riskLevel === "all" ||
            transactionRisk === riskLevel;

        const matchesStatus =
            status === "all" ||
            transactionStatus === status;

        return matchesSearch && matchesRisk && matchesStatus;
    });

    function formatAmount(amount, currency = "INR") {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 2
        }).format(Number(amount || 0));
    }

    function formatDate(date) {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }

    function formatText(value) {
        if (!value) return "N/A";

        return value
            .toString()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    function getRiskClass(riskLevelValue) {
        const risk = (riskLevelValue || "").toLowerCase();

        if (risk === "critical") return "risk-badge critical";
        if (risk === "high") return "risk-badge high";
        if (risk === "medium") return "risk-badge medium";
        if (risk === "low") return "risk-badge low";

        return "risk-badge";
    }

    function getStatusClass(statusValue) {
        const currentStatus = (statusValue || "").toLowerCase();

        if (
            currentStatus === "approved" ||
            currentStatus === "completed" ||
            currentStatus === "success"
        ) {
            return "status-badge success";
        }

        if (
            currentStatus === "blocked" ||
            currentStatus === "failed" ||
            currentStatus === "rejected"
        ) {
            return "status-badge danger";
        }

        if (
            currentStatus === "pending" ||
            currentStatus === "review"
        ) {
            return "status-badge warning";
        }

        return "status-badge";
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Transactions</h1>
                    <p>
                        Review and monitor your transaction activity.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate("/transactions/create")
                    }
                >
                    + Create Transaction
                </button>
            </div>

            <div className="transaction-toolbar">
                <input
                    type="text"
                    placeholder="Search merchant or transaction ID..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

                <select
                    value={riskLevel}
                    onChange={(event) =>
                        setRiskLevel(event.target.value)
                    }
                >
                    <option value="all">All Risk Levels</option>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                    <option value="critical">Critical Risk</option>
                </select>

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value)
                    }
                >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="review">Review</option>
                    <option value="blocked">Blocked</option>
                    <option value="failed">Failed</option>
                </select>

                <button
                    className="secondary-button"
                    onClick={loadTransactions}
                >
                    Refresh
                </button>
            </div>

            {loading && (
                <div className="state-card">
                    <p>Loading transactions...</p>
                </div>
            )}

            {!loading && error && (
                <div className="state-card error-state">
                    <p>{error}</p>

                    <button
                        className="secondary-button"
                        onClick={loadTransactions}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="table-card">
                    <div className="table-header">
                        <div>
                            <h2>Transaction History</h2>
                            <p>
                                {filteredTransactions.length} transaction(s)
                                found
                            </p>
                        </div>
                    </div>

                    {filteredTransactions.length === 0 ? (
                        <div className="empty-state">
                            <h3>No transactions found</h3>
                            <p>
                                Try changing your search or filter.
                            </p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="transactions-table">
                                <thead>
                                    <tr>
                                        <th>Merchant</th>
                                        <th>Amount</th>
                                        <th>Risk Level</th>
                                        <th>Status</th>
                                        <th>Transaction Type</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredTransactions.map(
                                        (transaction) => (
                                            <tr
                                                key={
                                                    transaction.transaction_id
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/transactions/${transaction.transaction_id}`
                                                    )
                                                }
                                                className="clickable-row"
                                            >
                                                <td>
                                                    <div className="merchant-cell">
                                                        <strong>
                                                            {
                                                                transaction.merchant
                                                            }
                                                        </strong>

                                                        <small>
                                                            {transaction.transaction_id?.slice(
                                                                0,
                                                                8
                                                            )}
                                                            ...
                                                        </small>
                                                    </div>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {formatAmount(
                                                            transaction.amount,
                                                            transaction.currency ||
                                                                "INR"
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span
                                                        className={getRiskClass(
                                                            transaction.risk_level
                                                        )}
                                                    >
                                                        {formatText(
                                                            transaction.risk_level
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={getStatusClass(
                                                            transaction.status
                                                        )}
                                                    >
                                                        {formatText(
                                                            transaction.status
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    {formatText(
                                                        transaction.transaction_type
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        transaction.created_at
                                                    )}
                                                </td>

                                                <td>
                                                    <button
                                                        className="view-button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();

                                                            navigate(
                                                                `/transactions/${transaction.transaction_id}`
                                                            );
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TransactionPage;