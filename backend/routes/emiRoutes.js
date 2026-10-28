const express = require("express");

const {
  calculateEMI,
} = require("../controllers/emiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, calculateEMI);

module.exports = router;