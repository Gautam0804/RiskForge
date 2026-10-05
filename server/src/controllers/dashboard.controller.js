const dashboardService = require("../services/dashboard/dashboard.service");

async function overview(req, res) {
    try {
        const userId = req.user.sub;

        console.log("DASHBOARD USER ID:", userId);

        const data = await dashboardService.getDashboardOverview(userId);

        console.log("DASHBOARD RESULT:", data);

        return res.status(200).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            data
        });
    } catch (error) {
        console.error("Dashboard controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve dashboard data"
        });
    }
}

module.exports = {
    overview
};