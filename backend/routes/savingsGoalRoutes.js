const express = require("express");

const {
  createSavingsGoal,
  getSavingsGoals,
  getSavingsGoalById,
  updateSavingsGoal,
  contributeToSavingsGoal,
  deleteSavingsGoal,
} = require("../controllers/savingsGoalController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createSavingsGoal);
router.get("/", protect, getSavingsGoals);
router.get("/:id", protect, getSavingsGoalById);
router.put("/:id", protect, updateSavingsGoal);
router.patch("/:id/contribute", protect, contributeToSavingsGoal);
router.delete("/:id", protect, deleteSavingsGoal);

module.exports = router;
