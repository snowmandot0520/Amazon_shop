const express = require("express");
const bodyParser = require("body-parser");
const AddPrice = require("../models/AddPrice");
const TransFee = require("../models/TransFee");
const SubQuantity = require("../models/SubQuantity");
const app = express();

app.use(bodyParser.json());
const getAddPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await AddPrice.find({ user_id: id });
    res.status(200).json({ data: result, message: "success" });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
const deleteAddPrice = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    const result = await AddPrice.deleteOne({ _id: id });
    console.log(result);
    res.status(200).json({ data: result, message: "success" });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
const newAddPrice = async (req, res) => {
  const { data, userInfo } = req.body;
  const addPrice = new AddPrice({
    user_id: userInfo._id,
    ...data,
  });
  await addPrice
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "sucess" });
    })
    .catch((err) => {
      res.status(500).json({ message: "update err", err: err });
    });
};
const updateAddPrice = async (req, res) => {
  const { selectedAddPirce, data } = req.body;
  console.log(selectedAddPirce, data);
  await AddPrice.findByIdAndUpdate({ _id: selectedAddPirce._id }, { ...data })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "sucess" });
    })
    .catch((err) => {
      res.status(500).json({ message: "update err", err: err });
    });
};

const gettransfee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TransFee.find({ _id: id });
    res.status(200).json({ data: result, message: "success" });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
const updatetransfee = async (req, res) => {
  const { data, userInfo } = req.body;
  console.log(data);
  const findData = await TransFee.find({ _id: userInfo._id });
  if (findData.length) {
    await TransFee.findByIdAndUpdate({ _id: userInfo._id }, { ...data })
      .then((result) => {
        console.log(result);
        res.status(200).json({ message: "sucess" });
      })
      .catch((err) => {
        res.status(500).json({ message: "update err", err: err });
      });
  } else {
    const transfee = new TransFee({
      _id: userInfo._id,
      ...data,
    });
    await transfee
      .save()
      .then((result) => {
        console.log(result);
        res.status(200).json({ message: "sucess" });
      })
      .catch((err) => {
        res.status(500).json({ message: "update err", err: err });
      });
  }
};
const getamount = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SubQuantity.find({ _id: id });
    res.status(200).json({ data: result, message: "success" });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

const updateamount = async (req, res) => {
  const { payload, userInfo } = req.body;
  const findData = await SubQuantity.find({ _id: userInfo._id });
  if (findData.length) {
    await SubQuantity.findByIdAndUpdate({ _id: userInfo._id }, { ...payload })
      .then((result) => {
        console.log(result);
        res.status(200).json({ message: "sucess" });
      })
      .catch((err) => {
        res.status(500).json({ message: "update err", err: err });
      });
  } else {
    const subquantity = new SubQuantity({
      _id: userInfo._id,
      ...data,
    });
    await subquantity
      .save()
      .then((result) => {
        console.log(result);
        res.status(200).json({ message: "sucess" });
      })
      .catch((err) => {
        res.status(500).json({ message: "update err", err: err });
      });
  }
};
module.exports = {
  updateAddPrice,
  getAddPrice,
  newAddPrice,
  deleteAddPrice,

  gettransfee,
  updatetransfee,

  getamount,
  updateamount,
};
