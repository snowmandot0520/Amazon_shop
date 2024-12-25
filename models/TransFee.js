const mongoose = require("mongoose");

const TransFeeSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    transfee_1: { type: String, default: "" },
    transfee_2: { type: String, default: "" },
    transfee_3: { type: String, default: "" },
    transfee_4: { type: String, default: "" },
    transfee_5: { type: String, default: "" },
    transfee_6: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransFee", TransFeeSchema);
