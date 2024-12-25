const mongoose = require("mongoose");

const LoadSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    mainInfo: {
      type: Number,
      default: 0,
    },

    categoryInfo: {
      type: Number,
      default: 0,
    },
    priceInfo: {
      type: Number,
      default: 0,
    },
    length: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoadState", LoadSchema);
