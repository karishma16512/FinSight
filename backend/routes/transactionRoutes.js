const express = require("express");

const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getDashboardSummary,
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Dashboard summary
router.get("/summary", protect, getDashboardSummary);

// Transaction CRUD
router.post("/", protect, addTransaction);
router.get("/", protect, getTransactions);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

module.exports = router;