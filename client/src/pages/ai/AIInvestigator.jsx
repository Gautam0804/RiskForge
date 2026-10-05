import { useState } from "react";

import {
    Brain,
    Search,
    ShieldAlert,
    MapPin,
    CreditCard,
    Activity,
    AlertTriangle,
    CheckCircle,
    XCircle,
    RotateCcw
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";

import "./AIInvestigator.css";


function getToken() {
    return (
        localStorage.getItem("riskforge_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken")
    );
}


function formatFactorName(name) {
    return name
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );
}


function getRiskFactors(factors) {
    if (!factors) {
        return [];
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


function RecommendationIcon({
    recommendation
}) {

    if (
        recommendation === "block"
    ) {
        return <XCircle size={24} />;
    }

    if (
        recommendation === "review"
    ) {
        return (
            <AlertTriangle
                size={24}
            />
        );
    }

    return (
        <CheckCircle
            size={24}
        />
    );
}


export default function AIInvestigator() {

    const [
        transactionId,
        setTransactionId
    ] = useState("");

    const [
        investigation,
        setInvestigation
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");


    async function handleInvestigate() {

        if (!transactionId.trim()) {

            setError(
                "Please enter a transaction ID."
            );

            return;
        }


        setLoading(true);

        setError("");

        setInvestigation(null);


        try {

            const token =
                getToken();


            if (!token) {

                throw new Error(
                    "Authentication required. Please login again."
                );
            }


            const response =
                await fetch(
                    `http://localhost:5000/api/ai-investigator/${transactionId.trim()}`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "AI investigation failed."
                );
            }


            setInvestigation(
                data.data?.investigation ||
                data.investigation
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to investigate transaction."
            );

        } finally {

            setLoading(false);
        }
    }


    function handleKeyDown(event) {

        if (
            event.key === "Enter"
        ) {
            handleInvestigate();
        }
    }


    function handleClear() {

        setTransactionId("");

        setInvestigation(null);

        setError("");
    }


    const risk =
        investigation?.risk;


    const transaction =
        investigation?.transaction;


    const recommendation =
        investigation?.recommendation;


    const reasons =
        investigation?.reasons || [];


    const riskFactors =
        getRiskFactors(
            risk?.factors
        );


    return (
        <div className="ai-investigator-page">

            <PageHeader
                title="AI Investigator"
                description="Analyze suspicious transactions using RiskForge intelligence."
            />


            {/* Search Section */}

            <section className="ai-search-card">

                <div className="ai-search-label">

                    <Search
                        size={18}
                    />

                    <span>
                        Transaction ID
                    </span>

                </div>


                <div className="ai-search-row">

                    <input
                        type="text"
                        value={
                            transactionId
                        }
                        onChange={(event) =>
                            setTransactionId(
                                event.target.value
                            )
                        }
                        onKeyDown={
                            handleKeyDown
                        }
                        placeholder="Enter transaction ID..."
                        disabled={loading}
                    />


                    <button
                        className="ai-investigate-button"
                        onClick={
                            handleInvestigate
                        }
                        disabled={
                            loading ||
                            !transactionId.trim()
                        }
                    >

                        <Brain
                            size={18}
                        />

                        {loading
                            ? "Investigating..."
                            : "Investigate"
                        }

                    </button>

                </div>


                {error && (

                    <div className="ai-error">

                        <AlertTriangle
                            size={17}
                        />

                        <span>
                            {error}
                        </span>

                    </div>

                )}

            </section>


            {/* Investigation Result */}

            {investigation && (

                <div className="ai-result">

                    {/* Result Header */}

                    <section className="ai-result-header">

                        <div>

                            <div className="ai-result-label">
                                INVESTIGATION RESULT
                            </div>

                            <h2>
                                {transaction?.merchant ||
                                    "Unknown Merchant"}
                            </h2>

                            <p>
                                Transaction ID:{" "}
                                <span>
                                    {
                                        investigation.transactionId
                                    }
                                </span>
                            </p>

                        </div>


                        <button
                            className="ai-clear-button"
                            onClick={
                                handleClear
                            }
                        >

                            <RotateCcw
                                size={16}
                            />

                            Clear

                        </button>

                    </section>


                    {/* Transaction Information */}

                    <section className="ai-transaction-grid">

                        <div className="ai-info-card">

                            <CreditCard
                                size={20}
                            />

                            <span>
                                AMOUNT
                            </span>

                            <strong>
                                {Number(
                                    transaction?.amount || 0
                                ).toFixed(2)}{" "}
                                {transaction?.currency ||
                                    "INR"}
                            </strong>

                        </div>


                        <div className="ai-info-card">

                            <MapPin
                                size={20}
                            />

                            <span>
                                LOCATION
                            </span>

                            <strong>
                                {
                                    transaction?.location ||
                                    "Unknown"
                                }
                            </strong>

                        </div>


                        <div className="ai-info-card">

                            <Activity
                                size={20}
                            />

                            <span>
                                TRANSACTION TYPE
                            </span>

                            <strong>
                                {
                                    transaction?.transactionType ||
                                    "Unknown"
                                }
                            </strong>

                        </div>


                        <div
                            className={`ai-info-card risk-${risk?.level}`}
                        >

                            <ShieldAlert
                                size={20}
                            />

                            <span>
                                RISK LEVEL
                            </span>

                            <strong>
                                {risk?.level ||
                                    "Unknown"}
                            </strong>

                        </div>

                    </section>


                    {/* Risk Analysis */}

                    <section className="ai-analysis-card">

                        <div className="ai-section-heading">

                            <div>

                                <h3>
                                    Risk Analysis
                                </h3>

                                <p>
                                    RiskForge engine assessment
                                </p>

                            </div>

                            <ShieldAlert
                                size={22}
                            />

                        </div>


                        <div className="ai-risk-grid">

                            {/* Risk Score */}

                            <div className="ai-risk-box">

                                <span>
                                    Risk Score
                                </span>

                                <strong>
                                    {
                                        risk?.score ??
                                        0
                                    }
                                </strong>

                                <div className="ai-progress">

                                    <div
                                        style={{
                                            width: `${Math.min(
                                                Number(
                                                    risk?.score || 0
                                                ),
                                                100
                                            )}%`
                                        }}
                                    />

                                </div>

                            </div>


                            {/* Fraud Probability */}

                            <div className="ai-risk-box">

                                <span>
                                    Fraud Probability
                                </span>

                                <strong>
                                    {(
                                        Number(
                                            risk?.fraudProbability ||
                                            0
                                        ) * 100
                                    ).toFixed(1)}
                                    %
                                </strong>

                                <div className="ai-progress">

                                    <div
                                        style={{
                                            width: `${
                                                Number(
                                                    risk?.fraudProbability ||
                                                    0
                                                ) * 100
                                            }%`
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* AI Analysis */}

                    <section className="ai-intelligence-card">

                        <div className="ai-section-heading">

                            <div>

                                <h3>
                                    AI Analysis
                                </h3>

                                <p>
                                    Automated transaction investigation
                                </p>

                            </div>

                            <Brain
                                size={23}
                            />

                        </div>


                        <div className="ai-summary">

                            <div className="ai-summary-icon">

                                <Brain
                                    size={22}
                                />

                            </div>

                            <div>

                                <span>
                                    Investigation Summary
                                </span>

                                <p>
                                    {
                                        investigation.summary ||
                                        "No additional analysis available."
                                    }
                                </p>

                            </div>

                        </div>


                        {/* Recommendation */}

                        <div
                            className={`ai-recommendation recommendation-${recommendation}`}
                        >

                            <div className="recommendation-icon">

                                <RecommendationIcon
                                    recommendation={
                                        recommendation
                                    }
                                />

                            </div>


                            <div>

                                <span>
                                    AI Recommendation
                                </span>

                                <strong>
                                    {
                                        recommendation
                                            ?.toUpperCase() ||
                                        "REVIEW"
                                    }
                                </strong>

                                <p>

                                    {recommendation ===
                                        "block" &&
                                        "Transaction should be blocked for further fraud investigation."
                                    }

                                    {recommendation ===
                                        "review" &&
                                        "Transaction requires manual review by a fraud analyst."
                                    }

                                    {recommendation ===
                                        "approve" &&
                                        "Transaction does not show significant risk indicators."
                                    }

                                </p>

                            </div>

                        </div>

                    </section>


                    {/* Risk Reasons */}

                    <section className="ai-reasons-card">

                        <div className="ai-section-heading">

                            <div>

                                <h3>
                                    Risk Indicators
                                </h3>

                                <p>
                                    Factors identified during investigation
                                </p>

                            </div>

                            <AlertTriangle
                                size={22}
                            />

                        </div>


                        <div className="ai-reasons-list">

                            {reasons.length > 0 ? (

                                reasons.map(
                                    (
                                        reason,
                                        index
                                    ) => (

                                        <div
                                            className="ai-reason"
                                            key={index}
                                        >

                                            <AlertTriangle
                                                size={17}
                                            />

                                            <span>
                                                {reason}
                                            </span>

                                        </div>

                                    )
                                )

                            ) : (

                                <div className="ai-no-data">

                                    No significant
                                    risk indicators
                                    detected.

                                </div>

                            )}

                        </div>

                    </section>


                    {/* Risk Factors */}

                    {riskFactors.length > 0 && (

                        <section className="ai-factors-card">

                            <div className="ai-section-heading">

                                <div>

                                    <h3>
                                        Risk Factors
                                    </h3>

                                    <p>
                                        Detailed risk contribution
                                    </p>

                                </div>

                                <Activity
                                    size={22}
                                />

                            </div>


                            <div className="ai-factors-grid">

                                {riskFactors.map(
                                    (
                                        factor,
                                        index
                                    ) => (

                                        <div
                                            className="ai-factor"
                                            key={index}
                                        >

                                            <div className="ai-factor-top">

                                                <strong>
                                                    {formatFactorName(
                                                        factor.name
                                                    )}
                                                </strong>

                                                <span>
                                                    {factor.score}
                                                </span>

                                            </div>


                                            <div className="ai-factor-progress">

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

                        </section>

                    )}

                </div>

            )}

        </div>
    );
}