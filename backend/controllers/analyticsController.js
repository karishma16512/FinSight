const Transaction = require("../models/Transaction");

const getMonthlyAnalytics = async (req, res) => {
  try {
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    if (!Number.isInteger(year) || year < 2000) {
      return res.status(400).json({
        message: "Year must be a valid number",
      });
    }

    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          date: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const map = new Map();
    monthlyData.forEach((item) => {
      map.set(item._id.month, {
        month: item._id.month,
        income: item.income,
        expenses: item.expenses,
        savings: item.income - item.expenses,
      });
    });

    const result = [];
    for (let month = 1; month <= 12; month += 1) {
      const item = map.get(month) || {
        month,
        income: 0,
        expenses: 0,
        savings: 0,
      };
      result.push(item);
    }

    res.status(200).json({
      year,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getCategoryAnalytics = async (req, res) => {
  try {
    const month = req.query.month ? Number(req.query.month) : undefined;
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    if (month !== undefined && (!Number.isInteger(month) || month < 1 || month > 12)) {
      return res.status(400).json({
        message: "Month must be between 1 and 12",
      });
    }

    if (!Number.isInteger(year) || year < 2000) {
      return res.status(400).json({
        message: "Year must be a valid number",
      });
    }

    const match = {
      user: req.user.id,
      type: "expense",
      date: {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    };

    if (month !== undefined) {
      const startMonth = String(month).padStart(2, "0");
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const startDate = new Date(`${year}-${startMonth}-01T00:00:00.000Z`);
      const endDate = new Date(`${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00.000Z`);

      match.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const data = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
      { $sort: { total: -1, category: 1 } },
    ]);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getSavingsTrendAnalytics = async (req, res) => {
  try {
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    if (!Number.isInteger(year) || year < 2000) {
      return res.status(400).json({
        message: "Year must be a valid number",
      });
    }

    const data = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          date: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          income: 1,
          expenses: 1,
          savings: { $subtract: ["$income", "$expenses"] },
        },
      },
      { $sort: { month: 1 } },
    ]);

    const monthMap = new Map(data.map((item) => [item.month, item]));
    let cumulativeSavings = 0;
    const chartData = [];

    for (let month = 1; month <= 12; month += 1) {
      const item = monthMap.get(month) || {
        month,
        income: 0,
        expenses: 0,
        savings: 0,
      };

      cumulativeSavings += item.savings;

      chartData.push({
        month,
        income: item.income,
        expenses: item.expenses,
        savings: item.savings,
        cumulativeSavings,
      });
    }

    res.status(200).json({
      year,
      data: chartData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getMonthlyAnalytics,
  getCategoryAnalytics,
  getSavingsTrendAnalytics,
};
