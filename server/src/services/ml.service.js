const ML_SERVICE_URL =
    process.env.ML_SERVICE_URL ||
    "http://localhost:8000";


async function predictFraud(transaction) {

    const response =
        await fetch(
            `${ML_SERVICE_URL}/predict`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        amount:
                            Number(
                                transaction.amount || 0
                            ),

                        risk_score:
                            Number(
                                transaction.risk_score || 0
                            ),

                        transaction_type:
                            transaction.transaction_type ||
                            "purchase",

                        location_city:
                            transaction.location_city ||
                            "",

                        merchant:
                            transaction.merchant ||
                            "",

                        fraud_probability:
                            Number(
                                transaction.fraud_probability ||
                                0
                            ),

                        risk_factors:
                            transaction.risk_factors ||
                            {}
                    })
            }
        );


    const result =
        await response.json();


    if (
        !response.ok ||
        !result.success
    ) {

        throw new Error(
            result.message ||
            "ML service prediction failed"
        );
    }


    return result.prediction;
}


module.exports = {
    predictFraud
};