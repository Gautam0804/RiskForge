import {
    AlertTriangle,
    Clock,
    ChevronRight
} from "lucide-react";

export default function LiveAlerts() {
    const alerts = [
        {
            id: "ALT-1042",
            title: "High-risk transaction detected",
            transaction: "TXN-9283",
            score: 94,
            time: "2 min ago"
        },
        {
            id: "ALT-1041",
            title: "Unusual device detected",
            transaction: "TXN-9281",
            score: 87,
            time: "5 min ago"
        },
        {
            id: "ALT-1040",
            title: "Velocity threshold exceeded",
            transaction: "TXN-9277",
            score: 81,
            time: "8 min ago"
        },
        {
            id: "ALT-1039",
            title: "Location anomaly detected",
            transaction: "TXN-9272",
            score: 76,
            time: "12 min ago"
        }
    ];

    return (
        <div className="table-section">

            <div className="section-header">
                <div>
                    <h3>Live Fraud Alerts</h3>
                    <p>Real-time high-risk activity</p>
                </div>

                <button className="text-button">
                    View all
                    <ChevronRight size={15} />
                </button>
            </div>

            <div className="alert-list">

                {alerts.map((alert) => (
                    <div className="alert-row" key={alert.id}>

                        <div className="alert-icon">
                            <AlertTriangle size={17} />
                        </div>

                        <div className="alert-content">
                            <strong>{alert.title}</strong>

                            <span>
                                {alert.transaction} · {alert.time}
                            </span>
                        </div>

                        <div className="alert-score">
                            <span>Risk</span>
                            <strong>{alert.score}</strong>
                        </div>

                        <Clock
                            size={15}
                            className="alert-time-icon"
                        />

                    </div>
                ))}

            </div>

        </div>
    );
}