import { useState } from "react";
import api from "../../services/api";

import { useNavigate } from "react-router-dom";

import {

    Search,

    ShieldAlert,

    CheckCircle,

    XCircle,

    Clock,

    MapPin,

    CreditCard,

    Activity,

    Brain

} from "lucide-react";

import "./InvestigationPanel.css";

/*

|--------------------------------------------------------------------------

| Risk Factors

|--------------------------------------------------------------------------

*/

function getRiskFactors(factors) {

    if (!factors) {

        return [];

    }

    if (typeof factors === "string") {

        try {

            factors = JSON.parse(factors);

        } catch {

            return [];

        }

    }

    return Object.entries(factors).map(

        ([name, value]) => {

            if (

                value &&

                typeof value === "object"

            ) {

                return {

                    name,

                    score:

                        value.score ?? 0,

                    reason:

                        value.reason ||

                        value.description ||

                        "Risk factor detected."

                };

            }

            return {

                name,

                score:

                    Number(value) || 0,

                reason:

                    "Risk factor detected."

            };

        }

    );

}

/*

|--------------------------------------------------------------------------

| Format Risk Factor Name

|--------------------------------------------------------------------------

*/

function formatFactorName(name) {

    return name

        .replace(/\_/g, " ")

        .replace(/-/g, " ")

        .replace(

            /\b\w/g,

            (char) =>

                char.toUpperCase()

        );

}

/*

|--------------------------------------------------------------------------

| Format Amount

|--------------------------------------------------------------------------

*/

function formatAmount(

    amount,

    currency

) {

    return `${Number(

        amount || 0

    ).toFixed(2)} ${

        currency || "INR"

    }`;

}

/*

|--------------------------------------------------------------------------

| Format Date

|--------------------------------------------------------------------------

*/

function formatDate(date) {

    if (!date) {

        return "—";

    }

    try {

        return new Date(

            date

        ).toLocaleString();

    } catch {

        return date;

    }

}

/*

|--------------------------------------------------------------------------

| Investigation Panel

|--------------------------------------------------------------------------

*/

export default function InvestigationPanel({

    investigations = [],

    setInvestigations,

    loading,

    error,

    setError

}) {

    const navigate =

        useNavigate();

    const [

        updatingId,

        setUpdatingId

    ] = useState(null);

    /*

    |--------------------------------------------------------------------------

    | Update Investigation Status

    |--------------------------------------------------------------------------

    */

    async function updateStatus(

        investigation,

        status,

        decision

    ) {

        setUpdatingId(

            investigation.id

        );

        if (setError) {

            setError("");

        }

        try {

            const response = await api.patch(
                `/investigations/${investigation.id}/status`,
                { status, decision }
            );

            const data = response.data;

            const updatedInvestigation =

                data.data?.investigation ||

                data.investigation;

            /*

             * Update only the changed

             * investigation in parent state.

             */

            if (

                updatedInvestigation &&

                setInvestigations

            ) {

                setInvestigations(

                    (current) =>

                        current.map(

                            (item) =>

                                item.id ===

                                updatedInvestigation.id

                                    ? {

                                          ...item,

                                          ...updatedInvestigation

                                      }

                                    : item

                        )

                );

            }

        } catch (err) {

            if (setError) {

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to update investigation."
                );

            }

        } finally {

            setUpdatingId(null);

        }

    }

    /*

    |--------------------------------------------------------------------------

    | Open AI Investigator

    |--------------------------------------------------------------------------

    */

    function investigateWithAI(

        transactionId

    ) {

        if (!transactionId) {

            if (setError) {

                setError(

                    "Transaction ID is not available."

                );

            }

            return;

        }

        navigate(

            `/ai-investigator?transactionId=${encodeURIComponent(

                transactionId

            )}`

        );

    }

    /*

    |--------------------------------------------------------------------------

    | Loading

    |--------------------------------------------------------------------------

    */

    if (loading) {

        return (

            <div className="investigation-loading">

                <div className="loading-spinner" />

                <span>

                    Loading investigations...

                </span>

            </div>

        );

    }

    /*

    |--------------------------------------------------------------------------

    | Error

    |--------------------------------------------------------------------------

    */

    if (error) {

        return null;

    }

    /*

    |--------------------------------------------------------------------------

    | Empty State

    |--------------------------------------------------------------------------

    */

    if (

        investigations.length === 0

    ) {

        return (

            <div className="investigation-empty">

                <ShieldAlert

                    size={42}

                />

                <h3>

                    No investigations found

                </h3>

                <p>

                    Try changing your search

                    or status filter.

                </p>

            </div>

        );

    }

    /*

    |--------------------------------------------------------------------------

    | Render

    |--------------------------------------------------------------------------

    */

    return (

        <div className="investigation-panel">

            <div className="investigation-list">

                {investigations.map(

                    (item) => {

                        const riskFactors =

                            getRiskFactors(

                                item.risk_factors

                            );

                        const isClosed =

                            item.status ===

                            "closed";

                        const isUpdating =

                            updatingId ===

                            item.id;

                        return (

                            <article

                                className="investigation-card"

                                key={item.id}

                            >

                                {/* =========================================

                                    HEADER

                                ========================================= */}

                                <div className="investigation-card-header">

                                    <div>

                                        <div className="investigation-label">

                                            INVESTIGATION

                                        </div>

                                        <h3>

                                            {

                                                item.merchant ||

                                                "Unknown Merchant"

                                            }

                                        </h3>

                                        <p className="investigation-id">

                                            Investigation ID:

                                            <span>

                                                {

                                                    item.investigation_id ||

                                                    "—"

                                                }

                                            </span>

                                        </p>

                                    </div>

                                    <div

                                        className={`investigation-status status-${item.status}`}

                                    >

                                        <Clock

                                            size={14}

                                        />

                                        {

                                            item.status ||

                                            "unknown"

                                        }

                                    </div>

                                </div>

                                {/* =========================================

                                    TRANSACTION ID

                                ========================================= */}

                                <div className="investigation-transaction-id">

                                    <span>

                                        Transaction:

                                    </span>

                                    <strong>

                                        {

                                            item.transaction_id ||

                                            "—"

                                        }

                                    </strong>

                                </div>

                                {/* =========================================

                                    TRANSACTION INFORMATION

                                ========================================= */}

                                <div className="investigation-info-grid">

                                    {/* Amount */}

                                    <div className="investigation-info">

                                        <CreditCard

                                            size={18}

                                        />

                                        <span>

                                            AMOUNT

                                        </span>

                                        <strong>

                                            {formatAmount(

                                                item.amount,

                                                item.currency

                                            )}

                                        </strong>

                                    </div>

                                    {/* Location */}

                                    <div className="investigation-info">

                                        <MapPin

                                            size={18}

                                        />

                                        <span>

                                            LOCATION

                                        </span>

                                        <strong>

                                            {

                                                item.location_city ||

                                                "Unknown"

                                            }

                                        </strong>

                                    </div>

                                    {/* Transaction Type */}

                                    <div className="investigation-info">

                                        <Activity

                                            size={18}

                                        />

                                        <span>

                                            TRANSACTION TYPE

                                        </span>

                                        <strong>

                                            {

                                                item.transaction_type ||

                                                "Unknown"

                                            }

                                        </strong>

                                    </div>

                                    {/* Risk Level */}

                                    <div

                                        className={`investigation-info risk-${item.risk_level}`}

                                    >

                                        <ShieldAlert

                                            size={18}

                                        />

                                        <span>

                                            RISK LEVEL

                                        </span>

                                        <strong>

                                            {

                                                item.risk_level ||

                                                "Unknown"

                                            }

                                        </strong>

                                    </div>

                                </div>

                                {/* =========================================

                                    RISK METRICS

                                ========================================= */}

                                <div className="investigation-risk-section">

                                    {/* Risk Score */}

                                    <div className="risk-score-box">

                                        <span>

                                            RISK SCORE

                                        </span>

                                        <strong>

                                            {

                                                item.risk_score ??

                                                0

                                            }

                                        </strong>

                                    </div>

                                    {/* Fraud Probability */}

                                    <div className="risk-score-box">

                                        <span>

                                            FRAUD PROBABILITY

                                        </span>

                                        <strong>

                                            {(

                                                Number(

                                                    item.fraud_probability ||

                                                    0

                                                ) * 100

                                            ).toFixed(1)}

                                            %

                                        </strong>

                                    </div>

                                </div>

                                {/* =========================================

                                    RISK FACTORS

                                ========================================= */}

                                {riskFactors.length >

                                    0 && (

                                    <div className="investigation-factors">

                                        <div className="section-title">

                                            <h4>

                                                Risk Factors

                                            </h4>

                                        </div>

                                        <div className="risk-factor-grid">

                                            {riskFactors.map(

                                                (

                                                    factor,

                                                    index

                                                ) => (

                                                    <div

                                                        className="risk-factor"

                                                        key={`${factor.name}-${index}`}

                                                    >

                                                        <div className="risk-factor-header">

                                                            <strong>

                                                                {formatFactorName(

                                                                    factor.name

                                                                )}

                                                            </strong>

                                                            <span>

                                                                {

                                                                    factor.score

                                                                }

                                                            </span>

                                                        </div>

                                                        <div className="risk-factor-bar">

                                                            <div

                                                                style={{

                                                                    width: `${Math.min(

                                                                        Number(

                                                                            factor.score

                                                                        ) || 0,

                                                                        100

                                                                    )}%`

                                                                }}

                                                            />

                                                        </div>

                                                        <p>

                                                            {

                                                                factor.reason

                                                            }

                                                        </p>

                                                    </div>

                                                )

                                            )}

                                        </div>

                                    </div>

                                )}

                                {/* =========================================

                                    AI SUMMARY

                                ========================================= */}

                                {item.ai_summary && (

                                    <div className="investigation-ai-summary">

                                        <div className="ai-summary-header">

                                            <Brain

                                                size={17}

                                            />

                                            <strong>

                                                AI Summary

                                            </strong>

                                        </div>

                                        <p>

                                            {

                                                item.ai_summary

                                            }

                                        </p>

                                    </div>

                                )}

                                {/* =========================================

                                    DECISION

                                ========================================= */}

                                {item.decision && (

                                    <div className="investigation-decision">

                                        <span>

                                            Decision

                                        </span>

                                        <strong

                                            className={`decision-${item.decision}`}

                                        >

                                            {

                                                item.decision

                                            }

                                        </strong>

                                    </div>

                                )}

                                {/* =========================================

                                    DATE

                                ========================================= */}

                                <div className="investigation-date">

                                    Created:

                                    <span>

                                        {

                                            formatDate(

                                                item.created_at

                                            )

                                        }

                                    </span>

                                </div>

                                {/* =========================================

                                    ACTIONS

                                ========================================= */}

                                <div className="investigation-actions">

                                    {/* AI Investigate */}

                                    <button

                                        type="button"

                                        className="investigation-ai-button"

                                        onClick={() =>

                                            investigateWithAI(

                                                item.transaction_id

                                            )

                                        }

                                    >

                                        <Brain

                                            size={16}

                                        />

                                        AI Investigate

                                    </button>

                                    {/* Approve */}

                                    <button

                                        type="button"

                                        className="investigation-approve-button"

                                        disabled={

                                            isClosed ||

                                            isUpdating

                                        }

                                        onClick={() =>

                                            updateStatus(

                                                item,

                                                "resolved",

                                                "approved"

                                            )

                                        }

                                    >

                                        <CheckCircle

                                            size={16}

                                        />

                                        {

                                            isUpdating

                                                ? "Updating..."

                                                : "Approve"

                                        }

                                    </button>

                                    {/* Review */}

                                    <button

                                        type="button"

                                        className="investigation-review-button"

                                        disabled={

                                            isClosed ||

                                            isUpdating

                                        }

                                        onClick={() =>

                                            updateStatus(

                                                item,

                                                "investigating",

                                                "review"

                                            )

                                        }

                                    >

                                        <Search

                                            size={16}

                                        />

                                        Review

                                    </button>

                                    {/* Block */}

                                    <button

                                        type="button"

                                        className="investigation-block-button"

                                        disabled={

                                            isClosed ||

                                            isUpdating

                                        }

                                        onClick={() =>

                                            updateStatus(

                                                item,

                                                "closed",

                                                "blocked"

                                            )

                                        }

                                    >

                                        <XCircle

                                            size={16}

                                        />

                                        Block

                                    </button>

                                </div>

                                {/* =========================================

                                    CLOSED STATE

                                ========================================= */}

                                {isClosed && (

                                    <div className="investigation-closed">

                                        <CheckCircle

                                            size={16}

                                        />

                                        Investigation closed

                                    </div>

                                )}

                            </article>

                        );

                    }

                )}

            </div>

        </div>

    );

}
