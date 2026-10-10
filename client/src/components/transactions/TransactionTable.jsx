import { useNavigate } from "react-router-dom";

import RiskBadge from "../common/RiskBadge";
import StatusBadge from "../common/StatusBadge";
import "./TransactionTable.css";

function formatAmount(amount, currency = "INR") {
    return `${currency} ${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

export default function TransactionTable({
    transactions,
    loading,
    error
}) {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="table-state">
                Loading transactions...
            </div>
        );
    }

    if (error) {
        return (
            <div className="table-state table-error">
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

    return (
        <div className="transaction-table-wrapper">
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>Transaction</th>
                        <th>Merchant</th>
                        <th>Amount</th>
                        <th>Risk Score</th>
                        <th>Risk Level</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>

                <tbody>
                    {transactions.map((transaction) => (
                        <tr
                            key={
                                transaction.id ||
                                transaction.transaction_id
                            }
                            className="transaction-row-clickable"
                            onClick={() =>
                                navigate(
                                    `/transactions/${transaction.transaction_id}`
                                )
                            }
                            title="View transaction details"
                        >
                            <td className="transaction-id">
                                {transaction.transaction_id}
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
