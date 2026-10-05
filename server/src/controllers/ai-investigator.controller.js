const {
    success
} = require("../utils/apiResponse");

const transactionService =
    require("../services/transaction.service");

const {
    predictFraud
} = require("../services/ml.service");


/*
|--------------------------------------------------------------------------
| AI INVESTIGATOR
|--------------------------------------------------------------------------
*/

async function investigate(req, res) {

    const {
        transactionId
    } = req.params;


    /*
     * JWT user ID is stored
     * inside the `sub` claim.
     */
    const userId =
        req.user.sub;


    /*
     * Get transaction.
     *
     * getTransactionById now accepts
     * both transaction_id and internal id.
     */
    const transaction =
        await transactionService
            .getTransactionById(
                userId,
                transactionId
            );


    /*
     * Send transaction to
     * Python ML service.
     */
    const prediction =
        await predictFraud(
            transaction
        );


    /*
     * Build AI investigation response.
     */
    const investigation = {

        transactionId:
            transaction.transaction_id,

        transaction: {

            merchant:
                transaction.merchant,

            amount:
                transaction.amount,

            currency:
                transaction.currency,

            location:
                transaction.location_city,

            transactionType:
                transaction.transaction_type
        },


        risk: {

            score:
                prediction.risk_score,

            level:
                prediction.risk_level,

            fraudProbability:
                prediction.fraud_probability,

            factors:
                transaction.risk_factors || {}
        },


        recommendation:
            prediction.recommendation,


        reasons:
            prediction.reasons || [],


        summary:
            prediction.reasons?.join(" ") ||
            "No additional risk analysis available."
    };


    /*
     * Return response
     */
    return success(
        res,
        {
            investigation
        },
        "AI investigation completed"
    );
}


module.exports = {
    investigate
};