import {
    Search,
    Bell,
    ChevronDown
} from "lucide-react";
import "./Topbar.css";

export default function Topbar() {
    return (
        <header className="topbar">

            <div className="topbar-search">
                <Search size={18} />

                <input
                    type="text"
                    placeholder="Search transactions, users, alerts..."
                />

                <span className="search-shortcut">
                    ⌘ K
                </span>
            </div>

            <div className="topbar-actions">

                <button className="icon-button">
                    <Bell size={19} />
                    <span className="notification-dot" />
                </button>

                <div className="topbar-divider" />

                <button className="profile-button">

                    <div className="avatar">
                        GA
                    </div>

                    <div className="profile-info">
                        <strong>Risk Analyst</strong>
                        <span>Administrator</span>
                    </div>

                    <ChevronDown size={16} />

                </button>

            </div>

        </header>
    );
}