const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalName: {
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: [0.01, "Target amount must be greater than zero"],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, "Current amount cannot be negative"],
    },
    targetDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savingsGoalSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("SavingsGoal", savingsGoalSchema);
