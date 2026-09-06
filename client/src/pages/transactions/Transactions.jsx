import PageHeader from "../../components/common/PageHeader";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionTable from "../../components/transactions/TransactionTable";

export default function Transactions() {
    return (
        <div>
            <PageHeader
                title="Transactions"
                description="Monitor and investigate transaction activity in real time."
            />

            <TransactionFilters />

            <div className="dashboard-card">
                <TransactionTable />
            </div>
        </div>
    );
}