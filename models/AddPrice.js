const mongoose = require("mongoose");

const AddPriceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    bene_rate: { type: Number, default: 0 },
    odds_amount: { type: Number, default: 0 },
    price_scale: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Addprice", AddPriceSchema);
