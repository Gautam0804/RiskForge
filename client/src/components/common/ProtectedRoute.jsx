import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute() {
    const {
        loading,
        isAuthenticated
    } = useAuth();

    if (loading) {
        return (
            <div className="auth-loading">
                Loading RiskForge...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}