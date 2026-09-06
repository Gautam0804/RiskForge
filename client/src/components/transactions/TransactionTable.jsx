import RiskBadge from "../common/RiskBadge";
import StatusBadge from "../common/StatusBadge";

const transactions = [
    {
        id: "TXN-9283",
        user: "Priya Sharma",
        merchant: "Amazon",
        amount: "₹88,200",
        risk: 94,
        status: "Blocked",
        time: "11:42 AM"
    },
    {
        id: "TXN-9282",
        user: "Aman Verma",
        merchant: "Flipkart",
        amount: "₹1,200",
        risk: 12,
        status: "Approved",
        time: "11:39 AM"
    },
    {
        id: "TXN-9281",
        user: "Rahul Singh",
        merchant: "Apple Store",
        amount: "₹12,400",
        risk: 82,
        status: "Review",
        time: "11:35 AM"
    },
    {
        id: "TXN-9280",
        user: "Neha Gupta",
        merchant: "Myntra",
        amount: "₹4,800",
        risk: 24,
        status: "Approved",
        time: "11:31 AM"
    },
    {
        id: "TXN-9279",
        user: "Arjun Mehta",
        merchant: "Uber",
        amount: "₹2,450",
        risk: 37,
        status: "Approved",
        time: "11:28 AM"
    }
];

export default function TransactionTable() {
    return (
        <div className="transaction-table-wrapper">

            <table className="transaction-table">

                <thead>
                    <tr>
                        <th>Transaction</th>
                        <th>User</th>
                        <th>Merchant</th>
                        <th>Amount</th>
                        <th>Risk</th>
                        <th>Status</th>
                        <th>Time</th>
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
                                {transaction.merchant}
                            </td>

                            <td className="amount-cell">
                                {transaction.amount}
                            </td>

                            <td>
                                <RiskBadge score={transaction.risk} />
                            </td>

                            <td>
                                <StatusBadge status={transaction.status} />
                            </td>

                            <td className="time-cell">
                                {transaction.time}
                            </td>

                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}