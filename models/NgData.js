const mongoose = require("mongoose");

const NgDataSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    ngword: {
      type: Array,
      default: [],
    },
    excludeword: {
      type: Array,
      default: [],
    },
    ngcategory: {
      type: Array,
      default: [],
    },
    ngasin: {
      type: Array,
      default: [],
    },
    ngbrand: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NgData", NgDataSchema);
