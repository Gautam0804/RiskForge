import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";

import Dashboard from "./pages/dashboard/Dashboard";
import Transactions from "./pages/transactions/Transactions";
import CreateTransaction from "./pages/transactions/CreateTransaction";
import TransactionDetails from "./pages/transactions/TransactionDetails";

import Alerts from "./pages/alerts/Alerts";
import Investigations from "./pages/investigations/Investigations";
import AIInvestigator from "./pages/ai/AIInvestigator";
import Analytics from "./pages/analytics/Analytics";
import Settings from "./pages/settings/Settings";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
    return (
        <Routes>
            {/* Public Route */}
            <Route
                path="/login"
                element={<Login />}
            />

            {/* Protected Application Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/transactions"
                        element={<Transactions />}
                    />

                    <Route
                        path="/transactions/create"
                        element={<CreateTransaction />}
                    />

                    <Route
                        path="/transactions/:transactionId"
                        element={<TransactionDetails />}
                    />

                    <Route
                        path="/alerts"
                        element={<Alerts />}
                    />

                    <Route
                        path="/investigations"
                        element={<Investigations />}
                    />

                    <Route
                        path="/ai-investigator"
                        element={<AIInvestigator />}
                    />

                    <Route
                        path="/analytics"
                        element={<Analytics />}
                    />

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>
            </Route>

            {/* Default Route */}
            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

            {/* Not Found Route */}
            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />
        </Routes>
    );
}