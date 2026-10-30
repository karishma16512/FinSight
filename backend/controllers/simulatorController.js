const simulateFinancialScenario = async (req, res) => {
  try {
    const {
      monthlyIncome,
      monthlyExpenses,
      incomeChange,
      expenseChange,
      months,
      currentSavings,
    } = req.body;

    if (
      monthlyIncome === undefined ||
      monthlyExpenses === undefined ||
      incomeChange === undefined ||
      expenseChange === undefined ||
      months === undefined ||
      currentSavings === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required financial details",
      });
    }

    if (
      monthlyIncome < 0 ||
      monthlyExpenses < 0 ||
      months <= 0 ||
      currentSavings < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid financial values",
      });
    }

    const adjustedMonthlyIncome = monthlyIncome + incomeChange;
    const adjustedMonthlyExpenses = monthlyExpenses + expenseChange;

    if (adjustedMonthlyIncome < 0 || adjustedMonthlyExpenses < 0) {
      return res.status(400).json({
        message: "Projected income and expenses cannot be negative",
      });
    }

    const currentMonthlySavings = monthlyIncome - monthlyExpenses;
    const projectedMonthlySavings = adjustedMonthlyIncome - adjustedMonthlyExpenses;

    const projectionData = [];
    let runningTotal = currentSavings;

    for (let i = 1; i <= months; i += 1) {
      runningTotal += projectedMonthlySavings;
      projectionData.push({
        month: i,
        startingSavings: runningTotal - projectedMonthlySavings,
        projectedIncome: adjustedMonthlyIncome,
        projectedExpenses: adjustedMonthlyExpenses,
        projectedMonthlySavings,
        totalSavings: runningTotal,
      });
    }

    const projectedTotalSavings = currentSavings + projectedMonthlySavings * months;

    res.status(200).json({
      currentMonthlyIncome: monthlyIncome,
      currentMonthlyExpenses: monthlyExpenses,
      currentMonthlySavings,
      adjustedMonthlyIncome,
      adjustedMonthlyExpenses,
      projectedMonthlyIncome: adjustedMonthlyIncome,
      projectedMonthlyExpenses: adjustedMonthlyExpenses,
      monthlySavings: projectedMonthlySavings,
      projectedMonthlySavings,
      currentSavings,
      months,
      projectedSavings: projectedTotalSavings,
      projectedTotalSavings,
      projectionData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { simulateFinancialScenario };