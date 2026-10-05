import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    Bot,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Filter,
    RefreshCw,
    Search,
    ShieldAlert,
    ShieldCheck,
    ShieldX,
    Sparkles,
    TrendingUp,
    WalletCards,
    X
} from "lucide-react";
import api from "../../services/api";
import "./Dashboard.css";

function formatAmount(amount, currency = "INR") {
    const value = Number(amount || 0);

    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 0
        }).format(value);
    } catch {
        return `${value.toLocaleString("en-IN")} ${currency}`;
    }
}

function formatCompactAmount(amount) {
    const value = Number(amount || 0);

    if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(1)}Cr`;
    }

    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
        return `₹${(value / 1000).toFixed(1)}K`;
    }

    return formatAmount(value);
}

function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "—";
    }

    return parsed.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function normalizeRisk(level) {
    const value = String(level || "low").toLowerCase();

    if (["critical", "high", "medium", "low"].includes(value)) {
        return value;
    }

    return "low";
}

function riskScore(transaction) {
    const score = Number(transaction?.risk_score);

    if (Number.isFinite(score)) {
        return Math.max(0, Math.min(100, score));
    }

    const risk = normalizeRisk(transaction?.risk_level);

    return {
        critical: 95,
        high: 78,
        medium: 52,
        low: 18
    }[risk];
}

function riskLabel(level) {
    return String(level || "low")
        .charAt(0)
        .toUpperCase() + String(level || "low").slice(1);
}

function statusLabel(status) {
    if (!status) return "Unknown";

    return String(status)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Sparkline({ values = [] }) {
    const width = 150;
    const height = 42;

    if (!values.length) {
        return <div className="sparkline-empty" />;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values
        .map((value, index) => {
            const x =
                values.length === 1
                    ? width / 2
                    : (index / (values.length - 1)) * width;

            const y =
                height -
                ((value - min) / range) * (height - 8) -
                4;

            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg
            className="dashboard-sparkline"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <polyline points={points} fill="none" />
        </svg>
    );
}

function MetricCard({
    icon: Icon,
    label,
    value,
    detail,
    tone,
    trend,
    sparkValues
}) {
    return (
        <article className={`metric-card metric-${tone}`}>
            <div className="metric-top">
                <div className="metric-icon">
                    <Icon size={18} strokeWidth={1.8} />
                </div>

                <span className="metric-live">
                    <span />
                    LIVE
                </span>
            </div>

            <div className="metric-label">{label}</div>

            <div className="metric-value-row">
                <strong>{value}</strong>

                {trend && (
                    <span className={`metric-trend ${trend.startsWith("-") ? "down" : ""}`}>
                        {trend.startsWith("-") ? (
                            <ArrowDownRight size={13} />
                        ) : (
                            <ArrowUpRight size={13} />
                        )}
                        {trend}
                    </span>
                )}
            </div>

            <div className="metric-footer">
                <span>{detail}</span>
                <Sparkline values={sparkValues} />
            </div>
        </article>
    );
}

function RiskBadge({ level }) {
    return (
        <span className={`risk-badge risk-${level}`}>
            <span className="risk-badge-dot" />
            {riskLabel(level)}
        </span>
    );
}

function StatusBadge({ status }) {
    const normalized = String(status || "unknown").toLowerCase();

    return (
        <span className={`status-badge status-${normalized}`}>
            {statusLabel(status)}
        </span>
    );
}

export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [riskFilter, setRiskFilter] = useState("all");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    async function loadDashboard({ silent = false } = {}) {
        if (silent) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const response = await api.get("/transactions?limit=100");

            const payload = response?.data?.data || response?.data || {};
            const items =
                payload.transactions ||
                payload.items ||
                response?.data?.transactions ||
                [];

            setTransactions(Array.isArray(items) ? items : []);
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Dashboard load failed:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load live transaction data."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadDashboard();

        const interval = window.setInterval(() => {
            loadDashboard({ silent: true });
        }, 30000);

        return () => window.clearInterval(interval);
    }, []);

    const statistics = useMemo(() => {
        const total = transactions.length;

        const low = transactions.filter(
            (item) => normalizeRisk(item.risk_level) === "low"
        ).length;

        const medium = transactions.filter(
            (item) => normalizeRisk(item.risk_level) === "medium"
        ).length;

        const high = transactions.filter(
            (item) => normalizeRisk(item.risk_level) === "high"
        ).length;

        const critical = transactions.filter(
            (item) => normalizeRisk(item.risk_level) === "critical"
        ).length;

        const alerts = high + critical;

        const totalAmount = transactions.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        const averageRisk =
            total > 0
                ? transactions.reduce(
                    (sum, item) => sum + riskScore(item),
                    0
                ) / total
                : 0;

        const reviewCount = transactions.filter((item) =>
            ["review", "pending", "flagged"].includes(
                String(item.status || "").toLowerCase()
            )
        ).length;

        return {
            total,
            low,
            medium,
            high,
            critical,
            alerts,
            totalAmount,
            averageRisk,
            reviewCount,
            fraudRate: total ? (alerts / total) * 100 : 0
        };
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        const query = search.trim().toLowerCase();

        return [...transactions]
            .sort(
                (a, b) =>
                    new Date(b.created_at || 0) -
                    new Date(a.created_at || 0)
            )
            .filter((item) => {
                const risk = normalizeRisk(item.risk_level);

                if (riskFilter !== "all" && risk !== riskFilter) {
                    return false;
                }

                if (!query) return true;

                return [
                    item.merchant,
                    item.transaction_id,
                    item.location,
                    item.transaction_type,
                    item.status,
                    item.currency
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value).toLowerCase().includes(query)
                    );
            });
    }, [transactions, search, riskFilter]);

    const recentTransactions = filteredTransactions.slice(0, 7);

    const highRiskQueue = useMemo(
        () =>
            [...transactions]
                .filter((item) =>
                    ["high", "critical"].includes(
                        normalizeRisk(item.risk_level)
                    )
                )
                .sort((a, b) => riskScore(b) - riskScore(a))
                .slice(0, 4),
        [transactions]
    );

    const riskPercent = useMemo(() => {
        const total = statistics.total || 1;

        return {
            low: Math.round((statistics.low / total) * 100),
            medium: Math.round((statistics.medium / total) * 100),
            high: Math.round((statistics.high / total) * 100),
            critical: Math.round((statistics.critical / total) * 100)
        };
    }, [statistics]);

    const threatLevel =
        statistics.critical > 0
            ? "Critical"
            : statistics.high >= Math.max(2, statistics.total * 0.3)
                ? "Elevated"
                : statistics.alerts > 0
                    ? "Guarded"
                    : "Normal";

    const threatCopy = {
        Critical: "Immediate analyst intervention recommended.",
        Elevated: "Multiple high-risk transactions require attention.",
        Guarded: "Some transaction activity requires analyst review.",
        Normal: "No elevated transaction risk detected."
    }[threatLevel];

    const riskTrend = transactions
        .slice()
        .sort(
            (a, b) =>
                new Date(a.created_at || 0) -
                new Date(b.created_at || 0)
        )
        .slice(-8)
        .map((item) => riskScore(item));

    return (
        <div className="dashboard-page">
            <header className="dashboard-hero">
                <div>
                    <div className="dashboard-eyebrow">
                        <span className="eyebrow-dot" />
                        RISK OPERATIONS CENTER
                    </div>

                    <h1>Risk intelligence overview</h1>

                    <p>
                        Monitor transaction activity, prioritize threats,
                        and move from signal to investigation faster.
                    </p>
                </div>

                <div className="dashboard-hero-actions">
                    <div className="live-status">
                        <span className="live-status-dot" />
                        <div>
                            <strong>Systems operational</strong>
                            <small>
                                {lastUpdated
                                    ? `Updated ${lastUpdated.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}`
                                    : "Connecting to risk engine"}
                            </small>
                        </div>
                    </div>

                    <button
                        className="refresh-button"
                        type="button"
                        onClick={() => loadDashboard({ silent: true })}
                        disabled={refreshing}
                    >
                        <RefreshCw
                            size={15}
                            className={refreshing ? "spin" : ""}
                        />
                        Refresh
                    </button>
                </div>
            </header>

            {error && (
                <div className="dashboard-alert">
                    <AlertTriangle size={17} />
                    <div>
                        <strong>Dashboard data unavailable</strong>
                        <span>{error}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => loadDashboard()}
                    >
                        Retry
                    </button>
                </div>
            )}

            <section className="metrics-grid">
                <MetricCard
                    icon={Activity}
                    label="Transactions monitored"
                    value={loading ? "—" : statistics.total.toLocaleString("en-IN")}
                    detail="Live transaction stream"
                    tone="blue"
                    trend="+ live"
                    sparkValues={riskTrend.length ? riskTrend : [12, 18, 16, 24, 21, 30]}
                />

                <MetricCard
                    icon={ShieldAlert}
                    label="Risk alerts"
                    value={loading ? "—" : statistics.alerts}
                    detail={`${statistics.critical} critical · ${statistics.high} high`}
                    tone="red"
                    trend={`${statistics.total ? Math.round(statistics.fraudRate) : 0}%`}
                    sparkValues={riskTrend.length ? riskTrend : [20, 22, 19, 28, 34, 31]}
                />

                <MetricCard
                    icon={ShieldX}
                    label="High-risk exposure"
                    value={loading ? "—" : statistics.high + statistics.critical}
                    detail="High + critical transactions"
                    tone="amber"
                    trend={statistics.alerts ? "attention" : "clear"}
                    sparkValues={riskTrend.length ? riskTrend : [10, 14, 18, 16, 22, 20]}
                />

                <MetricCard
                    icon={WalletCards}
                    label="Transaction value"
                    value={loading ? "—" : formatCompactAmount(statistics.totalAmount)}
                    detail="Total monitored value"
                    tone="green"
                    trend="live"
                    sparkValues={
                        transactions.length
                            ? transactions
                                .slice(-8)
                                .map((item) => Number(item.amount || 0))
                            : [20, 30, 24, 35, 31, 42]
                    }
                />
            </section>

            <section className="dashboard-main-grid">
                <article className="panel threat-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="panel-kicker">SECURITY POSTURE</span>
                            <h2>Current threat level</h2>
                        </div>

                        <span className={`threat-chip threat-${threatLevel.toLowerCase()}`}>
                            <span />
                            {threatLevel}
                        </span>
                    </div>

                    <div className="threat-body">
                        <div className="threat-ring-wrap">
                            <div
                                className="threat-ring"
                                style={{
                                    "--risk": `${Math.round(statistics.averageRisk)}%`
                                }}
                            >
                                <div>
                                    <strong>{Math.round(statistics.averageRisk)}</strong>
                                    <span>risk score</span>
                                </div>
                            </div>
                        </div>

                        <div className="threat-copy">
                            <div className="threat-title">
                                <ShieldAlert size={17} />
                                {threatLevel} environment
                            </div>

                            <p>{threatCopy}</p>

                            <div className="threat-progress">
                                <div>
                                    <span>Risk exposure</span>
                                    <strong>{Math.round(statistics.averageRisk)}%</strong>
                                </div>
                                <div className="progress-track">
                                    <span
                                        style={{
                                            width: `${Math.min(100, statistics.averageRisk)}%`
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="threat-mini-grid">
                                <div>
                                    <span>Under review</span>
                                    <strong>{statistics.reviewCount}</strong>
                                </div>
                                <div>
                                    <span>Critical</span>
                                    <strong>{statistics.critical}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <article className="panel detection-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="panel-kicker">RISK INTELLIGENCE</span>
                            <h2>Detection engine</h2>
                        </div>

                        <div className="engine-icon">
                            <Bot size={18} />
                        </div>
                    </div>

                    <div className="engine-banner">
                        <div className="engine-pulse">
                            <Sparkles size={14} />
                        </div>
                        <div>
                            <strong>Risk analysis active</strong>
                            <span>Evaluating transaction signals in real time</span>
                        </div>
                        <CheckCircle2 size={17} />
                    </div>

                    <div className="engine-metrics">
                        <div>
                            <span>TRANSACTIONS</span>
                            <strong>{statistics.total}</strong>
                        </div>
                        <div>
                            <span>FLAGGED</span>
                            <strong>{statistics.alerts}</strong>
                        </div>
                        <div>
                            <span>AVG. RISK</span>
                            <strong>{Math.round(statistics.averageRisk)}</strong>
                        </div>
                    </div>

                    <div className="risk-distribution">
                        {[
                            ["low", "Low", statistics.low],
                            ["medium", "Medium", statistics.medium],
                            ["high", "High", statistics.high],
                            ["critical", "Critical", statistics.critical]
                        ].map(([key, label, count]) => (
                            <div className="distribution-row" key={key}>
                                <div>
                                    <span className={`distribution-dot ${key}`} />
                                    <span>{label}</span>
                                </div>
                                <strong>{count}</strong>
                                <span className="distribution-percent">
                                    {riskPercent[key]}%
                                </span>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            <section className="dashboard-content-grid">
                <article className="panel transactions-panel">
                    <div className="panel-heading transactions-heading">
                        <div>
                            <span className="panel-kicker">TRANSACTION MONITOR</span>
                            <h2>Recent activity</h2>
                            <p>Latest events flowing through the risk engine.</p>
                        </div>

                        <div className="table-toolbar">
                            <div className="table-search">
                                <Search size={15} />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search transactions..."
                                    aria-label="Search transactions"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        aria-label="Clear search"
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>

                            <label className="filter-select">
                                <Filter size={14} />
                                <select
                                    value={riskFilter}
                                    onChange={(event) => setRiskFilter(event.target.value)}
                                    aria-label="Filter by risk"
                                >
                                    <option value="all">All risk</option>
                                    <option value="critical">Critical</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    {loading ? (
                        <div className="table-loading">
                            <div className="loading-line" />
                            <div className="loading-line" />
                            <div className="loading-line" />
                            <div className="loading-line" />
                        </div>
                    ) : recentTransactions.length === 0 ? (
                        <div className="empty-state">
                            <ShieldCheck size={30} />
                            <strong>No matching transactions</strong>
                            <span>
                                Try changing the risk filter or search query.
                            </span>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table className="risk-table">
                                <thead>
                                    <tr>
                                        <th>TRANSACTION</th>
                                        <th>MERCHANT</th>
                                        <th>AMOUNT</th>
                                        <th>RISK</th>
                                        <th>SCORE</th>
                                        <th>STATUS</th>
                                        <th>TIME</th>
                                        <th />
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentTransactions.map((transaction, index) => {
                                        const risk = normalizeRisk(transaction.risk_level);
                                        const score = Math.round(riskScore(transaction));

                                        return (
                                            <tr
                                                key={
                                                    transaction.transaction_id ||
                                                    transaction.id ||
                                                    `${transaction.merchant}-${index}`
                                                }
                                            >
                                                <td>
                                                    <div className="transaction-id">
                                                        <span className={`transaction-icon risk-icon-${risk}`}>
                                                            <Activity size={14} />
                                                        </span>
                                                        <div>
                                                            <strong>
                                                                {String(
                                                                    transaction.transaction_id ||
                                                                    transaction.id ||
                                                                    "Transaction"
                                                                ).slice(0, 12)}
                                                            </strong>
                                                            <small>
                                                                {transaction.transaction_type ||
                                                                    "Payment"}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <strong className="merchant-name">
                                                        {transaction.merchant || "Unknown merchant"}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {formatAmount(
                                                            transaction.amount,
                                                            transaction.currency || "INR"
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <RiskBadge level={risk} />
                                                </td>

                                                <td>
                                                    <div className="score-cell">
                                                        <strong>{score}</strong>
                                                        <div className="score-track">
                                                            <span
                                                                className={`score-fill score-${risk}`}
                                                                style={{ width: `${score}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <StatusBadge status={transaction.status} />
                                                </td>

                                                <td>
                                                    <div className="time-cell">
                                                        <Clock3 size={13} />
                                                        {formatDate(transaction.created_at)}
                                                    </div>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="row-action"
                                                        onClick={() =>
                                                            setSelectedTransaction(transaction)
                                                        }
                                                        aria-label="View transaction"
                                                    >
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="panel-footer">
                        <span>
                            Showing {recentTransactions.length} of{" "}
                            {filteredTransactions.length} matching records
                        </span>
                        <button
                            type="button"
                            onClick={() => (window.location.href = "/transactions")}
                        >
                            View all transactions
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </article>

                <aside className="panel queue-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="panel-kicker">ANALYST QUEUE</span>
                            <h2>Priority cases</h2>
                        </div>

                        <span className="queue-count">{highRiskQueue.length}</span>
                    </div>

                    <div className="queue-list">
                        {highRiskQueue.length === 0 ? (
                            <div className="queue-empty">
                                <ShieldCheck size={26} />
                                <strong>Queue is clear</strong>
                                <span>No high-risk cases detected.</span>
                            </div>
                        ) : (
                            highRiskQueue.map((transaction, index) => {
                                const risk = normalizeRisk(transaction.risk_level);

                                return (
                                    <button
                                        type="button"
                                        className="queue-item"
                                        key={
                                            transaction.transaction_id ||
                                            transaction.id ||
                                            index
                                        }
                                        onClick={() => setSelectedTransaction(transaction)}
                                    >
                                        <div className={`queue-icon queue-${risk}`}>
                                            {risk === "critical" ? (
                                                <ShieldX size={15} />
                                            ) : (
                                                <ShieldAlert size={15} />
                                            )}
                                        </div>

                                        <div className="queue-content">
                                            <div>
                                                <strong>
                                                    {transaction.merchant || "Unknown merchant"}
                                                </strong>
                                                <RiskBadge level={risk} />
                                            </div>

                                            <span>
                                                {formatAmount(
                                                    transaction.amount,
                                                    transaction.currency || "INR"
                                                )}
                                            </span>
                                        </div>

                                        <ChevronRight size={15} />
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <button
                        type="button"
                        className="queue-footer-button"
                        onClick={() => (window.location.href = "/investigations")}
                    >
                        Open investigations
                        <ChevronRight size={14} />
                    </button>
                </aside>
            </section>

            {selectedTransaction && (
                <div
                    className="transaction-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedTransaction(null);
                        }
                    }}
                >
                    <div className="transaction-modal">
                        <div className="modal-header">
                            <div>
                                <span className="panel-kicker">TRANSACTION DETAILS</span>
                                <h2>
                                    {selectedTransaction.merchant ||
                                        "Transaction"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedTransaction(null)}
                                aria-label="Close transaction details"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modal-risk">
                            <div>
                                <span>Risk score</span>
                                <strong>
                                    {Math.round(riskScore(selectedTransaction))}
                                </strong>
                            </div>
                            <RiskBadge
                                level={normalizeRisk(
                                    selectedTransaction.risk_level
                                )}
                            />
                        </div>

                        <div className="modal-grid">
                            <div>
                                <span>Amount</span>
                                <strong>
                                    {formatAmount(
                                        selectedTransaction.amount,
                                        selectedTransaction.currency || "INR"
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>
                                    {statusLabel(selectedTransaction.status)}
                                </strong>
                            </div>

                            <div>
                                <span>Transaction ID</span>
                                <strong>
                                    {selectedTransaction.transaction_id ||
                                        selectedTransaction.id ||
                                        "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Created</span>
                                <strong>
                                    {formatDate(
                                        selectedTransaction.created_at
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="modal-secondary"
                                onClick={() => setSelectedTransaction(null)}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="modal-primary"
                                onClick={() =>
                                    (window.location.href =
                                        `/transactions/${selectedTransaction.transaction_id ||
                                        selectedTransaction.id}`)
                                }
                            >
                                Open transaction
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
