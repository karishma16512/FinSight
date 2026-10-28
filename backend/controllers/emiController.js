const calculateEMI = async (req, res) => {
  try {
    const { loanAmount, annualInterestRate, tenureMonths } = req.body;

    if (
      loanAmount === undefined ||
      annualInterestRate === undefined ||
      tenureMonths === undefined
    ) {
      return res.status(400).json({
        message: "Please provide loan amount, interest rate, and tenure",
      });
    }

    if (
      loanAmount <= 0 ||
      annualInterestRate < 0 ||
      tenureMonths <= 0
    ) {
      return res.status(400).json({
        message: "Please provide valid loan details",
      });
    }

    const monthlyInterestRate = annualInterestRate / 12 / 100;

    let monthlyEMI;

    if (monthlyInterestRate === 0) {
      monthlyEMI = loanAmount / tenureMonths;
    } else {
      monthlyEMI =
        (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, tenureMonths)) /
        (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
    }

    const totalPayment = monthlyEMI * tenureMonths;
    const totalInterest = totalPayment - loanAmount;

    res.status(200).json({
      loanAmount,
      annualInterestRate,
      tenureMonths,
      monthlyEMI: Number(monthlyEMI.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { calculateEMI };