const express = require("express");
const router = express.Router();
const {
  setNewGoods,
  getQoo10Category,
  deleteProductOfQoo10Mydb,
} = require("../controller/qoo10ProductManage");

router.post("/exhibit", setNewGoods);
router.get("/category", getQoo10Category);
router.post("/", deleteProductOfQoo10Mydb);

module.exports = router;
