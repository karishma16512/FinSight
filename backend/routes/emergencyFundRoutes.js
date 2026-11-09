const express = require("express");

const {
  calculateEmergencyFund,
} = require("../controllers/emergencyFundController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, calculateEmergencyFund);

module.exports = router;