
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import {
    Activity,
    AlertTriangle,
    ShieldAlert,
    ShieldCheck,
    ShieldX,
    TrendingUp
} from "lucide-react";
import "./AnalyticsCharts.css";

function getRiskClass(level) {
    return `analytics-risk-${String(level || "low").toLowerCase()}`;
}

export default function AnalyticsCharts() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadAnalytics() {
        setLoading(true);
        setError("");

        try {
            // Shared API client handles the base URL and authentication.
            const response = await api.get("/transactions?limit=100");
            const data = response.data;

            const items =
                data.data?.transactions ||
                data.transactions ||
                [];

            setTransactions(Array.isArray(items) ? items : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load analytics."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAnalytics();
    }, []);

    const statistics = useMemo(() => {
        const total = transactions.length;

        const low = transactions.filter(
            (item) => item.risk_level === "low"
        ).length;

        const medium = transactions.filter(
            (item) => item.risk_level === "medium"
        ).length;

        const high = transactions.filter(
            (item) => item.risk_level === "high"
        ).length;

        const critical = transactions.filter(
            (item) => item.risk_level === "critical"
        ).length;

        const suspicious = high + critical;

        const averageRisk =
            total > 0
                ? (
                    transactions.reduce(
                        (sum, item) =>
                            sum + Number(item.risk_score || 0),
                        0
                    ) / total
                ).toFixed(1)
                : "0.0";

        const averageFraud =
            total > 0
                ? (
                    (
                        transactions.reduce(
                            (sum, item) =>
                                sum + Number(item.fraud_probability || 0),
                            0
                        ) / total
                    ) * 100
                ).toFixed(1)
                : "0.0";

        return {
            total,
            low,
            medium,
            high,
            critical,
            suspicious,
            averageRisk,
            averageFraud
        };
    }, [transactions]);

    const riskPercentages = useMemo(() => {
        const total = statistics.total || 1;

        return {
            low: ((statistics.low / total) * 100).toFixed(1),
            medium: ((statistics.medium / total) * 100).toFixed(1),
            high: ((statistics.high / total) * 100).toFixed(1),
            critical: ((statistics.critical / total) * 100).toFixed(1)
        };
    }, [statistics]);

    const transactionTypes = useMemo(() => {
        const map = {};

        transactions.forEach((transaction) => {
            const type = transaction.transaction_type || "unknown";
            map[type] = (map[type] || 0) + 1;
        });

        return Object.entries(map)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
    }, [transactions]);

    const topRiskTransactions = useMemo(() => {
        return [...transactions]
            .sort(
                (a, b) =>
                    Number(b.risk_score || 0) -
                    Number(a.risk_score || 0)
            )
            .slice(0, 5);
    }, [transactions]);

    if (loading) {
        return (
            <div className="analytics-loading">
                <div className="analytics-spinner" />
                <span>Loading analytics...</span>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            {error && (
                <div className="analytics-error">
                    <AlertTriangle size={17} />
                    <span>{error}</span>
                </div>
            )}

            {/* METRICS */}
            <section className="analytics-metrics">
                <div className="analytics-metric-card">
                    <div className="analytics-metric-icon blue">
                        <Activity size={20} />
                    </div>
                    <span>TOTAL TRANSACTIONS</span>
                    <strong>{statistics.total}</strong>
                    <small>Analyzed transactions</small>
                </div>

                <div className="analytics-metric-card">
                    <div className="analytics-metric-icon red">
                        <ShieldAlert size={20} />
                    </div>
                    <span>SUSPICIOUS</span>
                    <strong>{statistics.suspicious}</strong>
                    <small>High + critical</small>
                </div>

                <div className="analytics-metric-card">
                    <div className="analytics-metric-icon orange">
                        <TrendingUp size={20} />
                    </div>
                    <span>AVG RISK SCORE</span>
                    <strong>{statistics.averageRisk}</strong>
                    <small>Out of 100</small>
                </div>

                <div className="analytics-metric-card">
                    <div className="analytics-metric-icon purple">
                        <ShieldX size={20} />
                    </div>
                    <span>AVG FRAUD PROBABILITY</span>
                    <strong>{statistics.averageFraud}%</strong>
                    <small>Current dataset</small>
                </div>
            </section>

            {/* MAIN GRID */}
            <section className="analytics-grid">
                {/* RISK DISTRIBUTION */}
                <div className="analytics-panel">
                    <div className="analytics-panel-header">
                        <div>
                            <h2>Risk Distribution</h2>
                            <p>Transaction distribution by risk level</p>
                        </div>
                        <ShieldAlert size={19} />
                    </div>

                    <div className="analytics-risk-chart">
                        <div className="analytics-donut">
                            <div className="analytics-donut-inner">
                                <strong>{statistics.total}</strong>
                                <span>Total</span>
                            </div>
                        </div>

                        <div className="analytics-legend">
                            <div className="analytics-legend-item">
                                <div>
                                    <i className="legend-dot low" />
                                    <span>Low</span>
                                </div>
                                <strong>{statistics.low}</strong>
                                <small>{riskPercentages.low}%</small>
                            </div>

                            <div className="analytics-legend-item">
                                <div>
                                    <i className="legend-dot medium" />
                                    <span>Medium</span>
                                </div>
                                <strong>{statistics.medium}</strong>
                                <small>{riskPercentages.medium}%</small>
                            </div>

                            <div className="analytics-legend-item">
                                <div>
                                    <i className="legend-dot high" />
                                    <span>High</span>
                                </div>
                                <strong>{statistics.high}</strong>
                                <small>{riskPercentages.high}%</small>
                            </div>

                            <div className="analytics-legend-item">
                                <div>
                                    <i className="legend-dot critical" />
                                    <span>Critical</span>
                                </div>
                                <strong>{statistics.critical}</strong>
                                <small>{riskPercentages.critical}%</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TRANSACTION TYPES */}
                <div className="analytics-panel">
                    <div className="analytics-panel-header">
                        <div>
                            <h2>Transaction Types</h2>
                            <p>Distribution by transaction category</p>
                        </div>
                        <Activity size={19} />
                    </div>

                    <div className="transaction-type-list">
                        {transactionTypes.length === 0 ? (
                            <div className="analytics-empty">
                                No transaction data available.
                            </div>
                        ) : (
                            transactionTypes.map(([type, count]) => {
                                const percentage =
                                    statistics.total > 0
                                        ? (
                                            (count / statistics.total) * 100
                                        ).toFixed(0)
                                        : 0;

                                return (
                                    <div
                                        className="transaction-type-item"
                                        key={type}
                                    >
                                        <div className="transaction-type-header">
                                            <span>{type}</span>
                                            <strong>{count}</strong>
                                        </div>

                                        <div className="transaction-type-bar">
                                            <div
                                                style={{
                                                    width: `${percentage}%`
                                                }}
                                            />
                                        </div>

                                        <small>
                                            {percentage}% of transactions
                                        </small>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* TOP RISK TRANSACTIONS */}
            <section className="analytics-panel analytics-risk-transactions">
                <div className="analytics-panel-header">
                    <div>
                        <h2>Highest Risk Transactions</h2>
                        <p>
                            Transactions requiring the most attention
                        </p>
                    </div>
                    <ShieldX size={19} />
                </div>

                {topRiskTransactions.length === 0 ? (
                    <div className="analytics-empty">
                        <ShieldCheck size={35} />
                        <p>No transaction data available.</p>
                    </div>
                ) : (
                    <div className="analytics-risk-table-wrapper">
                        <table className="analytics-risk-table">
                            <thead>
                                <tr>
                                    <th>MERCHANT</th>
                                    <th>AMOUNT</th>
                                    <th>RISK SCORE</th>
                                    <th>FRAUD PROBABILITY</th>
                                    <th>RISK LEVEL</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {topRiskTransactions.map((transaction) => (
                                    <tr
                                        key={
                                            transaction.transaction_id
                                        }
                                    >
                                        <td>
                                            <strong>
                                                {transaction.merchant ||
                                                    "Unknown"}
                                            </strong>
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                transaction.amount || 0
                                            ).toLocaleString("en-IN")}
                                        </td>

                                        <td>
                                            <strong>
                                                {transaction.risk_score ?? 0}
                                            </strong>
                                        </td>

                                        <td>
                                            {(
                                                Number(
                                                    transaction.fraud_probability ||
                                                        0
                                                ) * 100
                                            ).toFixed(1)}
                                            %
                                        </td>

                                        <td>
                                            <span
                                                className={`analytics-risk-badge ${getRiskClass(
                                                    transaction.risk_level
                                                )}`}
                                            >
                                                {transaction.risk_level ||
                                                    "low"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="analytics-status">
                                                {transaction.status || "—"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
