const investigationService =
    require("../services/investigation.service");

const {
    success
} = require("../utils/apiResponse");

async function list(req, res) {
    const limit = Math.min(
        Number(req.query.limit) || 50,
        100
    );

    const investigations =
        await investigationService
            .getInvestigations(limit);

    return success(
        res,
        {
            investigations
        },
        "Investigations retrieved"
    );
}

async function updateStatus(req, res) {
    const { id } = req.params;

    const {
        status,
        decision
    } = req.body;

   const allowedStatuses = [
    "open",
    "investigating",
    "resolved",
    "closed"
];

    const allowedDecisions = [
        "approved",
        "review",
        "blocked"
    ];

    if (
        !allowedStatuses.includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid investigation status"
        });
    }

    if (
        !allowedDecisions.includes(decision)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid investigation decision"
        });
    }

    const investigation =
        await investigationService
            .updateInvestigationStatus(
                id,
                status,
                decision
            );

    if (!investigation) {
        return res.status(404).json({
            success: false,
            message: "Investigation not found"
        });
    }

    return success(
        res,
        {
            investigation
        },
        "Investigation status updated"
    );
}

module.exports = {
    list,
    updateStatus
};