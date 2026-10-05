from fastapi import FastAPI
from pydantic import BaseModel, Field


app = FastAPI(
    title="RiskForge ML Service",
    version="1.0.0"
)


# =========================================
# REQUEST MODEL
# =========================================

class FraudPredictionRequest(BaseModel):

    amount: float = Field(
        ...,
        ge=0
    )

    risk_score: float = Field(
        ...,
        ge=0,
        le=100
    )

    transaction_type: str = "purchase"

    location_city: str = ""

    merchant: str = ""

    fraud_probability: float = Field(
        0,
        ge=0,
        le=1
    )

    risk_factors: dict = {}


# =========================================
# HEALTH
# =========================================

@app.get("/health")
def health():

    return {
        "success": True,
        "service": "RiskForge ML Service",
        "status": "healthy"
    }


# =========================================
# FRAUD PREDICTION
# =========================================

@app.post("/predict")
def predict_fraud(
    request: FraudPredictionRequest
):

    risk_score = request.risk_score

    fraud_probability = (
        request.fraud_probability
    )

    risk_factors = request.risk_factors

    # -------------------------------------
    # Calculate factor contribution
    # -------------------------------------

    factor_score = 0

    for factor in risk_factors.values():

        if isinstance(factor, dict):

            score = factor.get(
                "score",
                0
            )

            try:
                factor_score += float(
                    score
                )

            except (
                ValueError,
                TypeError
            ):
                pass

    # -------------------------------------
    # Combine existing risk information
    # -------------------------------------

    calculated_score = min(
        100,
        (
            risk_score * 0.60
            + fraud_probability * 100 * 0.25
            + min(factor_score, 100) * 0.15
        )
    )

    # -------------------------------------
    # Determine risk level
    # -------------------------------------

    if calculated_score >= 80:

        risk_level = "critical"

    elif calculated_score >= 60:

        risk_level = "high"

    elif calculated_score >= 40:

        risk_level = "medium"

    else:

        risk_level = "low"

    # -------------------------------------
    # Determine recommendation
    # -------------------------------------

    if calculated_score >= 80:

        recommendation = "block"

    elif calculated_score >= 50:

        recommendation = "review"

    else:

        recommendation = "approve"

    # -------------------------------------
    # Generate explanation
    # -------------------------------------

    reasons = []

    if request.amount >= 50000:

        reasons.append(
            "Transaction amount is unusually high."
        )

    if fraud_probability >= 0.70:

        reasons.append(
            "Fraud probability is elevated."
        )

    if risk_score >= 70:

        reasons.append(
            "Risk engine score is high."
        )

    if factor_score >= 30:

        reasons.append(
            "Multiple risk factors contribute to the transaction risk."
        )

    if not reasons:

        reasons.append(
            "No significant risk indicators detected."
        )

    # -------------------------------------
    # Response
    # -------------------------------------

    return {

        "success": True,

        "prediction": {

            "fraud_probability": round(
                calculated_score / 100,
                4
            ),

            "risk_score": round(
                calculated_score,
                2
            ),

            "risk_level": risk_level,

            "recommendation":
                recommendation,

            "reasons": reasons

        },

        "model": {

            "name":
                "RiskForge Fraud Risk Engine",

            "version":
                "1.0.0",

            "type":
                "risk-analysis"

        }

    }