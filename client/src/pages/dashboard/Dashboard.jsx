import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import { getDashboardOverview } from "../../services/dashboard.service";

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const data = await getDashboardOverview();
                setDashboard(data);
            } catch (err) {
                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-state">
                <div className="dashboard-loader">
                    Loading RiskForge intelligence...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-state">
                <div className="dashboard-error">
                    {error}
                </div>
            </div>
        );
    }

    const overview = dashboard?.overview || {};

    const distribution = dashboard?.riskDistribution || [];

    const distributionData = distribution.map((item) => ({
        name: item.risk_level,
        value: Number(item.count),
    }));

    const total = Number(overview.total_transactions || 0);

    return (
        <div className="dashboard-page">

            {/* HEADER */}

            <div className="dashboard-heading">
                <div>
                    <div className="eyebrow">
                        RISK INTELLIGENCE
                    </div>

                    <h1>Risk Overview</h1>

                    <p>
                        Real-time fraud detection and transaction
                        risk intelligence.
                    </p>
                </div>

                <div className="dashboard-status">
                    <span className="status-dot"></span>
                    System operational
                </div>
            </div>

            {/* KPI CARDS */}

            <div className="dashboard-kpis">

                <div className="risk-kpi">
                    <div className="kpi-top">
                        <span>Transactions Today</span>
                        <span className="kpi-icon blue">
                            ↗
                        </span>
                    </div>

                    <strong>
                        {Number(
                            overview.total_transactions || 0
                        ).toLocaleString()}
                    </strong>

                    <small>
                        Processed today
                    </small>
                </div>

                <div className="risk-kpi">
                    <div className="kpi-top">
                        <span>Suspicious Transactions</span>
                        <span className="kpi-icon yellow">
                            !
                        </span>
                    </div>

                    <strong>
                        {Number(
                            overview.suspicious_transactions || 0
                        ).toLocaleString()}
                    </strong>

                    <small>
                        Risk score ≥ 50
                    </small>
                </div>

                <div className="risk-kpi">
                    <div className="kpi-top">
                        <span>High Risk</span>
                        <span className="kpi-icon red">
                            !
                        </span>
                    </div>

                    <strong>
                        {Number(
                            overview.high_risk_transactions || 0
                        ).toLocaleString()}
                    </strong>

                    <small>
                        Requires review
                    </small>
                </div>

                <div className="risk-kpi">
                    <div className="kpi-top">
                        <span>Confirmed Fraud</span>
                        <span className="kpi-icon green">
                            ✓
                        </span>
                    </div>

                    <strong>
                        {Number(
                            overview.confirmed_fraud || 0
                        ).toLocaleString()}
                    </strong>

                    <small>
                        Confirmed cases
                    </small>
                </div>

            </div>

            {/* MAIN GRID */}

            <div className="dashboard-main-grid">

                {/* RISK ACTIVITY */}

                <section className="dashboard-panel risk-activity">

                    <div className="panel-heading">
                        <div>
                            <h2>Transaction Risk Activity</h2>
                            <p>
                                Risk activity across the current
                                monitoring period.
                            </p>
                        </div>

                        <div className="panel-legend">
                            <span>
                                <i className="legend-risk"></i>
                                Risk score
                            </span>

                            <span>
                                <i className="legend-transactions"></i>
                                Transactions
                            </span>
                        </div>
                    </div>

                    <div className="chart-container">

                        {total === 0 ? (
                            <div className="chart-empty">
                                <div className="empty-icon">
                                    ◌
                                </div>

                                <strong>
                                    No transaction activity yet
                                </strong>

                                <span>
                                    Process your first transaction
                                    to populate risk analytics.
                                </span>
                            </div>
                        ) : (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <AreaChart
                                    data={[
                                        {
                                            time: "00:00",
                                            risk: 18,
                                        },
                                        {
                                            time: "04:00",
                                            risk: 12,
                                        },
                                        {
                                            time: "08:00",
                                            risk: 26,
                                        },
                                        {
                                            time: "12:00",
                                            risk: 42,
                                        },
                                        {
                                            time: "16:00",
                                            risk: 51,
                                        },
                                        {
                                            time: "20:00",
                                            risk: 37,
                                        },
                                        {
                                            time: "24:00",
                                            risk: 31,
                                        },
                                    ]}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        opacity={0.12}
                                    />

                                    <XAxis
                                        dataKey="time"
                                        tick={{ fontSize: 11 }}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 11 }}
                                    />

                                    <Tooltip />

                                    <Area
                                        type="monotone"
                                        dataKey="risk"
                                        stroke="#60a5fa"
                                        fill="#60a5fa"
                                        fillOpacity={0.08}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}

                    </div>

                </section>

                {/* RISK DISTRIBUTION */}

                <section className="dashboard-panel">

                    <div className="panel-heading">
                        <div>
                            <h2>Risk Distribution</h2>
                            <p>
                                Current transaction risk levels.
                            </p>
                        </div>
                    </div>

                    {distributionData.length === 0 ? (
                        <div className="distribution-empty">
                            <strong>
                                No transactions processed today
                            </strong>

                            <span>
                                Risk distribution will appear here
                                automatically.
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="risk-pie">

                                <ResponsiveContainer
                                    width="100%"
                                    height={220}
                                >
                                    <PieChart>
                                        <Pie
                                            data={distributionData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={65}
                                            outerRadius={90}
                                            paddingAngle={3}
                                        >
                                            {distributionData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={
                                                            [
                                                                "#4ade80",
                                                                "#fbbf24",
                                                                "#f87171",
                                                                "#ef4444",
                                                            ][
                                                                index %
                                                                    4
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>

                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="pie-center">
                                    <strong>{total}</strong>
                                    <span>transactions</span>
                                </div>

                            </div>

                            <div className="risk-list">

                                {distributionData.map(
                                    (item) => (
                                        <div
                                            className="risk-list-row"
                                            key={item.name}
                                        >
                                            <div>
                                                <span
                                                    className={`risk-dot ${item.name}`}
                                                ></span>

                                                <span>
                                                    {item.name}
                                                </span>
                                            </div>

                                            <strong>
                                                {item.value}
                                            </strong>
                                        </div>
                                    )
                                )}

                            </div>
                        </>
                    )}

                </section>

            </div>

            {/* SYSTEM INFORMATION */}

            <section className="dashboard-panel dashboard-system">

                <div>
                    <h2>Risk Engine Status</h2>

                    <p>
                        Rules-based risk scoring engine is connected
                        and ready to process transactions.
                    </p>
                </div>

                <div className="engine-status">
                    <span className="status-dot"></span>
                    Operational
                </div>

            </section>

        </div>
    );
}