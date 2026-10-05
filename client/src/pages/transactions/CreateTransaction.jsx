import { useState } from "react";
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
    WalletCards
} from "lucide-react";

import api from "../../services/api";

export default function CreateTransaction() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        merchant: "",
        amount: "",
        currency: "INR",
        deviceId: "",
        locationCity: "",
        transactionType: "purchase"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await api.post("/transactions", {
                merchant: form.merchant.trim(),
                amount: Number(form.amount),
                currency: form.currency,
                deviceId: form.deviceId.trim() || undefined,
                locationCity: form.locationCity.trim() || undefined,
                transactionType: form.transactionType
            });

            const transaction =
                response.data?.data?.transaction ||
                response.data?.data;

            if (transaction?.transaction_id) {
                navigate(
                    `/transactions/${transaction.transaction_id}`
                );
            } else {
                navigate("/transactions");
            }
        } catch (err) {
            console.error(
                "Transaction creation failed:",
                err
            );

            const validationErrors =
                err.response?.data?.details;

            if (Array.isArray(validationErrors)) {
                setError(
                    validationErrors
                        .map((item) => item.message)
                        .join(", ")
                );
            } else {
                setError(
                    err.response?.data?.message ||
                        "Unable to process transaction"
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="create-transaction-page">
            <button
                className="back-link"
                onClick={() => navigate("/transactions")}
            >
                <ArrowLeft size={16} />
                Back to Transactions
            </button>

            <div className="create-page-heading">
                <div>
                    <div className="eyebrow">
                        <ShieldCheck size={15} />
                        RISKFORGE INTELLIGENCE
                    </div>

                    <h1>Create Transaction</h1>

                    <p>
                        Submit a transaction for real-time AI
                        risk analysis and fraud detection.
                    </p>
                </div>

                <div className="secure-indicator">
                    <CheckCircle2 size={16} />
                    Secure Processing
                </div>
            </div>

            <div className="create-transaction-layout">
                <form
                    className="create-transaction-card"
                    onSubmit={handleSubmit}
                >
                    <div className="card-heading">
                        <div className="card-heading-icon">
                            <WalletCards size={21} />
                        </div>

                        <div>
                            <h2>Transaction Details</h2>
                            <p>
                                Enter the transaction information
                                below.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="form-error">
                            <span>!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="form-grid">
                        <div className="form-field full-width">
                            <label htmlFor="merchant">
                                <Building2 size={15} />
                                Merchant Name
                            </label>

                            <input
                                id="merchant"
                                name="merchant"
                                type="text"
                                value={form.merchant}
                                onChange={handleChange}
                                placeholder="e.g. Amazon, Flipkart, Uber"
                                minLength={2}
                                maxLength={120}
                                required
                            />

                            <small>
                                Enter the business or merchant
                                receiving the payment.
                            </small>
                        </div>

                        <div className="form-field">
                            <label htmlFor="amount">
                                <CircleDollarSign size={15} />
                                Transaction Amount
                            </label>

                            <div className="input-with-prefix">
                                <span>₹</span>

                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="5000"
                                    min="1"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="currency">
                                <Banknote size={15} />
                                Currency
                            </label>

                            <select
                                id="currency"
                                name="currency"
                                value={form.currency}
                                onChange={handleChange}
                            >
                                <option value="INR">
                                    INR — Indian Rupee
                                </option>

                                <option value="USD">
                                    USD — US Dollar
                                </option>

                                <option value="EUR">
                                    EUR — Euro
                                </option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="deviceId">
                                <Cpu size={15} />
                                Device ID
                            </label>

                            <input
                                id="deviceId"
                                name="deviceId"
                                type="text"
                                value={form.deviceId}
                                onChange={handleChange}
                                placeholder="device-001"
                            />

                            <small>
                                Optional device identifier.
                            </small>
                        </div>

                        <div className="form-field">
                            <label htmlFor="locationCity">
                                <MapPin size={15} />
                                Location City
                            </label>

                            <input
                                id="locationCity"
                                name="locationCity"
                                type="text"
                                value={form.locationCity}
                                onChange={handleChange}
                                placeholder="Bhilai"
                            />

                            <small>
                                City where the transaction
                                originated.
                            </small>
                        </div>

                        <div className="form-field full-width">
                            <label htmlFor="transactionType">
                                <WalletCards size={15} />
                                Transaction Type
                            </label>

                            <select
                                id="transactionType"
                                name="transactionType"
                                value={form.transactionType}
                                onChange={handleChange}
                            >
                                <option value="purchase">
                                    Purchase
                                </option>

                                <option value="transfer">
                                    Transfer
                                </option>

                                <option value="withdrawal">
                                    Withdrawal
                                </option>

                                <option value="payment">
                                    Payment
                                </option>

                                <option value="refund">
                                    Refund
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="form-footer">
                        <p>
                            <ShieldCheck size={14} />
                            Your transaction data is securely
                            processed.
                        </p>

                        <div className="form-buttons">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    navigate("/transactions")
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="process-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="button-spinner" />
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

                <aside className="transaction-info-card">
                    <div className="info-icon">
                        <Sparkles size={23} />
                    </div>

                    <h2>AI Risk Analysis</h2>

                    <p>
                        RiskForge evaluates every transaction
                        using multiple intelligence signals.
                    </p>

                    <div className="analysis-list">
                        <div className="analysis-item">
                            <span className="analysis-dot" />
                            <div>
                                <strong>Transaction Behaviour</strong>
                                <small>
                                    Amount and transaction type
                                </small>
                            </div>
                        </div>

                        <div className="analysis-item">
                            <span className="analysis-dot" />
                            <div>
                                <strong>Device Intelligence</strong>
                                <small>
                                    Device and activity patterns
                                </small>
                            </div>
                        </div>

                        <div className="analysis-item">
                            <span className="analysis-dot" />
                            <div>
                                <strong>Location Signals</strong>
                                <small>
                                    Origin and location context
                                </small>
                            </div>
                        </div>

                        <div className="analysis-item">
                            <span className="analysis-dot" />
                            <div>
                                <strong>Risk Decision</strong>
                                <small>
                                    Low, medium, high or critical
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="info-bottom">
                        <ShieldCheck size={18} />
                        <span>
                            Protected by RiskForge AI
                        </span>
                    </div>
                </aside>
            </div>
        </div>
    );
}