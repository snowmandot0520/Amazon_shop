const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    ASIN: { type: String, default: "" },
    Product: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Price", PriceSchema);
