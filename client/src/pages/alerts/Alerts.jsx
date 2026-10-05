import { useState } from "react";

import {
    ShieldAlert,
    AlertTriangle,
    Clock,
    CheckCircle,
    RefreshCw
} from "lucide-react";

import PageHeader
    from "../../components/common/PageHeader";

import AlertTable
    from "../../components/alerts/AlertTable";

import "./Alerts.css";


export default function Alerts() {

    const [
        refreshKey,
        setRefreshKey
    ] = useState(0);

    const [
        refreshing,
        setRefreshing
    ] = useState(false);


    function refreshAlerts() {

        setRefreshing(true);

        setRefreshKey(
            (current) =>
                current + 1
        );

        setTimeout(() => {
            setRefreshing(false);
        }, 700);
    }


    return (

        <div className="alerts-page">


            {/* HEADER */}

            <div className="alerts-heading">

                <PageHeader
                    title="Alert Center"
                    description="Monitor high-risk events and suspicious activity."
                />


                <button
                    type="button"
                    className="alerts-refresh-button"
                    onClick={
                        refreshAlerts
                    }
                    disabled={
                        refreshing
                    }
                >

                    <RefreshCw
                        size={16}
                        className={
                            refreshing
                                ? "alerts-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}

                </button>

            </div>



            {/* ALERT OVERVIEW */}

            <section className="alerts-overview">


                <div className="alert-overview-card">

                    <div className="alert-overview-icon blue">

                        <ShieldAlert size={19} />

                    </div>


                    <div>

                        <span>
                            TOTAL ALERTS
                        </span>

                        <strong>
                            Live
                        </strong>

                        <small>
                            Current alert feed
                        </small>

                    </div>

                </div>


                <div className="alert-overview-card">

                    <div className="alert-overview-icon red">

                        <AlertTriangle size={19} />

                    </div>


                    <div>

                        <span>
                            HIGH RISK
                        </span>

                        <strong>
                            Active
                        </strong>

                        <small>
                            Requires attention
                        </small>

                    </div>

                </div>


                <div className="alert-overview-card">

                    <div className="alert-overview-icon yellow">

                        <Clock size={19} />

                    </div>


                    <div>

                        <span>
                            OPEN
                        </span>

                        <strong>
                            Monitoring
                        </strong>

                        <small>
                            Unresolved alerts
                        </small>

                    </div>

                </div>


                <div className="alert-overview-card">

                    <div className="alert-overview-icon green">

                        <CheckCircle size={19} />

                    </div>


                    <div>

                        <span>
                            RESPONSE
                        </span>

                        <strong>
                            Active
                        </strong>

                        <small>
                            Alert monitoring enabled
                        </small>

                    </div>

                </div>


            </section>



            {/* ALERT TABLE */}

            <div className="alerts-table-card">

                <div className="alerts-table-header">

                    <div>

                        <h2>
                            Security Alerts
                        </h2>

                        <p>
                            Review suspicious activity detected by RiskForge.
                        </p>

                    </div>


                    <div className="alerts-live-indicator">

                        <span />

                        LIVE

                    </div>

                </div>


                <AlertTable
                    key={refreshKey}
                />

            </div>

        </div>
    );
}