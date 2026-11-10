const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const emergencyFundRoutes = require("./routes/emergencyFundRoutes");
const emiRoutes = require("./routes/emiRoutes");
const simulatorRoutes = require("./routes/simulatorRoutes");
const savingsGoalRoutes = require("./routes/savingsGoalRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/emergency-fund", emergencyFundRoutes);
app.use("/api/emi", emiRoutes);
app.use("/api/simulator", simulatorRoutes);
app.use("/api/savings-goals", savingsGoalRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("FinSight Backend is Running!");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing. Add a secret value to backend/.env.");
  }
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Unable to start FinSight backend:", error.message);
  process.exitCode = 1;
});