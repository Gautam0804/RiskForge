import PageHeader from "../../components/common/PageHeader";
import SettingsNav from "../../components/settings/SettingsNav";

export default function Settings() {
    return (
        <div className="settings-page">
            <PageHeader
                title="Settings"
                description="Manage RiskForge configuration, users and system preferences."
            />

            <SettingsNav />
        </div>
    );
}