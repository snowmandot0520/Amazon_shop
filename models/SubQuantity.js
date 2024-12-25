const mongoose = require("mongoose");

const SubQuantitySchema = new mongoose.Schema(
  {
    _id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
    subquantity: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubQuantity", SubQuantitySchema);
