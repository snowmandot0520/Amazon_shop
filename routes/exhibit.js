const express = require("express");
const {
  updateAddPrice,
  getAddPrice,
  newAddPrice,
  deleteAddPrice,
  updatetransfee,
  gettransfee,
  getamount,
  updateamount,
} = require("../controller/exhibitSettingController");
const router = express.Router();

router.post("/addprice/", updateAddPrice);
router.get("/addprice/:id", getAddPrice);
router.post("/addprice/new", newAddPrice);
router.delete("/addprice/:id", deleteAddPrice);

router.get("/transfee/:id", gettransfee);
router.post("/transfee/", updatetransfee);

router.get("/subquantity/:id", getamount);
router.post("/subquantity/", updateamount);

module.exports = router;
