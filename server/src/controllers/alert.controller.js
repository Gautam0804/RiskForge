const alertService =
    require("../services/alert.service");

const {
    success
} = require("../utils/apiResponse");

async function list(req, res) {
    const limit =
        Math.min(
            Number(req.query.limit) || 50,
            100
        );

    const alerts =
        await alertService.getAlerts(
            limit
        );

    return success(
        res,
        { alerts },
        "Alerts retrieved"
    );
}

module.exports = {
    list
};