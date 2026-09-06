import { ChevronRight } from "lucide-react";

export default function RecentTransactions() {
    const transactions = [
        {
            id: "TXN-9283",
            user: "Priya Sharma",
            amount: "₹88,200",
            risk: 94,
            status: "Blocked"
        },
        {
            id: "TXN-9282",
            user: "Aman Verma",
            amount: "₹1,200",
            risk: 12,
            status: "Approved"
        },
        {
            id: "TXN-9281",
            user: "Rahul Singh",
            amount: "₹12,400",
            risk: 82,
            status: "Review"
        },
        {
            id: "TXN-9280",
            user: "Neha Gupta",
            amount: "₹4,800",
            risk: 24,
            status: "Approved"
        }
    ];

    return (
        <div className="table-section">

            <div className="section-header">
                <div>
                    <h3>Recent Transactions</h3>
                    <p>Latest transaction activity</p>
                </div>

                <button className="text-button">
                    View all
                    <ChevronRight size={15} />
                </button>
            </div>

            <div className="transaction-table-wrapper">

                <table className="transaction-table">

                    <thead>
                        <tr>
                            <th>Transaction</th>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Risk</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>

                                <td className="transaction-id">
                                    {transaction.id}
                                </td>

                                <td>
                                    {transaction.user}
                                </td>

                                <td>
                                    {transaction.amount}
                                </td>

                                <td>
                                    <span
                                        className={
                                            transaction.risk >= 80
                                                ? "risk-high"
                                                : transaction.risk >= 50
                                                    ? "risk-medium"
                                                    : "risk-low"
                                        }
                                    >
                                        {transaction.risk}
                                    </span>
                                </td>

                                <td>
                                    <span
                                        className={`status-badge status-${transaction.status.toLowerCase()}`}
                                    >
                                        {transaction.status}
                                    </span>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    );
}