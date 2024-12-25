const mongoose = require("mongoose");

const AmazonCategorySchema = new mongoose.Schema(
  {
    categoryContent: String,
    qoo10category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ACategory", AmazonCategorySchema);
