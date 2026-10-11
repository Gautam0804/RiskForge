
import { useCallback, useEffect, useState } from "react";
import {
    ArrowLeft,
    AlertTriangle,
    ShieldCheck,
    RefreshCw,
    MapPin,
    CalendarDays,
    CreditCard,
    UserRound,
    Fingerprint,
    Activity,
    ShieldAlert,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import RiskBadge from "../../components/common/RiskBadge";
import StatusBadge from "../../components/common/StatusBadge";

import { getTransactionById } from "../../services/transaction.service";
import "./TransactionDetails.css";


function formatAmount(amount, currency = "INR") {
    const numericAmount = Number(amount);

    if (amount === null || amount === undefined || amount === "" ||
        !Number.isFinite(numericAmount)) {
        return "-";
    }

    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency || "INR",
            maximumFractionDigits: 2,
        }).format(numericAmount);
    } catch {
        return `${currency || "INR"} ${numericAmount.toLocaleString("en-IN")}`;
    }
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

function formatLabel(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    return String(value)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatProbability(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    const probability = Number(value);

    if (!Number.isFinite(probability)) return "-";

    // Assumes the API returns fraud probability as a percentage.
    return `${probability}%`;
}

function getScoreWidth(value) {
    const score = Number(value);

    if (value === null || value === undefined || value === "" ||
        !Number.isFinite(score)) {
        return 0;
    }

    return Math.max(0, Math.min(100, score));
}

function getRiskDescription(riskLevel) {
    switch (String(riskLevel || "").toLowerCase()) {
        case "critical":
            return "Critical risk — prioritize this transaction for review.";
        case "high":
            return "High risk — review the transaction and its risk signals.";
        case "medium":
            return "Medium risk — inspect the available risk indicators.";
        case "low":
            return "Low risk — no elevated risk level is currently recorded.";
        default:
            return "Risk classification is unavailable for this transaction.";
    }
}

function DetailItem({ label, value, icon: Icon }) {
    const displayValue =
        value === null || value === undefined || value === ""
            ? "-"
            : value;

    return (
        <div className="transaction-detail-item">
            <div className="transaction-detail-label">
                {Icon && <Icon size={15} aria-hidden="true" />}
                <span>{label}</span>
            </div>

            <strong title={String(displayValue)}>
                {displayValue}
            </strong>
        </div>
    );
}

function LoadingState() {
    return (
        <div
            className="transaction-details-state"
            role="status"
            aria-live="polite"
        >
            <div className="transaction-loading-icon">
                <RefreshCw size={22} className="transaction-spin" />
            </div>

            <h2>Loading transaction</h2>
            <p>Retrieving transaction and risk information...</p>
        </div>
    );
}

function ErrorState({ message, onRetry, onBack }) {
    return (
        <div className="transactions-page transaction-details-page">
            <button
                type="button"
                className="refresh-button"
                onClick={onBack}
            >
                <ArrowLeft size={16} />
                Back to Transactions
            </button>

            <div className="transaction-details-state transaction-details-error">
                <div className="transaction-error-icon">
                    <AlertTriangle size={24} />
                </div>

                <h2>Unable to load transaction</h2>

                <p role="alert">
                    {message || "Something went wrong while retrieving this transaction."}
                </p>

                <div className="transaction-state-actions">
                    <button
                        type="button"
                        className="refresh-button"
                        onClick={onRetry}
                    >
                        <RefreshCw size={15} />
                        Try Again
                    </button>

                    <button
                        type="button"
                        className="transaction-secondary-button"
                        onClick={onBack}
                    >
                        Back to Transactions
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TransactionDetails() {
    const navigate = useNavigate();
    const { transactionId } = useParams();

    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    const loadTransaction = useCallback(async () => {
        if (!transactionId) {
            setTransaction(null);
            setError("A transaction ID was not provided in the URL.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await getTransactionById(transactionId);

            if (!data || typeof data !== "object" || Array.isArray(data)) {
                throw new Error("The server returned an invalid transaction response.");
            }

            setTransaction(data);
        } catch (err) {
            console.error("Transaction details loading failed:", err);

            const statusCode = err?.response?.status;

            let message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Unable to load transaction details.";

            if (statusCode === 404) {
                message = "This transaction could not be found.";
            } else if (statusCode === 401 || statusCode === 403) {
                message = "You are not authorized to view this transaction. Please sign in again if needed.";
            } else if (!err?.response && err?.message === "Network Error") {
                message = "Could not connect to the server. Check your connection and try again.";
            }

            setTransaction(null);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [transactionId]);

    useEffect(() => {
        loadTransaction();
    }, [loadTransaction, reloadKey]);

    const retry = () => setReloadKey((current) => current + 1);
    const goBack = () => navigate("/transactions");

    if (loading) {
        return (
            <div className="transactions-page transaction-details-page">
                <LoadingState />
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <ErrorState
                message={error || "Transaction information is unavailable."}
                onRetry={retry}
                onBack={goBack}
            />
        );
    }

    const riskFactors = Array.isArray(transaction.risk_factors)
        ? transaction.risk_factors
        : [];

    const riskScore = transaction.risk_score;
    const scoreWidth = getScoreWidth(riskScore);

    const transactionIdValue =
        transaction.transaction_id ?? transaction.id ?? transactionId;

    const hasScore =
        riskScore !== null &&
        riskScore !== undefined &&
        riskScore !== "" &&
        Number.isFinite(Number(riskScore));

    return (
        <div className="transactions-page transaction-details-page">
            <div className="transactions-heading transaction-details-heading">
                <PageHeader
                    title="Transaction Details"
                    description="Review transaction activity, risk indicators, and available investigation information."
                />

                <button
                    type="button"
                    className="refresh-button"
                    onClick={goBack}
                >
                    <ArrowLeft size={16} />
                    Back to Transactions
                </button>
            </div>

            <section className="dashboard-card transaction-details-card">
                <div className="transaction-details-top">
                    <div className="transaction-identity">
                        <span className="detail-label">
                            Transaction Reference
                        </span>

                        <h2 className="transaction-details-id">
                            {transactionIdValue}
                        </h2>

                        <span className="transaction-created-caption">
                            <CalendarDays size={14} />
                            {formatDate(transaction.created_at)}
                        </span>
                    </div>

                    <div className="transaction-details-badges">
                        <RiskBadge risk={transaction.risk_level} />
                        <StatusBadge status={transaction.status} />
                    </div>
                </div>

                <div className="transaction-risk-summary">
                    <div className="transaction-risk-summary-icon">
                        <ShieldAlert size={21} />
                    </div>

                    <div className="transaction-risk-summary-content">
                        <strong>
                            {formatLabel(transaction.risk_level)} Risk
                        </strong>

                        <p>{getRiskDescription(transaction.risk_level)}</p>
                    </div>
                </div>

                <div className="transaction-detail-grid">
                    <DetailItem
                        label="Merchant"
                        value={transaction.merchant}
                        icon={CreditCard}
                    />

                    <DetailItem
                        label="Transaction Amount"
                        value={formatAmount(
                            transaction.amount,
                            transaction.currency
                        )}
                        icon={Activity}
                    />

                    <DetailItem
                        label="Risk Score"
                        value={hasScore ? `${riskScore}/100` : "-"}
                        icon={ShieldAlert}
                    />

                    <DetailItem
                        label="Fraud Probability"
                        value={formatProbability(transaction.fraud_probability)}
                        icon={AlertTriangle}
                    />

                    <DetailItem
                        label="Device ID"
                        value={transaction.device_id}
                        icon={Fingerprint}
                    />

                    <DetailItem
                        label="Location"
                        value={transaction.location_city}
                        icon={MapPin}
                    />

                    <DetailItem
                        label="Transaction Type"
                        value={formatLabel(transaction.transaction_type)}
                        icon={CreditCard}
                    />

                    <DetailItem
                        label="Created At"
                        value={formatDate(transaction.created_at)}
                        icon={CalendarDays}
                    />

                    <DetailItem
                        label="User Email"
                        value={transaction.email}
                        icon={UserRound}
                    />

                    <DetailItem
                        label="User Name"
                        value={transaction.full_name}
                        icon={UserRound}
                    />
                </div>

                <div className="transaction-score-section">
                    <div className="transaction-score-heading">
                        <span>Risk Score Indicator</span>
                        <strong>{hasScore ? `${scoreWidth}%` : "Unavailable"}</strong>
                    </div>

                    <div
                        className="transaction-score-track"
                        role="progressbar"
                        aria-label="Transaction risk score"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={hasScore ? scoreWidth : 0}
                    >
                        <div
                            className={`transaction-score-fill risk-${String(
                                transaction.risk_level || "unknown"
                            ).toLowerCase()}`}
                            style={{ width: `${scoreWidth}%` }}
                        />
                    </div>

                    <p className="muted-text">
                        This indicator visualizes the recorded risk score.
                        It does not independently determine whether fraud occurred.
                    </p>
                </div>
            </section>

            <section className="dashboard-card transaction-risk-factors-card">
                <div className="section-heading">
                    <ShieldCheck size={20} />
                    <div>
                        <h3>Risk Factors</h3>
                        <p>Risk signals returned by the transaction API.</p>
                    </div>

                    <span className="risk-factor-count">
                        {riskFactors.length}
                    </span>
                </div>

                {riskFactors.length > 0 ? (
                    <div className="risk-factors">
                        {riskFactors.map((factor, index) => {
                            const factorText =
                                typeof factor === "string"
                                    ? factor
                                    : factor && typeof factor === "object"
                                      ? factor.description ||
                                        factor.message ||
                                        factor.name ||
                                        JSON.stringify(factor)
                                      : String(factor);

                            return (
                                <div
                                    className="risk-factor"
                                    key={`${index}-${factorText}`}
                                >
                                    <AlertTriangle size={16} />
                                    <span>{factorText}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="transaction-empty-risk">
                        <ShieldCheck size={21} />
                        <div>
                            <strong>No risk factors recorded</strong>
                            <p className="muted-text">
                                The API did not return any risk factors for this transaction.
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
