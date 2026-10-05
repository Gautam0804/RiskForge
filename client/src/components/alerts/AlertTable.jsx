import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Search,
    Filter,
    Brain,
    RefreshCw,
    AlertTriangle,
    ShieldAlert
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import api from "../../services/api";

import "./AlertTable.css";


function extractAlerts(payload) {

    if (Array.isArray(payload)) {
        return payload;
    }


    if (
        !payload ||
        typeof payload !== "object"
    ) {
        return [];
    }


    if (
        Array.isArray(
            payload.alerts
        )
    ) {
        return payload.alerts;
    }


    if (
        Array.isArray(
            payload.results
        )
    ) {
        return payload.results;
    }


    if (
        Array.isArray(
            payload.items
        )
    ) {
        return payload.items;
    }


    if (payload.data) {
        return extractAlerts(
            payload.data
        );
    }


    return [];
}


function formatDate(dateValue) {

    if (!dateValue) {
        return "—";
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }


    return date.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


function getRiskLevel(alert) {

    const value =
        alert.risk_level ??
        alert.risk_score ??
        "medium";


    if (
        typeof value === "number"
    ) {

        if (value >= 80) {
            return "critical";
        }

        if (value >= 60) {
            return "high";
        }

        if (value >= 40) {
            return "medium";
        }

        return "low";
    }


    const risk =
        String(value)
            .toLowerCase();


    if (
        risk.includes(
            "critical"
        )
    ) {
        return "critical";
    }


    if (
        risk.includes("high")
    ) {
        return "high";
    }


    if (
        risk.includes("low")
    ) {
        return "low";
    }


    return "medium";
}


function formatStatus(status) {

    const value =
        String(
            status || "open"
        );


    return (
        value.charAt(0)
            .toUpperCase() +
        value
            .slice(1)
            .toLowerCase()
    );
}


function AlertTable() {

    const navigate =
        useNavigate();


    const [
        alerts,
        setAlerts
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        search,
        setSearch
    ] = useState("");


    const [
        riskFilter,
        setRiskFilter
    ] = useState("all");


    const [
        statusFilter,
        setStatusFilter
    ] = useState("all");


    async function fetchAlerts() {

        setLoading(true);
        setError("");


        try {

            const response =
                await api.get(
                    "/alerts"
                );


            const extracted =
                extractAlerts(
                    response.data
                );


            setAlerts(
                extracted
            );

        } catch (err) {

            console.error(
                "Failed to fetch alerts:",
                err
            );


            setError(
                err?.response
                    ?.data
                    ?.message ||
                "Unable to load alerts"
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        fetchAlerts();

    }, []);


    const filteredAlerts =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            return alerts.filter(
                (alert) => {

                    const risk =
                        getRiskLevel(
                            alert
                        );


                    const status =
                        String(
                            alert.status ||
                            "open"
                        ).toLowerCase();


                    const transactionId =
                        alert.transaction_id ||
                        alert.transaction_reference ||
                        alert.transaction_code ||
                        "";


                    const title =
                        alert.title ||
                        alert.alert_type ||
                        alert.name ||
                        "";


                    const merchant =
                        alert.merchant ||
                        "";


                    const matchesSearch =
                        !query ||
                        String(
                            transactionId
                        )
                            .toLowerCase()
                            .includes(query) ||
                        String(
                            title
                        )
                            .toLowerCase()
                            .includes(query) ||
                        String(
                            merchant
                        )
                            .toLowerCase()
                            .includes(query);


                    const matchesRisk =
                        riskFilter ===
                            "all" ||
                        risk ===
                            riskFilter;


                    const matchesStatus =
                        statusFilter ===
                            "all" ||
                        status ===
                            statusFilter;


                    return (
                        matchesSearch &&
                        matchesRisk &&
                        matchesStatus
                    );
                }
            );

        }, [
            alerts,
            search,
            riskFilter,
            statusFilter
        ]);


    function investigate(
        transactionId
    ) {

        if (!transactionId) {

            setError(
                "Transaction ID is not available."
            );

            return;
        }


        navigate(
            `/ai-investigator?transactionId=${encodeURIComponent(
                transactionId
            )}`
        );
    }


    function clearFilters() {

        setSearch("");

        setRiskFilter("all");

        setStatusFilter("all");
    }


    if (loading) {

        return (

            <div className="table-message">

                <RefreshCw
                    size={17}
                    className="alerts-loading-icon"
                />

                Loading alerts...

            </div>
        );
    }


    if (error) {

        return (

            <div className="table-message error">

                <AlertTriangle
                    size={17}
                />

                <span>
                    {error}
                </span>

                <button
                    type="button"
                    onClick={
                        fetchAlerts
                    }
                >
                    Retry
                </button>

            </div>
        );
    }


    return (

        <div className="alerts-table-container">


            {/* FILTER BAR */}

            <div className="alerts-filter-bar">


                <div className="alerts-search">

                    <Search size={16} />

                    <input
                        type="text"
                        value={search}
                        onChange={
                            (event) =>
                                setSearch(
                                    event
                                        .target
                                        .value
                                )
                        }
                        placeholder="Search alert, merchant or transaction..."
                    />

                </div>


                <div className="alerts-filter">

                    <Filter size={15} />

                    <select
                        value={
                            riskFilter
                        }
                        onChange={
                            (event) =>
                                setRiskFilter(
                                    event
                                        .target
                                        .value
                                )
                        }
                    >

                        <option value="all">
                            All Risk
                        </option>

                        <option value="critical">
                            Critical
                        </option>

                        <option value="high">
                            High
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="low">
                            Low
                        </option>

                    </select>

                </div>


                <div className="alerts-filter">

                    <select
                        value={
                            statusFilter
                        }
                        onChange={
                            (event) =>
                                setStatusFilter(
                                    event
                                        .target
                                        .value
                                )
                        }
                    >

                        <option value="all">
                            All Status
                        </option>

                        <option value="open">
                            Open
                        </option>

                        <option value="investigating">
                            Investigating
                        </option>

                        <option value="resolved">
                            Resolved
                        </option>

                    </select>

                </div>


                {(
                    search ||
                    riskFilter !==
                        "all" ||
                    statusFilter !==
                        "all"
                ) && (

                    <button
                        type="button"
                        className="alerts-clear-button"
                        onClick={
                            clearFilters
                        }
                    >
                        Clear
                    </button>

                )}

            </div>



            {/* SUMMARY */}

            <div className="alerts-result-summary">

                Showing{" "}

                <strong>
                    {
                        filteredAlerts.length
                    }
                </strong>

                {" "}of{" "}

                <strong>
                    {alerts.length}
                </strong>

                {" "}alerts

            </div>



            {/* EMPTY */}

            {filteredAlerts.length ===
            0 ? (

                <div className="alerts-empty">

                    <ShieldAlertIcon />

                    <h3>
                        No alerts found
                    </h3>

                    <p>
                        Try changing your search
                        or filters.
                    </p>

                </div>

            ) : (

                <div className="alert-table-wrapper">

                    <table className="alert-table">

                        <thead>

                            <tr>

                                <th>
                                    ALERT
                                </th>

                                <th>
                                    TRANSACTION
                                </th>

                                <th>
                                    RISK
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    DETECTED
                                </th>

                                <th>
                                    ACTION
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredAlerts.map(
                                (
                                    alert,
                                    index
                                ) => {

                                    const riskLevel =
                                        getRiskLevel(
                                            alert
                                        );


                                    const transactionId =
                                        alert.transaction_id ||
                                        alert.transaction_reference ||
                                        alert.transaction_code;


                                    const alertTitle =
                                        alert.title ||
                                        alert.alert_type ||
                                        alert.name ||
                                        "High fraud risk detected";


                                    const alertCode =
                                        alert.alert_code ||
                                        alert.code ||
                                        `ALT-${String(
                                            alert.id ||
                                            index
                                        ).slice(
                                            0,
                                            8
                                        )}`;


                                    return (

                                        <tr
                                            key={
                                                alert.id ||
                                                index
                                            }
                                        >

                                            <td>

                                                <div
                                                    className="alert-name"
                                                    title={
                                                        alertTitle
                                                    }
                                                >
                                                    {
                                                        alertTitle
                                                    }
                                                </div>


                                                <div
                                                    className="alert-id"
                                                    title={
                                                        alertCode
                                                    }
                                                >
                                                    {
                                                        alertCode
                                                    }
                                                </div>

                                            </td>


                                            <td>

                                                <span
                                                    className="transaction-id"
                                                    title={
                                                        transactionId ||
                                                        "No transaction ID"
                                                    }
                                                >
                                                    {
                                                        transactionId ||
                                                        "—"
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={`risk-badge ${riskLevel}`}
                                                >
                                                    {
                                                        riskLevel
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={`alert-status ${String(
                                                        alert.status ||
                                                        "open"
                                                    ).toLowerCase()}`}
                                                >
                                                    {formatStatus(
                                                        alert.status
                                                    )}
                                                </span>

                                            </td>


                                            <td>

                                                {formatDate(
                                                    alert.created_at ||
                                                    alert.detected_at
                                                )}

                                            </td>


                                            <td>

                                                <button
                                                    type="button"
                                                    className="alert-ai-button"
                                                    disabled={
                                                        !transactionId
                                                    }
                                                    onClick={() =>
                                                        investigate(
                                                            transactionId
                                                        )
                                                    }
                                                >

                                                    <Brain
                                                        size={14}
                                                    />

                                                    AI Investigate

                                                </button>

                                            </td>

                                        </tr>

                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}


function ShieldAlertIcon() {

    return (
        <ShieldAlert
            size={40}
        />
    );
}


export default AlertTable;