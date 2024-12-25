const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    asin: String,
    userId: String,
    title: String,
    SecondSubCat: String,
    qoo10CategoryName: String,
    amaparentCat: String,
    amaCat: String,
    ItemCode: String,
    img: Array,
    qoo10_img: String,
    description: String,
    price: { type: Number, default: 0 },
    qoo10_price: { type: Number, default: 0 },
    transport_fee: { type: Number, default: 0 },
    AdultYN: { type: Boolean, default: false },
    predictableIncome: Number,
    bullet_point: Array,
    item_dimensions: Array,
    brand: String,
    part_number: String,
    manufacturer: String,
    releaseDate: String,
    ItemStatus: String,
    package: Object,
    selledQuantity: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    bene_rate: { type: Number, default: 0 },
    odds_amount: { type: Number, default: 0 },
    qoo10_quantity: { type: Number, default: 0 },
    status: { type: String, default: "新規追加" },
    ngRecheckedState: String,
    language: { type: String, default: "en" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
