const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    limitAmount: {
      type: Number,
      required: true,
      min: [0.01, "Limit amount must be greater than zero"],
    },
    month: {
      type: Number,
      required: true,
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },
    year: {
      type: Number,
      required: true,
      min: [2000, "Year must be a valid year"],
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

budgetSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Budget", budgetSchema);
