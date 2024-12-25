const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    mainCategory: String,
    mainCategoryName: String,
    middleCategory: String,
    middleCategoryName: String,
    subCategory: String,
    subCategoryName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
