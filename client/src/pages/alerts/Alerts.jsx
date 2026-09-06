import PageHeader from "../../components/common/PageHeader";
import AlertTable from "../../components/alerts/AlertTable";

export default function Alerts() {
    return (
        <div>
            <PageHeader
                title="Alert Center"
                description="Monitor high-risk events and suspicious activity."
            />

            <div className="dashboard-card">
                <AlertTable />
            </div>
        </div>
    );
}