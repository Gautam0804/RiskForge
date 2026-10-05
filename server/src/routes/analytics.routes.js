const express = require("express");

const {
  getAnalyticsSummary,
} = require("../controllers/analytics.controller");

const {
  authenticate,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/summary",
  authenticate,
  getAnalyticsSummary
);

module.exports = router;