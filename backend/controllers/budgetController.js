const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const createBudget = async (req, res) => {
  try {
    const { category, limitAmount, month, year } = req.body;

    if (!category || limitAmount === undefined || month === undefined || year === undefined) {
      return res.status(400).json({
        message: "Please provide category, limitAmount, month, and year",
      });
    }

    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    const parsedLimitAmount = Number(limitAmount);
    if (!Number.isFinite(parsedLimitAmount) || parsedLimitAmount <= 0) {
      return res.status(400).json({
        message: "Limit amount must be a number greater than zero",
      });
    }

    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({
        message: "Month must be a number between 1 and 12",
      });
    }

    if (!Number.isInteger(parsedYear) || parsedYear < 2000) {
      return res.status(400).json({
        message: "Year must be a valid number",
      });
    }

    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category: category.trim(),
      month: parsedMonth,
      year: parsedYear,
    });

    if (existingBudget) {
      return res.status(409).json({
        message: "Budget for this category, month, and year already exists",
      });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category: category.trim(),
      limitAmount: parsedLimitAmount,
      month: parsedMonth,
      year: parsedYear,
    });

    res.status(201).json({
      message: "Budget created successfully",
      budget: await buildBudgetResponse(budget, req.user.id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;

    const filter = { user: req.user.id };
    if (month !== undefined) {
      const parsedMonth = Number(month);
      if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
        return res.status(400).json({
          message: "Month must be between 1 and 12",
        });
      }
      filter.month = parsedMonth;
    }

    if (year !== undefined) {
      const parsedYear = Number(year);
      if (!Number.isInteger(parsedYear) || parsedYear < 2000) {
        return res.status(400).json({
          message: "Year must be a valid number",
        });
      }
      filter.year = parsedYear;
    }

    const budgets = await Budget.find(filter).sort({ year: -1, month: -1, category: 1 });

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => buildBudgetResponse(budget, req.user.id))
    );

    res.status(200).json(budgetsWithSpending);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    const budgetResponse = await buildBudgetResponse(budget, req.user.id);
    res.status(200).json(budgetResponse);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid budget id",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { category, limitAmount, month, year } = req.body;

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    if (category !== undefined) {
      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
          message: "Category is required",
        });
      }
      budget.category = category.trim();
    }

    if (limitAmount !== undefined) {
      const parsedLimitAmount = Number(limitAmount);
      if (!Number.isFinite(parsedLimitAmount) || parsedLimitAmount <= 0) {
        return res.status(400).json({
          message: "Limit amount must be a number greater than zero",
        });
      }
      budget.limitAmount = parsedLimitAmount;
    }

    if (month !== undefined) {
      const parsedMonth = Number(month);
      if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
        return res.status(400).json({
          message: "Month must be between 1 and 12",
        });
      }
      budget.month = parsedMonth;
    }

    if (year !== undefined) {
      const parsedYear = Number(year);
      if (!Number.isInteger(parsedYear) || parsedYear < 2000) {
        return res.status(400).json({
          message: "Year must be a valid number",
        });
      }
      budget.year = parsedYear;
    }

    const duplicateBudget = await Budget.findOne({
      user: req.user.id,
      category: budget.category,
      month: budget.month,
      year: budget.year,
      _id: { $ne: req.params.id },
    });

    if (duplicateBudget) {
      return res.status(409).json({
        message: "Budget for this category, month, and year already exists",
      });
    }

    const updatedBudget = await budget.save();

    res.status(200).json({
      message: "Budget updated successfully",
      budget: await buildBudgetResponse(updatedBudget, req.user.id),
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid budget id",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid budget id",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const buildBudgetResponse = async (budget, userId) => {
  const start = new Date(budget.year, budget.month - 1, 1);
  const end = new Date(budget.year, budget.month, 0, 23, 59, 59, 999);

  const expenses = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        category: budget.category,
        date: {
          $gte: start,
          $lt: end,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const spentAmount = expenses[0] ? expenses[0].total : 0;
  const remainingAmount = budget.limitAmount - spentAmount;
  const percentageUsed = budget.limitAmount > 0 ? (spentAmount / budget.limitAmount) * 100 : 0;

  return {
    _id: budget._id,
    user: budget.user,
    category: budget.category,
    limitAmount: budget.limitAmount,
    month: budget.month,
    year: budget.year,
    spentAmount,
    remainingAmount,
    percentageUsed: Number(percentageUsed.toFixed(2)),
    isExceeded: spentAmount > budget.limitAmount,
    createdAt: budget.createdAt,
    updatedAt: budget.updatedAt,
  };
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
};
