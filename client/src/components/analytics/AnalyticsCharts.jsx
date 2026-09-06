import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

const fraudTrend = [
    { day: "Mon", transactions: 3200, fraud: 42 },
    { day: "Tue", transactions: 4100, fraud: 51 },
    { day: "Wed", transactions: 3800, fraud: 47 },
    { day: "Thu", transactions: 4600, fraud: 63 },
    { day: "Fri", transactions: 5200, fraud: 71 },
    { day: "Sat", transactions: 4300, fraud: 55 },
    { day: "Sun", transactions: 4892, fraud: 61 }
];

const locations = [
    { location: "Mumbai", fraud: 82 },
    { location: "Delhi", fraud: 67 },
    { location: "Bangalore", fraud: 54 },
    { location: "Pune", fraud: 43 },
    { location: "Hyderabad", fraud: 38 }
];

function MetricCard({ label, value, change }) {
    return (
        <div className="analytics-metric">
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{change}</small>
        </div>
    );
}

export default function AnalyticsCharts() {
    return (
        <div className="analytics-page">

            <div className="analytics-metrics">
                <MetricCard
                    label="Fraud Rate"
                    value="0.12%"
                    change="+0.02% this week"
                />

                <MetricCard
                    label="Detection Accuracy"
                    value="97.8%"
                    change="+1.4% this week"
                />

                <MetricCard
                    label="False Positive Rate"
                    value="2.1%"
                    change="-0.6% this week"
                />

                <MetricCard
                    label="Average Risk Score"
                    value="34.7"
                    change="-3.2% this week"
                />
            </div>

            <div className="analytics-grid">

                <div className="dashboard-card analytics-chart-card">
                    <div className="section-header">
                        <div>
                            <h3>Fraud Detection Trend</h3>
                            <p>Transaction volume and detected fraud over the last 7 days</p>
                        </div>
                    </div>

                    <div className="analytics-chart">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={fraudTrend}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: -20,
                                    bottom: 0
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="fraudGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopOpacity={0.25}
                                        />
                                        <stop
                                            offset="100%"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    stroke="#1c2330"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="day"
                                    tick={{
                                        fill: "#596474",
                                        fontSize: 9
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    tick={{
                                        fill: "#596474",
                                        fontSize: 9
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip
                                    contentStyle={{
                                        background: "#11161e",
                                        border: "1px solid #293241",
                                        borderRadius: "7px",
                                        color: "#fff",
                                        fontSize: "11px"
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="fraud"
                                    stroke="#f87171"
                                    strokeWidth={2}
                                    fill="url(#fraudGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboard-card analytics-chart-card">
                    <div className="section-header">
                        <div>
                            <h3>Fraud by Location</h3>
                            <p>Detected fraud incidents by region</p>
                        </div>
                    </div>

                    <div className="analytics-chart">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={locations}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: -20,
                                    bottom: 0
                                }}
                            >
                                <CartesianGrid
                                    stroke="#1c2330"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="location"
                                    tick={{
                                        fill: "#596474",
                                        fontSize: 9
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    tick={{
                                        fill: "#596474",
                                        fontSize: 9
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip
                                    contentStyle={{
                                        background: "#11161e",
                                        border: "1px solid #293241",
                                        borderRadius: "7px",
                                        color: "#fff",
                                        fontSize: "11px"
                                    }}
                                />

                                <Bar
                                    dataKey="fraud"
                                    fill="#7dd3fc"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}