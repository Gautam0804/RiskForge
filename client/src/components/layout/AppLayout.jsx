import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./AppLayout.css";

export default function AppLayout() {
    return (
        <div className="app-shell">
            <Sidebar />

            <div className="main-shell">
                <Topbar />

                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}