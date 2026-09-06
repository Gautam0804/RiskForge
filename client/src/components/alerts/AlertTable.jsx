import {
    AlertTriangle,
    ShieldAlert,
    MapPin,
    Smartphone
} from "lucide-react";

import RiskBadge from "../common/RiskBadge";
import StatusBadge from "../common/StatusBadge";

const alerts = [
    {
        id: "ALT-1042",
        type: "Transaction anomaly",
        transaction: "TXN-9283",
        risk: 94,
        icon: AlertTriangle,
        status: "Open",
        time: "2 min ago"
    },
    {
        id: "ALT-1041",
        type: "New device detected",
        transaction: "TXN-9281",
        risk: 87,
        icon: Smartphone,
        status: "Investigating",
        time: "5 min ago"
    },
    {
        id: "ALT-1040",
        type: "Velocity threshold",
        transaction: "TXN-9277",
        risk: 81,
        icon: ShieldAlert,
        status: "Open",
        time: "8 min ago"
    },
    {
        id: "ALT-1039",
        type: "Location anomaly",
        transaction: "TXN-9272",
        risk: 76,
        icon: MapPin,
        status: "Resolved",
        time: "12 min ago"
    }
];

export default function AlertTable() {
    return (
        <div className="transaction-table-wrapper">
            <table className="transaction-table">

                <thead>
                    <tr>
                        <th>Alert</th>
                        <th>Transaction</th>
                        <th>Risk Score</th>
                        <th>Status</th>
                        <th>Detected</th>
                    </tr>
                </thead>

                <tbody>
                    {alerts.map((alert) => {
                        const Icon = alert.icon;

                        return (
                            <tr key={alert.id}>

                                <td>
                                    <div className="alert-table-name">

                                        <div className="alert-table-icon">
                                            <Icon size={15} />
                                        </div>

                                        <div>
                                            <strong>{alert.type}</strong>
                                            <span>{alert.id}</span>
                                        </div>

                                    </div>
                                </td>

                                <td className="transaction-id">
                                    {alert.transaction}
                                </td>

                                <td>
                                    <RiskBadge score={alert.risk} />
                                </td>

                                <td>
                                    <StatusBadge status={alert.status} />
                                </td>

                                <td className="time-cell">
                                    {alert.time}
                                </td>

                            </tr>
                        );
                    })}
                </tbody>

            </table>
        </div>
    );
}