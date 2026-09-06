import PageHeader from "../../components/common/PageHeader";
import InvestigationPanel from "../../components/investigations/InvestigationPanel";

export default function Investigations() {
    return (
        <div>
            <PageHeader
                title="Investigations"
                description="Review suspicious transactions and manage fraud investigations."
            />

            <InvestigationPanel />
        </div>
    );
}