const calculateEmergencyFund = async (req, res) => {
  try {
    const { monthlyExpenses, months, currentSavings } = req.body;

    if (
      monthlyExpenses === undefined ||
      months === undefined ||
      currentSavings === undefined
    ) {
      return res.status(400).json({
        message: "Please provide monthly expenses, months, and current savings",
      });
    }

    if (
      monthlyExpenses < 0 ||
      months <= 0 ||
      currentSavings < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid positive values",
      });
    }

    const recommendedFund = monthlyExpenses * months;
    const savingsGap = Math.max(recommendedFund - currentSavings, 0);

    res.status(200).json({
      monthlyExpenses,
      months,
      currentSavings,
      recommendedFund,
      savingsGap,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { calculateEmergencyFund };