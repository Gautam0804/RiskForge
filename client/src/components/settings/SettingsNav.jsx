import { useEffect, useState } from "react";

import {
    User,
    Users,
    ShieldCheck,
    Bell,
    KeyRound,
    ScrollText,
    Settings as SettingsIcon,
    CheckCircle2,
    Lock,
    Database,
    Server,
    Brain,
    Radio
} from "lucide-react";

import { getCurrentUser } from "../../services/auth.service";

import ChangePasswordModal
    from "./ChangePasswordModal";

import "./SettingsNav.css";


/* =========================================
   SETTINGS ITEMS
========================================= */

const settings = [
    {
        id: "profile",
        label: "Profile",
        description: "Manage your account and profile information.",
        icon: User
    },
    {
        id: "users",
        label: "Users & Roles",
        description: "Manage administrators, analysts and permissions.",
        icon: Users
    },
    {
        id: "fraud-rules",
        label: "Fraud Rules",
        description: "Configure automated fraud detection thresholds.",
        icon: ShieldCheck
    },
    {
        id: "notifications",
        label: "Notifications",
        description: "Configure alerts and notification preferences.",
        icon: Bell
    },
    {
        id: "api-keys",
        label: "API Keys",
        description: "Manage API credentials and integrations.",
        icon: KeyRound
    },
    {
        id: "audit-logs",
        label: "Audit Logs",
        description: "Review security and administrative activity.",
        icon: ScrollText
    },
    {
        id: "system",
        label: "System Configuration",
        description: "Manage platform services and configuration.",
        icon: SettingsIcon
    }
];


/* =========================================
   MAIN SETTINGS NAV
========================================= */

export default function SettingsNav() {

    const [activeSetting, setActiveSetting] =
        useState("profile");


    return (
        <div className="settings-layout">

            {/* =================================
                SIDEBAR
            ================================= */}

            <aside className="settings-sidebar">

                <div className="settings-sidebar-title">
                    CONFIGURATION
                </div>


                <nav>

                    {settings.map((setting) => {

                        const Icon =
                            setting.icon;


                        return (
                            <button
                                key={setting.id}
                                type="button"
                                className={
                                    `settings-nav-item ${
                                        activeSetting ===
                                        setting.id
                                            ? "active"
                                            : ""
                                    }`
                                }
                                onClick={() =>
                                    setActiveSetting(
                                        setting.id
                                    )
                                }
                            >

                                <Icon
                                    size={17}
                                    strokeWidth={1.8}
                                />


                                <div>

                                    <strong>
                                        {setting.label}
                                    </strong>

                                    <span>
                                        {setting.description}
                                    </span>

                                </div>

                            </button>
                        );

                    })}

                </nav>

            </aside>


            {/* =================================
                CONTENT
            ================================= */}

            <main className="settings-content">

                <SettingsContent
                    activeSetting={
                        activeSetting
                    }
                />

            </main>

        </div>
    );
}


/* =========================================
   SETTINGS CONTENT SWITCH
========================================= */

function SettingsContent({
    activeSetting
}) {

    switch (activeSetting) {

        case "profile":
            return <ProfileSection />;

        case "users":
            return <UsersSection />;

        case "fraud-rules":
            return <FraudRulesSection />;

        case "notifications":
            return <NotificationsSection />;

        case "api-keys":
            return <ApiKeysSection />;

        case "audit-logs":
            return <AuditLogsSection />;

        case "system":
            return <SystemSection />;

        default:
            return <ProfileSection />;
    }
}


/* =========================================
   PROFILE SECTION
========================================= */

function ProfileSection() {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        let mounted = true;


        async function loadUser() {

            try {

                setLoading(true);

                const data =
                    await getCurrentUser();


                if (mounted) {

                    setUser(
                        data?.user || null
                    );

                }

            } catch (err) {

                console.error(
                    "Failed to load profile:",
                    err
                );


                if (mounted) {

                    setError(
                        "Unable to load your profile."
                    );

                }

            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }
        }


        loadUser();


        return () => {
            mounted = false;
        };

    }, []);


    const fullName =
        user?.full_name ||
        "RiskForge Administrator";


    const email =
        user?.email ||
        "admin@riskforge.com";


    const role =
        user?.role ||
        "admin";


    const initials =
        fullName
            .split(" ")
            .filter(Boolean)
            .map(
                (word) => word[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();


    return (
        <>

            {/* =================================
                PROFILE CARD
            ================================= */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div>

                        <div className="eyebrow">
                            ACCOUNT
                        </div>

                        <h2>
                            Profile
                        </h2>

                        <p>
                            Manage your RiskForge analyst account.
                        </p>

                    </div>

                </div>


                {loading && (

                    <div className="settings-placeholder">

                        <p>
                            Loading profile...
                        </p>

                    </div>

                )}


                {!loading && error && (

                    <div className="settings-placeholder">

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {!loading && !error && (

                    <div className="settings-form">

                        {/* AVATAR */}

                        <div className="settings-avatar">

                            {initials}

                        </div>


                        {/* FIELDS */}

                        <div className="settings-fields">

                            <label>

                                Full name

                                <input
                                    type="text"
                                    value={fullName}
                                    readOnly
                                />

                            </label>


                            <label>

                                Email address

                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                />

                            </label>


                            <label>

                                Role

                                <input
                                    type="text"
                                    value={role}
                                    readOnly
                                />

                            </label>


                            <label>

                                Account status

                                <div className="settings-status">

                                    <span className="status-dot"></span>

                                    Active

                                </div>

                            </label>

                        </div>

                    </div>

                )}

            </div>


            {/* =================================
                SECURITY CARD
            ================================= */}

            <SecuritySection />

        </>
    );
}


/* =========================================
   SECURITY SECTION
========================================= */

function SecuritySection() {

    const [
        showPasswordModal,
        setShowPasswordModal
    ] = useState(false);


    const [
        twoFactorEnabled,
        setTwoFactorEnabled
    ] = useState(false);


    return (
        <>

            <div className="settings-card">

                <div className="settings-card-header">

                    <div>

                        <div className="eyebrow">
                            SECURITY
                        </div>

                        <h2>
                            Security
                        </h2>

                        <p>
                            Manage authentication and account security.
                        </p>

                    </div>

                </div>


                {/* PASSWORD */}

                <div className="security-row">

                    <div className="security-row-info">

                        <div className="settings-row-icon">

                            <Lock size={18} />

                        </div>


                        <div>

                            <strong>
                                Password
                            </strong>

                            <span>
                                Change your account password.
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="settings-action"
                        onClick={() =>
                            setShowPasswordModal(
                                true
                            )
                        }
                    >
                        Change
                    </button>

                </div>


                {/* TWO FACTOR */}

                <div className="security-row">

                    <div className="security-row-info">

                        <div className="settings-row-icon">

                            <ShieldCheck size={18} />

                        </div>


                        <div>

                            <strong>
                                Two-factor authentication
                            </strong>

                            <span>
                                Add an additional layer of account protection.
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className={
                            `toggle ${
                                twoFactorEnabled
                                    ? "on"
                                    : ""
                            }`
                        }
                        onClick={() =>
                            setTwoFactorEnabled(
                                (value) =>
                                    !value
                            )
                        }
                        aria-label="Toggle two-factor authentication"
                    >

                        <span></span>

                    </button>

                </div>


                {/* CURRENT SESSION */}

                <div className="security-row">

                    <div className="security-row-info">

                        <div className="settings-row-icon">

                            <Radio size={18} />

                        </div>


                        <div>

                            <strong>
                                Current session
                            </strong>

                            <span>
                                Your current RiskForge session is active.
                            </span>

                        </div>

                    </div>


                    <div className="session-active">

                        <CheckCircle2
                            size={15}
                        />

                        Active

                    </div>

                </div>

            </div>


            {/* =================================
                CHANGE PASSWORD MODAL
            ================================= */}

            {showPasswordModal && (

                <ChangePasswordModal
                    onClose={() =>
                        setShowPasswordModal(
                            false
                        )
                    }
                />

            )}

        </>
    );
}


/* =========================================
   USERS & ROLES
========================================= */

function UsersSection() {

    return (

        <div className="settings-card">

            <div className="settings-card-header">

                <div>

                    <div className="eyebrow">
                        ACCESS CONTROL
                    </div>

                    <h2>
                        Users & Roles
                    </h2>

                    <p>
                        Manage administrators, analysts and permissions.
                    </p>

                </div>

            </div>


            <div className="settings-placeholder">

                <Users size={28} />

                <h3>
                    User management
                </h3>

                <p>
                    User and role management will be available here.
                </p>

            </div>

        </div>

    );
}


/* =========================================
   FRAUD RULES
========================================= */

function FraudRulesSection() {

    const [
        highRiskThreshold,
        setHighRiskThreshold
    ] = useState(70);


    const [
        criticalRiskThreshold,
        setCriticalRiskThreshold
    ] = useState(90);


    return (

        <div className="settings-card">

            <div className="settings-card-header">

                <div>

                    <div className="eyebrow">
                        DETECTION
                    </div>

                    <h2>
                        Fraud Rules
                    </h2>

                    <p>
                        Configure automated fraud detection thresholds.
                    </p>

                </div>

            </div>


            {/* HIGH RISK */}

            <div className="rule-control">

                <div>

                    <strong>
                        High Risk Threshold
                    </strong>

                    <span>
                        Transactions above this score are classified as high risk.
                    </span>

                </div>


                <div className="threshold-control">

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={highRiskThreshold}
                        onChange={(event) =>
                            setHighRiskThreshold(
                                Number(
                                    event.target.value
                                )
                            )
                        }
                    />

                    <strong>
                        {highRiskThreshold}
                    </strong>

                </div>

            </div>


            {/* CRITICAL RISK */}

            <div className="rule-control">

                <div>

                    <strong>
                        Critical Risk Threshold
                    </strong>

                    <span>
                        Transactions above this score require immediate attention.
                    </span>

                </div>


                <div className="threshold-control">

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={criticalRiskThreshold}
                        onChange={(event) =>
                            setCriticalRiskThreshold(
                                Number(
                                    event.target.value
                                )
                            )
                        }
                    />

                    <strong>
                        {criticalRiskThreshold}
                    </strong>

                </div>

            </div>


            {/* RULE SUMMARY */}

            <div className="rule-grid">

                <div className="rule-box">

                    <span>
                        Low
                    </span>

                    <strong>
                        0 - 39
                    </strong>

                </div>


                <div className="rule-box">

                    <span>
                        Medium
                    </span>

                    <strong>
                        40 - 69
                    </strong>

                </div>


                <div className="rule-box">

                    <span>
                        High
                    </span>

                    <strong>
                        {highRiskThreshold}+
                    </strong>

                </div>


                <div className="rule-box">

                    <span>
                        Critical
                    </span>

                    <strong>
                        {criticalRiskThreshold}+
                    </strong>

                </div>

            </div>

        </div>

    );
}


/* =========================================
   NOTIFICATIONS
========================================= */

function NotificationsSection() {

    const [
        highRiskAlerts,
        setHighRiskAlerts
    ] = useState(true);


    const [
        investigationAlerts,
        setInvestigationAlerts
    ] = useState(true);


    const [
        systemAlerts,
        setSystemAlerts
    ] = useState(true);


    return (

        <div className="settings-card">

            <div className="settings-card-header">

                <div>

                    <div className="eyebrow">
                        ALERTS
                    </div>

                    <h2>
                        Notifications
                    </h2>

                    <p>
                        Configure how RiskForge notifies you.
                    </p>

                </div>

            </div>


            <NotificationRow
                title="High-risk transactions"
                description="Receive notifications when high-risk transactions are detected."
                enabled={highRiskAlerts}
                onToggle={() =>
                    setHighRiskAlerts(
                        (value) => !value
                    )
                }
            />


            <NotificationRow
                title="Investigation updates"
                description="Receive updates when investigations are created or changed."
                enabled={investigationAlerts}
                onToggle={() =>
                    setInvestigationAlerts(
                        (value) => !value
                    )
                }
            />


            <NotificationRow
                title="System notifications"
                description="Receive important RiskForge system notifications."
                enabled={systemAlerts}
                onToggle={() =>
                    setSystemAlerts(
                        (value) => !value
                    )
                }
            />

        </div>

    );
}


/* =========================================
   NOTIFICATION ROW
========================================= */

function NotificationRow({
    title,
    description,
    enabled,
    onToggle
}) {

    return (

        <div className="notification-row">

            <div>

                <strong>
                    {title}
                </strong>

                <span>
                    {description}
                </span>

            </div>


            <button
                type="button"
                className={
                    `toggle ${
                        enabled
                            ? "on"
                            : ""
                    }`
                }
                onClick={onToggle}
                aria-label={`Toggle ${title}`}
            >

                <span></span>

            </button>

        </div>

    );
}


/* =========================================
   API KEYS
========================================= */

function ApiKeysSection() {

    return (

        <div className="settings-card">

            <div className="settings-card-header">

                <div>

                    <div className="eyebrow">
                        INTEGRATIONS
                    </div>

                    <h2>
                        API Keys
                    </h2>

                    <p>
                        Manage API credentials and integrations.
                    </p>

                </div>

            </div>


            <div className="settings-placeholder">

                <KeyRound size={28} />

                <h3>
                    API Keys
                </h3>

                <p>
                    API key management will be available here.
                </p>

            </div>

        </div>

    );
}


/* =========================================
   AUDIT LOGS
========================================= */

function AuditLogsSection() {

    return (

        <div className="settings-card">

            <div className="settings-card-header">

                <div>

                    <div className="eyebrow">
                        SECURITY
                    </div>

                    <h2>
                        Audit Logs
                    </h2>

                    <p>
                        Review security and administrative activity.
                    </p>

                </div>

            </div>


            <div className="audit-list">

                <div className="audit-item">

                    <div className="audit-icon">

                        <Lock size={16} />

                    </div>


                    <div>

                        <strong>
                            User signed in
                        </strong>

                        <span>
                            RiskForge administrator session
                        </span>

                    </div>


                    <time>
                        Current session
                    </time>

                </div>


                <div className="audit-item">

                    <div className="audit-icon">

                        <SettingsIcon size={16} />

                    </div>


                    <div>

                        <strong>
                            Settings accessed
                        </strong>

                        <span>
                            RiskForge configuration
                        </span>

                    </div>


                    <time>
                        Current session
                    </time>

                </div>

            </div>

        </div>

    );
}


/* =========================================
   SYSTEM CONFIGURATION
========================================= */

function SystemSection() {

    return (

        <div className="settings-card">

            <div className="settings-card-header">

                <div>

                    <div className="eyebrow">
                        PLATFORM
                    </div>

                    <h2>
                        System Configuration
                    </h2>

                    <p>
                        Manage platform services and configuration.
                    </p>

                </div>

            </div>


            <div className="service-status-list">

                <ServiceRow
                    icon={Database}
                    title="PostgreSQL"
                    description="Primary application database"
                />


                <ServiceRow
                    icon={Server}
                    title="Node.js API"
                    description="RiskForge backend service"
                />


                <ServiceRow
                    icon={Brain}
                    title="AI / ML Service"
                    description="Fraud risk intelligence service"
                />


                <ServiceRow
                    icon={Radio}
                    title="Redis"
                    description="Cache and real-time service"
                />

            </div>

        </div>

    );
}


/* =========================================
   SERVICE ROW
========================================= */

function ServiceRow({
    icon: Icon,
    title,
    description
}) {

    return (

        <div className="service-status">

            <div className="service-info">

                <div className="service-icon">

                    <Icon size={18} />

                </div>


                <div>

                    <strong>
                        {title}
                    </strong>

                    <span>
                        {description}
                    </span>

                </div>

            </div>


            <div className="service-online">

                <span className="status-dot"></span>

                Operational

            </div>

        </div>

    );
}