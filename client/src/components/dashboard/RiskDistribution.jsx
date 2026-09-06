import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";

const data = [
    {
        name: "Low Risk",
        value: 68
    },
    {
        name: "Medium Risk",
        value: 23
    },
    {
        name: "High Risk",
        value: 9
    }
];

const COLORS = [
    "#4ade80",
    "#fbbf24",
    "#f87171"
];

export default function RiskDistribution() {
    return (
        <div className="distribution-section">

            <div className="section-header">
                <div>
                    <h3>Risk Distribution</h3>
                    <p>Current transaction risk levels</p>
                </div>
            </div>

            <div className="distribution-content">

                <div className="donut-wrapper">

                    <ResponsiveContainer
                        width="100%"
                        height={210}
                    >
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={62}
                                outerRadius={82}
                                paddingAngle={3}
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                contentStyle={{
                                    background: "#11161e",
                                    border: "1px solid #293241",
                                    borderRadius: "7px",
                                    color: "#fff",
                                    fontSize: "11px"
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="donut-center">
                        <strong>24.8K</strong>
                        <span>Transactions</span>
                    </div>

                </div>

                <div className="risk-legend">

                    {data.map((item, index) => (
                        <div
                            className="risk-legend-item"
                            key={item.name}
                        >
                            <div className="risk-legend-name">
                                <span
                                    className="risk-legend-dot"
                                    style={{
                                        background: COLORS[index]
                                    }}
                                />

                                {item.name}
                            </div>

                            <strong>
                                {item.value}%
                            </strong>
                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}