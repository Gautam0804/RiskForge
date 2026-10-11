
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Banknote,
    Building2,
    CheckCircle2,
    CircleDollarSign,
    Cpu,
    MapPin,
    ShieldCheck,
    Sparkles,
    WalletCards,
    AlertTriangle,
    RotateCcw,
} from "lucide-react";

import api from "../../services/api";
import "./CreateTransaction.css";

const INITIAL_FORM = {
    merchant: "",
    amount: "",
    currency: "INR",
    deviceId: "",
    locationCity: "",
    transactionType: "purchase",
};

const CURRENCIES = [
    { value: "INR", label: "INR — Indian Rupee" },
    { value: "USD", label: "USD — US Dollar" },
    { value: "EUR", label: "EUR — Euro" },
];

const TRANSACTION_TYPES = [
    { value: "purchase", label: "Purchase" },
    { value: "transfer", label: "Transfer" },
    { value: "withdrawal", label: "Withdrawal" },
    { value: "payment", label: "Payment" },
    { value: "refund", label: "Refund" },
];

function formatAmount(amount, currency) {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
        return "—";
    }

    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(value);
    } catch {
        return `${currency} ${value.toLocaleString("en-IN")}`;
    }
}

function getApiError(error) {
    const status = error?.response?.status;
    const body = error?.response?.data;
    const details = body?.details;

    if (Array.isArray(details) && details.length > 0) {
        return details
            .map((item) => item?.message || item?.msg)
            .filter(Boolean)
            .join(". ");
    }

    if (status === 400 || status === 422) {
        return body?.message || "Please check the transaction details and try again.";
    }

    if (status === 401) {
        return "Your session may have expired. Please sign in again.";
    }

    if (status === 403) {
        return "You do not have permission to create this transaction.";
    }

    if (status === 429) {
        return "Too many requests. Please wait a moment before trying again.";
    }

    if (status >= 500) {
        return "The server could not process this transaction. Please try again later.";
    }

    if (!error?.response) {
        return "Unable to connect to RiskForge. Check your internet connection and try again.";
    }

    return body?.message || body?.error || "Unable to process transaction.";
}

function validateForm(form) {
    const errors = {};

    const merchant = form.merchant.trim();
    const amount = Number(form.amount);
    const deviceId = form.deviceId.trim();
    const locationCity = form.locationCity.trim();

    if (!merchant) {
        errors.merchant = "Merchant name is required.";
    } else if (merchant.length < 2) {
        errors.merchant = "Merchant name must contain at least 2 characters.";
    } else if (merchant.length > 120) {
        errors.merchant = "Merchant name cannot exceed 120 characters.";
    }

    if (
        form.amount === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        errors.amount = "Enter an amount greater than zero.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.amount.trim())) {
        errors.amount = "Enter a valid amount with up to 2 decimal places.";
    } else if (amount > 999999999999) {
        errors.amount = "The amount is too large.";
    }

    if (!CURRENCIES.some((item) => item.value === form.currency)) {
        errors.currency = "Select a supported currency.";
    }

    if (
        !TRANSACTION_TYPES.some(
            (item) => item.value === form.transactionType
        )
    ) {
        errors.transactionType = "Select a valid transaction type.";
    }

    if (deviceId.length > 120) {
        errors.deviceId = "Device ID cannot exceed 120 characters.";
    }

    if (locationCity.length > 100) {
        errors.locationCity = "Location cannot exceed 100 characters.";
    }

    return errors;
}

function FormField({ label, icon: Icon, error, hint, children }) {
    return (
        <div className={`form-field ${error ? "field-invalid" : ""}`}>
            <label>
                {Icon && <Icon size={15} aria-hidden="true" />}
                {label}
            </label>

            {children}

            {error ? (
                <small className="field-error" role="alert">
                    {error}
                </small>
            ) : hint ? (
                <small className="field-hint">{hint}</small>
            ) : null}
        </div>
    );
}

export default function CreateTransaction() {
    const navigate = useNavigate();

    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const selectedType = useMemo(
        () =>
            TRANSACTION_TYPES.find(
                (item) => item.value === form.transactionType
            )?.label || "Purchase",
        [form.transactionType]
    );

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");

        setErrors((previous) => {
            if (!previous[name]) return previous;

            const next = { ...previous };
            delete next[name];
            return next;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        const validationErrors = validateForm(form);
        setErrors(validationErrors);
        setError("");

        if (Object.keys(validationErrors).length > 0) {
            const firstInvalidField = Object.keys(validationErrors)[0];

            document.getElementById(firstInvalidField)?.focus();
            return;
        }

        setLoading(true);

        try {
            const payload = {
                merchant: form.merchant.trim(),
                amount: Number(form.amount),
                currency: form.currency,
                deviceId: form.deviceId.trim() || undefined,
                locationCity: form.locationCity.trim() || undefined,
                transactionType: form.transactionType,
            };

            const response = await api.post("/transactions", payload);

            const result = response.data?.data ?? response.data;

            const transaction =
                result?.transaction ??
                result;

            if (
                transaction &&
                typeof transaction === "object" &&
                transaction.transaction_id
            ) {
                navigate(
                    `/transactions/${encodeURIComponent(
                        transaction.transaction_id
                    )}`,
                    { replace: true }
                );
            } else {
                // Creation succeeded, but the API did not return an ID.
                navigate("/transactions", { replace: true });
            }
        } catch (err) {
            console.error("Transaction creation failed:", err);
            setError(getApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm(INITIAL_FORM);
        setErrors({});
        setError("");
    };

    return (
        <main className="create-transaction-page">
            <button
                type="button"
                className="create-back-link"
                onClick={() => navigate("/transactions")}
                disabled={loading}
            >
                <ArrowLeft size={16} />
                Back to Transactions
            </button>

            <header className="create-page-heading">
                <div>
                    <div className="create-eyebrow">
                        <ShieldCheck size={15} />
                        RISKFORGE INTELLIGENCE
                    </div>

                    <h1>Create Transaction</h1>

                    <p>
                        Submit transaction data for risk evaluation and
                        fraud analysis.
                    </p>
                </div>

                <div className="create-secure-indicator">
                    <CheckCircle2 size={16} />
                    Secure Processing
                </div>
            </header>

            <div className="create-transaction-layout">
                <form
                    className="create-transaction-card"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="create-card-heading">
                        <div className="create-card-heading-icon">
                            <WalletCards size={21} />
                        </div>

                        <div>
                            <h2>Transaction Details</h2>
                            <p>Complete the fields to submit a transaction.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="create-form-error" role="alert">
                            <AlertTriangle size={19} />

                            <div>
                                <strong>Transaction not processed</strong>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="create-form-grid">
                        <div className="create-full-width">
                            <FormField
                                label="Merchant Name"
                                icon={Building2}
                                error={errors.merchant}
                                hint="The business receiving the payment."
                            >
                                <input
                                    id="merchant"
                                    name="merchant"
                                    type="text"
                                    value={form.merchant}
                                    onChange={handleChange}
                                    placeholder="e.g. Amazon, Flipkart, Uber"
                                    minLength={2}
                                    maxLength={120}
                                    autoComplete="organization"
                                    aria-invalid={Boolean(errors.merchant)}
                                    aria-describedby={
                                        errors.merchant
                                            ? "merchant-error"
                                            : undefined
                                    }
                                    required
                                    disabled={loading}
                                />
                            </FormField>
                        </div>

                        <FormField
                            label="Transaction Amount"
                            icon={CircleDollarSign}
                            error={errors.amount}
                            hint="Enter a positive amount."
                        >
                            <div className="create-input-prefix">
                                <span aria-hidden="true">
                                    {form.currency === "INR"
                                        ? "₹"
                                        : form.currency === "USD"
                                          ? "$"
                                          : "€"}
                                </span>

                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="5000.00"
                                    min="0.01"
                                    max="999999999999"
                                    step="0.01"
                                    inputMode="decimal"
                                    aria-invalid={Boolean(errors.amount)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </FormField>

                        <FormField
                            label="Currency"
                            icon={Banknote}
                            error={errors.currency}
                        >
                            <select
                                id="currency"
                                name="currency"
                                value={form.currency}
                                onChange={handleChange}
                                aria-invalid={Boolean(errors.currency)}
                                required
                                disabled={loading}
                            >
                                {CURRENCIES.map((currency) => (
                                    <option
                                        key={currency.value}
                                        value={currency.value}
                                    >
                                        {currency.label}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField
                            label="Device ID"
                            icon={Cpu}
                            error={errors.deviceId}
                            hint="Optional device identifier."
                        >
                            <input
                                id="deviceId"
                                name="deviceId"
                                type="text"
                                value={form.deviceId}
                                onChange={handleChange}
                                placeholder="device-001"
                                maxLength={120}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.deviceId)}
                                disabled={loading}
                            />
                        </FormField>

                        <FormField
                            label="Location City"
                            icon={MapPin}
                            error={errors.locationCity}
                            hint="City where the transaction originated."
                        >
                            <input
                                id="locationCity"
                                name="locationCity"
                                type="text"
                                value={form.locationCity}
                                onChange={handleChange}
                                placeholder="e.g. Raipur"
                                maxLength={100}
                                autoComplete="address-level2"
                                aria-invalid={Boolean(errors.locationCity)}
                                disabled={loading}
                            />
                        </FormField>

                        <div className="create-full-width">
                            <FormField
                                label="Transaction Type"
                                icon={WalletCards}
                                error={errors.transactionType}
                            >
                                <select
                                    id="transactionType"
                                    name="transactionType"
                                    value={form.transactionType}
                                    onChange={handleChange}
                                    aria-invalid={Boolean(errors.transactionType)}
                                    required
                                    disabled={loading}
                                >
                                    {TRANSACTION_TYPES.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        </div>
                    </div>

                    <div className="create-form-security-note">
                        <ShieldCheck size={16} />
                        <span>
                            Transaction processing uses your authenticated
                            RiskForge API session.
                        </span>
                    </div>

                    <div className="create-form-footer">
                        <button
                            type="button"
                            className="create-reset-button"
                            onClick={resetForm}
                            disabled={loading}
                        >
                            <RotateCcw size={15} />
                            Reset
                        </button>

                        <div className="create-form-buttons">
                            <button
                                type="button"
                                className="create-cancel-button"
                                onClick={() => navigate("/transactions")}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="create-process-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="create-button-spinner" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Process Transaction
                                        <ArrowRight size={17} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                <aside className="create-transaction-sidebar">
                    <div className="create-sidebar-icon">
                        <Sparkles size={23} />
                    </div>

                    <span className="create-sidebar-eyebrow">
                        TRANSACTION INTELLIGENCE
                    </span>

                    <h2>AI Risk Analysis</h2>

                    <p>
                        Transaction data can be evaluated by your configured
                        RiskForge risk-analysis pipeline.
                    </p>

                    <div className="create-live-summary">
                        <span>TRANSACTION PREVIEW</span>

                        <strong className="create-preview-amount">
                            {formatAmount(form.amount, form.currency)}
                        </strong>

                        <div className="create-preview-row">
                            <span>Merchant</span>
                            <strong>{form.merchant.trim() || "Not provided"}</strong>
                        </div>

                        <div className="create-preview-row">
                            <span>Type</span>
                            <strong>{selectedType}</strong>
                        </div>

                        <div className="create-preview-row">
                            <span>Location</span>
                            <strong>{form.locationCity.trim() || "Not provided"}</strong>
                        </div>
                    </div>

                    <div className="create-analysis-list">
                        <div className="create-analysis-item">
                            <span className="create-analysis-number">01</span>
                            <div>
                                <strong>Transaction Behaviour</strong>
                                <small>Amount and transaction type</small>
                            </div>
                        </div>

                        <div className="create-analysis-item">
                            <span className="create-analysis-number">02</span>
                            <div>
                                <strong>Device Intelligence</strong>
                                <small>Provided device information</small>
                            </div>
                        </div>

                        <div className="create-analysis-item">
                            <span className="create-analysis-number">03</span>
                            <div>
                                <strong>Location Signals</strong>
                                <small>Available geographic context</small>
                            </div>
                        </div>

                        <div className="create-analysis-item">
                            <span className="create-analysis-number">04</span>
                            <div>
                                <strong>Risk Decision</strong>
                                <small>Based on your configured backend</small>
                            </div>
                        </div>
                    </div>

                    <div className="create-sidebar-footer">
                        <ShieldCheck size={17} />
                        <span>RiskForge Risk Intelligence</span>
                    </div>
                </aside>
            </div>
        </main>
    );
}
