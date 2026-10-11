
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    ChevronRight,
    CircleDollarSign,
    Clock3,
    Filter,
    RefreshCw,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Wallet,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getTransactions } from "../../services/transaction.service";
import "./Transactions.css";

const COLORS = {
    background: "#0b1120",
    surface: "#111a2c",
    surfaceHover: "#162239",
    border: "#25324a",
    text: "#edf3ff",
    muted: "#8b9bb5",
    blue: "#6d9cff",
    green: "#42d6a4",
    yellow: "#f5c66a",
    red: "#ff7185",
    purple: "#b8a0ff",
};

function getErrorMessage(error) {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load transactions. Please try again."
    );
}

function getTransactionId(transaction) {
    return transaction?.transaction_id ?? transaction?.id ?? "";
}

function normalizeTransactions(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.transactions)) {
        return response.transactions;
    }
    if (Array.isArray(response?.data?.transactions)) {
        return response.data.transactions;
    }
    if (Array.isArray(response?.data)) {
        return response.data;
    }
    return [];
}

function formatAmount(amount, currency = "INR") {
    const value = Number(amount);

    if (!Number.isFinite(value)) return `${currency} 0.00`;

    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: /^[A-Z]{3}$/.test(currency) ? currency : "INR",
            maximumFractionDigits: 2,
        }).format(value);
    } catch {
        return `${currency} ${value.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        })}`;
    }
}

function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatLabel(value) {
    if (!value) return "Unknown";

    return String(value)
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function normalizeRisk(value) {
    const risk = String(value ?? "").toLowerCase();

    if (["critical", "high", "medium", "low"].includes(risk)) {
        return risk;
    }

    return "unknown";
}

function getRiskColor(risk) {
    switch (normalizeRisk(risk)) {
        case "critical":
            return COLORS.red;
        case "high":
            return "#ff985c";
        case "medium":
            return COLORS.yellow;
        case "low":
            return COLORS.green;
        default:
            return COLORS.muted;
    }
}

function getStatusColor(status) {
    const value = String(status ?? "").toLowerCase();

    if (["approved", "completed", "success"].includes(value)) {
        return COLORS.green;
    }

    if (["blocked", "failed", "rejected"].includes(value)) {
        return COLORS.red;
    }

    if (["pending", "review"].includes(value)) {
        return COLORS.yellow;
    }

    return COLORS.muted;
}

function MetricCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    loading,
}) {
    return (
        <article className="tx-metric-card">
            <div className="tx-metric-top">
                <span className="tx-metric-title">{title}</span>
                <span
                    className="tx-metric-icon"
                    style={{
                        color,
                        background: `${color}15`,
                        borderColor: `${color}30`,
                    }}
                >
                    <Icon size={19} />
                </span>
            </div>

            <div className="tx-metric-value">
                {loading ? "—" : value}
            </div>

            <div className="tx-metric-subtitle">
                <span style={{ color }}>{subtitle}</span>
            </div>
        </article>
    );
}

function RiskPill({ risk }) {
    const color = getRiskColor(risk);

    return (
        <span
            className="tx-pill"
            style={{
                color,
                background: `${color}12`,
                borderColor: `${color}35`,
            }}
        >
            <span
                className="tx-pill-dot"
                style={{ background: color }}
            />
            {formatLabel(risk)}
        </span>
    );
}

function StatusPill({ status }) {
    const color = getStatusColor(status);

    return (
        <span
            className="tx-pill"
            style={{
                color,
                background: `${color}12`,
                borderColor: `${color}35`,
            }}
        >
            {formatLabel(status)}
        </span>
    );
}

export default function TransactionPage() {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [riskLevel, setRiskLevel] = useState("all");
    const [status, setStatus] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    const loadTransactions = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getTransactions();
            const list = normalizeTransactions(response);

            setTransactions(list);
        } catch (err) {
            console.error("Transactions loading failed:", err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const filteredTransactions = useMemo(() => {
        const query = search.trim().toLowerCase();

        return transactions
            .filter((transaction) => {
                const id = String(getTransactionId(transaction)).toLowerCase();
                const merchant = String(transaction.merchant ?? "").toLowerCase();
                const type = String(
                    transaction.transaction_type ?? ""
                ).toLowerCase();

                const matchesSearch =
                    !query ||
                    id.includes(query) ||
                    merchant.includes(query) ||
                    type.includes(query);

                const matchesRisk =
                    riskLevel === "all" ||
                    normalizeRisk(transaction.risk_level) === riskLevel;

                const matchesStatus =
                    status === "all" ||
                    String(transaction.status ?? "").toLowerCase() === status;

                return matchesSearch && matchesRisk && matchesStatus;
            })
            .sort((a, b) => {
                const dateA = new Date(a.created_at ?? 0).getTime() || 0;
                const dateB = new Date(b.created_at ?? 0).getTime() || 0;

                return sortOrder === "oldest"
                    ? dateA - dateB
                    : dateB - dateA;
            });
    }, [transactions, search, riskLevel, status, sortOrder]);

    const metrics = useMemo(() => {
        const totalAmount = transactions.reduce((sum, transaction) => {
            const amount = Number(transaction.amount);
            return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);

        const highRisk = transactions.filter((transaction) =>
            ["high", "critical"].includes(
                normalizeRisk(transaction.risk_level)
            )
        ).length;

        const pending = transactions.filter((transaction) =>
            ["pending", "review"].includes(
                String(transaction.status ?? "").toLowerCase()
            )
        ).length;

        const approved = transactions.filter((transaction) =>
            ["approved", "completed", "success"].includes(
                String(transaction.status ?? "").toLowerCase()
            )
        ).length;

        return {
            total: transactions.length,
            totalAmount,
            highRisk,
            pending,
            approved,
        };
    }, [transactions]);

    function resetFilters() {
        setSearch("");
        setRiskLevel("all");
        setStatus("all");
        setSortOrder("newest");
    }

    const hasFilters =
        search.trim() !== "" ||
        riskLevel !== "all" ||
        status !== "all" ||
        sortOrder !== "newest";

    return (
        <div className="transactions-page tx-page">
            <header className="tx-page-header">
                <div>
                    <div className="tx-eyebrow">
                        <Activity size={14} />
                        RISK INTELLIGENCE / MONITORING
                    </div>

                    <h1 className="tx-page-title">Transactions</h1>

                    <p className="tx-page-description">
                        Monitor transaction activity, identify suspicious
                        behavior, and review risk signals.
                    </p>
                </div>

                <div className="tx-header-actions">
                    <button
                        type="button"
                        className="tx-button tx-button-secondary"
                        onClick={() => loadTransactions(true)}
                        disabled={refreshing || loading}
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "tx-spin" : ""}
                        />
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>

                    <button
                        type="button"
                        className="tx-button tx-button-primary"
                        onClick={() => navigate("/transactions/create")}
                    >
                        <span aria-hidden="true">+</span>
                        Create Transaction
                    </button>
                </div>
            </header>

            {error && (
                <div className="tx-error-banner" role="alert">
                    <AlertTriangle size={19} />

                    <div>
                        <strong>Unable to retrieve transactions</strong>
                        <p>{error}</p>
                    </div>

                    <button
                        type="button"
                        className="tx-icon-button"
                        onClick={() => loadTransactions(true)}
                        aria-label="Retry loading transactions"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            )}

            <section className="tx-metrics-grid" aria-label="Transaction overview">
                <MetricCard
                    title="Total Transactions"
                    value={metrics.total.toLocaleString("en-IN")}
                    subtitle="Loaded records"
                    icon={Activity}
                    color={COLORS.blue}
                    loading={loading}
                />

                <MetricCard
                    title="Transaction Value"
                    value={formatAmount(metrics.totalAmount)}
                    subtitle="Combined displayed value"
                    icon={Wallet}
                    color={COLORS.purple}
                    loading={loading}
                />

                <MetricCard
                    title="High / Critical Risk"
                    value={metrics.highRisk.toLocaleString("en-IN")}
                    subtitle="Requires attention"
                    icon={AlertTriangle}
                    color={COLORS.red}
                    loading={loading}
                />

                <MetricCard
                    title="Pending / Review"
                    value={metrics.pending.toLocaleString("en-IN")}
                    subtitle="Awaiting a decision"
                    icon={Clock3}
                    color={COLORS.yellow}
                    loading={loading}
                />
            </section>

            <section className="tx-table-card">
                <div className="tx-table-card-header">
                    <div>
                        <div className="tx-section-title">
                            <ShieldCheck size={19} />
                            <h2>Transaction activity</h2>
                        </div>

                        <p className="tx-section-description">
                            Review risk levels, processing status, and recent activity.
                        </p>
                    </div>

                    <span className="tx-record-count">
                        {filteredTransactions.length} records
                    </span>
                </div>

                <div className="tx-filter-bar">
                    <label className="tx-search-box">
                        <Search size={17} />

                        <input
                            type="search"
                            placeholder="Search merchant, ID, or type..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />

                        {search && (
                            <button
                                type="button"
                                className="tx-search-clear"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </label>

                    <label className="tx-select-box">
                        <Filter size={15} />

                        <select
                            value={riskLevel}
                            onChange={(event) => setRiskLevel(event.target.value)}
                            aria-label="Filter by risk level"
                        >
                            <option value="all">All risk levels</option>
                            <option value="low">Low risk</option>
                            <option value="medium">Medium risk</option>
                            <option value="high">High risk</option>
                            <option value="critical">Critical risk</option>
                        </select>
                    </label>

                    <label className="tx-select-box">
                        <SlidersHorizontal size={15} />

                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            aria-label="Filter by status"
                        >
                            <option value="all">All statuses</option>
                            <option value="approved">Approved</option>
                            <option value="completed">Completed</option>
                            <option value="success">Success</option>
                            <option value="pending">Pending</option>
                            <option value="review">Review</option>
                            <option value="blocked">Blocked</option>
                            <option value="failed">Failed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </label>

                    <label className="tx-select-box">
                        <CalendarDays size={15} />

                        <select
                            value={sortOrder}
                            onChange={(event) => setSortOrder(event.target.value)}
                            aria-label="Sort transactions by date"
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    </label>

                    {hasFilters && (
                        <button
                            type="button"
                            className="tx-reset-button"
                            onClick={resetFilters}
                        >
                            Reset
                        </button>
                    )}
                </div>

                <div className="tx-table-scroll">
                    <table className="tx-data-table">
                        <thead>
                            <tr>
                                <th>TRANSACTION / MERCHANT</th>
                                <th>AMOUNT</th>
                                <th>RISK LEVEL</th>
                                <th>STATUS</th>
                                <th>TRANSACTION TYPE</th>
                                <th>CREATED AT</th>
                                <th aria-label="Actions"> </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="tx-state-cell">
                                        <RefreshCw size={20} className="tx-spin" />
                                        Loading transaction records...
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="tx-state-cell">
                                        <div className="tx-empty-icon">
                                            <CircleDollarSign size={28} />
                                        </div>

                                        <strong>
                                            {error
                                                ? "Transactions unavailable"
                                                : "No matching transactions"}
                                        </strong>

                                        <p>
                                            {error
                                                ? "Retry loading the transaction list."
                                                : "Try another search or change your filters."}
                                        </p>

                                        {hasFilters && (
                                            <button
                                                type="button"
                                                className="tx-button tx-button-secondary"
                                                onClick={resetFilters}
                                            >
                                                Clear filters
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((transaction, index) => {
                                    const id = getTransactionId(transaction);

                                    return (
                                        <tr
                                            key={
                                                id ||
                                                `${transaction.merchant}-${transaction.created_at}-${index}`
                                            }
                                            className="tx-data-row"
                                            onClick={() => {
                                                if (id) {
                                                    navigate(`/transactions/${id}`);
                                                }
                                            }}
                                            tabIndex={id ? 0 : undefined}
                                            onKeyDown={(event) => {
                                                if (
                                                    id &&
                                                    (event.key === "Enter" ||
                                                        event.key === " ")
                                                ) {
                                                    event.preventDefault();
                                                    navigate(`/transactions/${id}`);
                                                }
                                            }}
                                            aria-label={
                                                id
                                                    ? `View transaction ${id}`
                                                    : undefined
                                            }
                                        >
                                            <td>
                                                <div className="tx-merchant-cell">
                                                    <span
                                                        className="tx-merchant-avatar"
                                                        aria-hidden="true"
                                                    >
                                                        {String(
                                                            transaction.merchant || "T"
                                                        )
                                                            .trim()
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>

                                                    <div className="tx-merchant-info">
                                                        <strong>
                                                            {transaction.merchant ||
                                                                "Unknown merchant"}
                                                        </strong>

                                                        <span title={String(id)}>
                                                            {id
                                                                ? `#${String(id).slice(0, 12)}`
                                                                : "No transaction ID"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="tx-amount-cell">
                                                {formatAmount(
                                                    transaction.amount,
                                                    transaction.currency || "INR"
                                                )}
                                            </td>

                                            <td>
                                                <RiskPill
                                                    risk={transaction.risk_level}
                                                />
                                            </td>

                                            <td>
                                                <StatusPill
                                                    status={transaction.status}
                                                />
                                            </td>

                                            <td>
                                                <span className="tx-type-label">
                                                    {formatLabel(
                                                        transaction.transaction_type
                                                    )}
                                                </span>
                                            </td>

                                            <td className="tx-date-cell">
                                                {formatDate(transaction.created_at)}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="tx-view-button"
                                                    disabled={!id}
                                                    onClick={(event) => {
                                                        event.stopPropagation();

                                                        if (id) {
                                                            navigate(
                                                                `/transactions/${id}`
                                                            );
                                                        }
                                                    }}
                                                    aria-label={`View transaction ${id}`}
                                                >
                                                    View
                                                    <ChevronRight size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="tx-table-footer">
                    <span>
                        Showing{" "}
                        <strong>{filteredTransactions.length}</strong> of{" "}
                        <strong>{transactions.length}</strong> loaded transactions
                    </span>

                    <span className="tx-footer-status">
                        <span />
                        Transaction monitoring
                    </span>
                </footer>
            </section>

            <p className="tx-disclaimer">
                <ArrowUpRight size={14} />
                Metrics are calculated from the transactions currently returned
                by the API. They are not guaranteed to represent all historical
                transactions if the backend limits the result set.
            </p>
        </div>
    );
}
