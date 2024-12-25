const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    user_id: {
      type: String,
      default: "",
    },
    subscriptionid: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
