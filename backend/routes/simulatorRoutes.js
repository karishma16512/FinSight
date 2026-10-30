const express = require("express");

const {
  simulateFinancialScenario,
} = require("../controllers/simulatorController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, simulateFinancialScenario);

module.exports = router;