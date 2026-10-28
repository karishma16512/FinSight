const SavingsGoal = require("../models/SavingsGoal");

const createSavingsGoal = async (req, res) => {
  try {
    const { goalName, targetAmount, currentAmount, targetDate } = req.body;

    if (!goalName || !targetAmount || !targetDate) {
      return res.status(400).json({
        message: "Please provide goalName, targetAmount, and targetDate",
      });
    }

    if (typeof goalName !== "string" || !goalName.trim()) {
      return res.status(400).json({
        message: "Goal name is required",
      });
    }

    const parsedTargetAmount = Number(targetAmount);
    if (!Number.isFinite(parsedTargetAmount) || parsedTargetAmount <= 0) {
      return res.status(400).json({
        message: "Target amount must be a number greater than zero",
      });
    }

    const parsedCurrentAmount = currentAmount === undefined ? 0 : Number(currentAmount);
    if (!Number.isFinite(parsedCurrentAmount) || parsedCurrentAmount < 0) {
      return res.status(400).json({
        message: "Current amount cannot be negative",
      });
    }

    if (parsedCurrentAmount > parsedTargetAmount) {
      return res.status(400).json({
        message: "Current amount cannot exceed target amount",
      });
    }

    const parsedTargetDate = new Date(targetDate);
    if (Number.isNaN(parsedTargetDate.getTime())) {
      return res.status(400).json({
        message: "Target date is invalid",
      });
    }

    const goal = await SavingsGoal.create({
      user: req.user.id,
      goalName: goalName.trim(),
      targetAmount: parsedTargetAmount,
      currentAmount: parsedCurrentAmount,
      targetDate: parsedTargetDate,
    });

    const responseGoal = buildSavingsGoalResponse(goal);

    res.status(201).json({
      message: "Savings goal created successfully",
      goal: responseGoal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user.id }).sort({ createdAt: -1 });

    const formattedGoals = goals.map((goal) => buildSavingsGoalResponse(goal));

    res.status(200).json(formattedGoals);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getSavingsGoalById = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    res.status(200).json(buildSavingsGoalResponse(goal));
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid savings goal id",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateSavingsGoal = async (req, res) => {
  try {
    const { goalName, targetAmount, currentAmount, targetDate } = req.body;

    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    if (goalName !== undefined) {
      if (typeof goalName !== "string" || !goalName.trim()) {
        return res.status(400).json({
          message: "Goal name cannot be empty",
        });
      }
      goal.goalName = goalName.trim();
    }

    if (targetAmount !== undefined) {
      const parsedTargetAmount = Number(targetAmount);
      if (!Number.isFinite(parsedTargetAmount) || parsedTargetAmount <= 0) {
        return res.status(400).json({
          message: "Target amount must be a number greater than zero",
        });
      }
      goal.targetAmount = parsedTargetAmount;
    }

    if (currentAmount !== undefined) {
      const parsedCurrentAmount = Number(currentAmount);
      if (!Number.isFinite(parsedCurrentAmount) || parsedCurrentAmount < 0) {
        return res.status(400).json({
          message: "Current amount cannot be negative",
        });
      }
      goal.currentAmount = parsedCurrentAmount;
    }

    if (targetDate !== undefined) {
      const parsedTargetDate = new Date(targetDate);
      if (Number.isNaN(parsedTargetDate.getTime())) {
        return res.status(400).json({
          message: "Target date is invalid",
        });
      }
      goal.targetDate = parsedTargetDate;
    }

    if (goal.currentAmount > goal.targetAmount) {
      return res.status(400).json({
        message: "Current amount cannot exceed target amount",
      });
    }

    const updatedGoal = await goal.save();

    res.status(200).json({
      message: "Savings goal updated successfully",
      goal: buildSavingsGoalResponse(updatedGoal),
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid savings goal id",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const contributeToSavingsGoal = async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount === undefined) {
      return res.status(400).json({
        message: "Please provide contribution amount",
      });
    }

    const contributionAmount = Number(amount);
    if (!Number.isFinite(contributionAmount) || contributionAmount <= 0) {
      return res.status(400).json({
        message: "Contribution amount must be a positive number",
      });
    }

    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    const newAmount = goal.currentAmount + contributionAmount;

    if (newAmount > goal.targetAmount) {
      return res.status(400).json({
        message: "Contribution would exceed the target amount",
      });
    }

    goal.currentAmount = newAmount;
    const updatedGoal = await goal.save();

    res.status(200).json({
      message: "Contribution added successfully",
      goal: buildSavingsGoalResponse(updatedGoal),
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid savings goal id",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    res.status(200).json({
      message: "Savings goal deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid savings goal id",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const buildSavingsGoalResponse = (goal) => {
  const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const progressPercentage = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100
  );

  return {
    _id: goal._id,
    user: goal.user,
    goalName: goal.goalName,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    remainingAmount,
    progressPercentage: Number(progressPercentage.toFixed(2)),
    targetDate: goal.targetDate,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
};

module.exports = {
  createSavingsGoal,
  getSavingsGoals,
  getSavingsGoalById,
  updateSavingsGoal,
  contributeToSavingsGoal,
  deleteSavingsGoal,
};
