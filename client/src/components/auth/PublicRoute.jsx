import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
    const token =
        localStorage.getItem("riskforge_token");

    if (token) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
}