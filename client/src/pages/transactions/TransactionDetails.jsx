import { useEffect, useState } from "react";
import { ArrowLeft, AlertTriangle, ShieldCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import RiskBadge from "../../components/common/RiskBadge";
import StatusBadge from "../../components/common/StatusBadge";

import { getTransactionById } from "../../services/transaction.service";

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

function DetailItem({ label, value }) {
    return (
        <div className="transaction-detail-item">
            <span>{label}</span>
            <strong>{value ?? "-"}</strong>
        </div>
    );
}

export default function TransactionDetails() {
    const navigate = useNavigate();
    const { transactionId } = useParams();

    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTransaction() {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getTransactionById(transactionId);

                setTransaction(data);
            } catch (err) {
                console.error(
                    "Transaction details loading failed:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                        "Unable to load transaction details"
                );
            } finally {
                setLoading(false);
            }
        }

        loadTransaction();
    }, [transactionId]);

    if (loading) {
        return (
            <div className="table-state">
                Loading transaction details...
            </div>
        );
    }

    if (error) {
        return (
            <div className="transactions-page">
                <button
                    className="refresh-button"
                    onClick={() => navigate("/transactions")}
                >
                    <ArrowLeft size={16} />
                    Back to Transactions
                </button>

                <div className="table-state table-error">
                    {error}
                </div>
            </div>
        );
    }

    const riskFactors = transaction?.risk_factors;

    return (
        <div className="transactions-page">
            <div className="transactions-heading">
                <PageHeader
                    title="Transaction Details"
                    description="Review transaction risk and investigation information."
                />

                <button
                    className="refresh-button"
                    onClick={() => navigate("/transactions")}
                >
                    <ArrowLeft size={16} />
                    Back to Transactions
                </button>
            </div>

            <div className="dashboard-card transaction-details-card">
                <div className="transaction-details-top">
                    <div>
                        <span className="detail-label">
                            Transaction ID
                        </span>

                        <h2 className="transaction-details-id">
                            {transaction.transaction_id}
                        </h2>
                    </div>

                    <div className="transaction-details-badges">
                        <RiskBadge
                            risk={transaction.risk_level}
                        />

                        <StatusBadge
                            status={transaction.status}
                        />
                    </div>
                </div>

                <div className="transaction-detail-grid">
                    <DetailItem
                        label="Merchant"
                        value={transaction.merchant}
                    />

                    <DetailItem
                        label="Amount"
                        value={formatAmount(
                            transaction.amount,
                            transaction.currency
                        )}
                    />

                    <DetailItem
                        label="Risk Score"
                        value={transaction.risk_score}
                    />

                    <DetailItem
                        label="Fraud Probability"
                        value={
                            transaction.fraud_probability !== null &&
                            transaction.fraud_probability !== undefined
                                ? `${transaction.fraud_probability}%`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="Device ID"
                        value={transaction.device_id}
                    />

                    <DetailItem
                        label="Location"
                        value={transaction.location_city}
                    />

                    <DetailItem
                        label="Transaction Type"
                        value={transaction.transaction_type}
                    />

                    <DetailItem
                        label="Created At"
                        value={formatDate(transaction.created_at)}
                    />

                    <DetailItem
                        label="User Email"
                        value={transaction.email}
                    />

                    <DetailItem
                        label="User Name"
                        value={transaction.full_name}
                    />
                </div>
            </div>

            <div className="dashboard-card">
                <div className="section-heading">
                    <ShieldCheck size={20} />
                    <h3>Risk Factors</h3>
                </div>

                {Array.isArray(riskFactors) &&
                riskFactors.length > 0 ? (
                    <div className="risk-factors">
                        {riskFactors.map((factor, index) => (
                            <div
                                className="risk-factor"
                                key={index}
                            >
                                <AlertTriangle size={16} />
                                <span>
                                    {typeof factor === "string"
                                        ? factor
                                        : JSON.stringify(factor)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="muted-text">
                        No risk factors recorded.
                    </p>
                )}
            </div>
        </div>
    );
}
