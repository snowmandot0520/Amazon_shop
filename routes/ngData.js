const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  getAllNgData,
  addNgData,
  useNgData,
  deleteNgData,
  ngfileUpload,
} = require("../controller/ngDataController");

// router.get("/:asin", getAmazonProduct);
router.get("/:id", getAllNgData);
router.post("/", addNgData);
router.post("/useNg", useNgData);
router.post("/deleteNg", deleteNgData);
router.post("/file", upload.single("file"), ngfileUpload);

module.exports = router;
