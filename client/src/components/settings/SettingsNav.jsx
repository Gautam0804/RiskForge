import {
    User,
    Users,
    ShieldCheck,
    Bell,
    KeyRound,
    ScrollText,
    Settings as SettingsIcon
} from "lucide-react";

const settings = [
    {
        id: "profile",
        title: "Profile",
        description: "Manage your account and analyst information.",
        icon: User
    },
    {
        id: "users",
        title: "Users & Roles",
        description: "Manage administrators, analysts and permissions.",
        icon: Users
    },
    {
        id: "fraud-rules",
        title: "Fraud Rules",
        description: "Configure rule-based risk detection thresholds.",
        icon: ShieldCheck
    },
    {
        id: "notifications",
        title: "Notifications",
        description: "Configure alert and investigation notifications.",
        icon: Bell
    },
    {
        id: "api-keys",
        title: "API Keys",
        description: "Manage API credentials and integrations.",
        icon: KeyRound
    },
    {
        id: "audit-logs",
        title: "Audit Logs",
        description: "Review security and administrative activity.",
        icon: ScrollText
    },
    {
        id: "system",
        title: "System Configuration",
        description: "Manage platform and service configuration.",
        icon: SettingsIcon
    }
];

export default function SettingsNav() {
    return (
        <div className="settings-layout">

            <div className="settings-sidebar">
                <div className="settings-sidebar-title">
                    Configuration
                </div>

                {settings.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            className={`settings-nav-item ${
                                index === 0 ? "active" : ""
                            }`}
                        >
                            <Icon size={16} />

                            <div>
                                <strong>{item.title}</strong>
                                <span>{item.description}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="settings-content">

                <div className="settings-card">
                    <div className="settings-card-header">
                        <div>
                            <span className="eyebrow">
                                ACCOUNT
                            </span>

                            <h2>Profile</h2>

                            <p>
                                Manage your RiskForge analyst account.
                            </p>
                        </div>
                    </div>

                    <div className="settings-form">

                        <div className="settings-avatar">
                            GA
                        </div>

                        <div className="settings-fields">

                            <label>
                                Full name
                                <input
                                    type="text"
                                    value="Risk Analyst"
                                    readOnly
                                />
                            </label>

                            <label>
                                Email address
                                <input
                                    type="email"
                                    value="analyst@riskforge.com"
                                    readOnly
                                />
                            </label>

                            <label>
                                Role
                                <input
                                    type="text"
                                    value="Administrator"
                                    readOnly
                                />
                            </label>

                            <label>
                                Account status
                                <div className="settings-status">
                                    <span className="status-dot" />
                                    Active
                                </div>
                            </label>

                        </div>
                    </div>
                </div>

                <div className="settings-card">

                    <div className="settings-card-header">
                        <div>
                            <span className="eyebrow">
                                SECURITY
                            </span>

                            <h2>Security</h2>

                            <p>
                                Security controls for your RiskForge account.
                            </p>
                        </div>
                    </div>

                    <div className="security-row">
                        <div>
                            <strong>Two-factor authentication</strong>
                            <span>
                                Add an additional layer of protection
                                to your account.
                            </span>
                        </div>

                        <button className="settings-action">
                            Enable
                        </button>
                    </div>

                    <div className="security-row">
                        <div>
                            <strong>Password</strong>
                            <span>
                                Last changed 30 days ago.
                            </span>
                        </div>

                        <button className="settings-action">
                            Change
                        </button>
                    </div>

                </div>

                <div className="settings-card">

                    <div className="settings-card-header">
                        <div>
                            <span className="eyebrow">
                                PLATFORM
                            </span>

                            <h2>System Status</h2>

                            <p>
                                Current RiskForge service health.
                            </p>
                        </div>
                    </div>

                    <div className="service-status-list">

                        <div className="service-status">
                            <div>
                                <strong>API Server</strong>
                                <span>Node.js / Express</span>
                            </div>

                            <div className="service-online">
                                <span className="status-dot" />
                                Operational
                            </div>
                        </div>

                        <div className="service-status">
                            <div>
                                <strong>Database</strong>
                                <span>PostgreSQL</span>
                            </div>

                            <div className="service-online">
                                <span className="status-dot" />
                                Operational
                            </div>
                        </div>

                        <div className="service-status">
                            <div>
                                <strong>ML Engine</strong>
                                <span>FastAPI / XGBoost</span>
                            </div>

                            <div className="service-online">
                                <span className="status-dot" />
                                Operational
                            </div>
                        </div>

                        <div className="service-status">
                            <div>
                                <strong>Realtime Engine</strong>
                                <span>Redis / Socket.IO</span>
                            </div>

                            <div className="service-online">
                                <span className="status-dot" />
                                Operational
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}