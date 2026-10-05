import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    CreditCard,
    Bell,
    Search,
    Bot,
    BarChart3,
    Settings,
    ShieldAlert,
    LogOut
} from "lucide-react";

const navigation = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard
    },
    {
        label: "Transactions",
        path: "/transactions",
        icon: CreditCard
    },
    {
        label: "Alerts",
        path: "/alerts",
        icon: Bell
    },
    {
        label: "Investigations",
        path: "/investigations",
        icon: Search
    },
    {
        label: "AI Investigator",
        path: "/ai-investigator",
        icon: Bot
    },
    {
        label: "Analytics",
        path: "/analytics",
        icon: BarChart3
    }
];

export default function Sidebar() {
    const navigate = useNavigate();

    function handleLogout() {
        // Remove authentication tokens
        localStorage.removeItem("token");
        localStorage.removeItem("riskforge_token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authToken");

        // Remove stored user information
        localStorage.removeItem("user");
        localStorage.removeItem("riskforge_user");

        // Clear session storage
        sessionStorage.clear();

        // Redirect to login
        navigate("/login");
    }

    return (
        <aside className="sidebar">

            {/* BRAND */}
            <div className="brand">
                <div className="brand-icon">
                    <ShieldAlert size={21} />
                </div>

                <div>
                    <div className="brand-name">
                        RiskForge
                    </div>

                    <div className="brand-subtitle">
                        Risk Intelligence
                    </div>
                </div>
            </div>

            {/* NAVIGATION */}
            <nav className="sidebar-nav">

                <div className="nav-section">
                    MONITOR
                </div>

                {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${
                                    isActive ? "active" : ""
                                }`
                            }
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}

                <div className="nav-section settings-section">
                    SYSTEM
                </div>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `nav-item ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <Settings size={18} />
                    <span>Settings</span>
                </NavLink>

            </nav>

            {/* FOOTER */}
            <div className="sidebar-footer">

                <div className="system-status">
                    <span className="status-dot" />
                    <span>
                        All systems operational
                    </span>
                </div>

                <div className="version">
                    RiskForge v1.0
                </div>

                {/* LOGOUT */}
                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}