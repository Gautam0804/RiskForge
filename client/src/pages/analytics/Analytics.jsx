import PageHeader from "../../components/common/PageHeader";
import AnalyticsCharts from "../../components/analytics/AnalyticsCharts";

export default function Analytics() {
    return (
        <div className="analytics-screen">
            <PageHeader
                title="Analytics"
                description="Understand fraud trends, risk performance and detection metrics."
            />

            <AnalyticsCharts />
        </div>
    );
}