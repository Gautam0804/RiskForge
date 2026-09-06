import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

const data = [
    { time: "00:00", transactions: 820, risk: 32 },
    { time: "04:00", transactions: 610, risk: 24 },
    { time: "08:00", transactions: 1250, risk: 41 },
    { time: "12:00", transactions: 1890, risk: 58 },
    { time: "16:00", transactions: 2310, risk: 67 },
    { time: "20:00", transactions: 2100, risk: 52 },
    { time: "24:00", transactions: 1480, risk: 45 }
];

export default function RiskChart() {
    return (
        <div className="chart-section">

            <div className="section-header">
                <div>
                    <h3>Transaction Risk Activity</h3>
                    <p>Risk activity across the last 24 hours</p>
                </div>

                <div className="chart-legend">
                    <span>
                        <i className="legend-risk" />
                        Risk score
                    </span>

                    <span>
                        <i className="legend-volume" />
                        Transactions
                    </span>
                </div>
            </div>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 20,
                            left: -20,
                            bottom: 0
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="riskGradient"
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
                            dataKey="time"
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
                            dataKey="risk"
                            stroke="#7dd3fc"
                            strokeWidth={2}
                            fill="url(#riskGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}