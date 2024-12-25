const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const NgData = require("../models/NgData");
const XLSX = require("xlsx");
const csv = require("csv-parser");
const fs = require("fs");
const workbook = XLSX.readFile("./ngword.xlsx");

app.use(bodyParser.json());

const addNgData = async (req, res) => {
  try {
    const reqData = req.body;
    console.log("just here", reqData);
    await addTodb(reqData, reqData.userId);
    NgData.find({ _id: reqData.userId }).then((ngdata) =>
      res.status(200).json({ result: ngdata })
    );
  } catch (err) {
    res.status(404).json({ nopostfound: "No Data found" });
  }
};
const addTodb = async (ngdata, userId) => {
  const isNgdata = await NgData.find({
    _id: userId,
  });
  if (!isNgdata.length) {
    const ngdata = new NgData({
      _id: userId,
    });
    await ngdata.save();
  }
  const is_exist_ngword = await NgData.find({
    _id: userId,
    "ngword.value": ngdata.ngword?.value,
  });
  const is_exist_ngbrand = await NgData.find({
    _id: userId,
    "ngbrand.value": ngdata.ngbrand?.value,
  });
  const is_exist_ngcategory = await NgData.find({
    _id: userId,
    "ngcategory.value": ngdata.ngcategory?.value,
  });
  const is_exist_ngasin = await NgData.find({
    _id: userId,
    "ngasin.value": ngdata.ngasin?.value,
  });
  const is_exist_excludeword = await NgData.find({
    _id: userId,
    "excludeword.value": ngdata.excludeword?.value,
  });
  await NgData.updateOne(
    { _id: userId },
    {
      $push: {
        ngword: !is_exist_ngword.length ? ngdata.ngword : undefined,
        ngbrand: !is_exist_ngbrand.length ? ngdata.ngbrand : undefined,
        ngcategory: !is_exist_ngcategory.length ? ngdata.ngcategory : undefined,
        ngasin: !is_exist_ngasin.length ? ngdata.ngasin : undefined,
        excludeword: !is_exist_excludeword.length
          ? ngdata.excludeword
          : undefined,
      },
    }
  );
};

const getAllNgData = async (req, res) => {
  NgData.find({ _id: req.params.id })
    .then((ngdata) => {
      res.json({ ngdata });
    })
    .catch((err) => res.status(404).json({ nopostfound: "No ngdata found" }));
};

const useNgData = async (req, res) => {
  const { kind, value, flag, editedValue, userId } = req.body.data;
  await NgData.findOneAndUpdate(
    {
      _id: userId,
      [[kind] + ".value"]: value,
    },
    {
      $set: { [[kind] + ".$.flag"]: flag, [[kind] + ".$.value"]: editedValue },
    }
  )
    .then((ngdata) =>
      res
        .status(200)
        .json({ ngdata: ngdata, message: "ngword successfully updated" })
    )
    .catch((err) => res.status(404).json({ nopostfound: "No ngword found" }));
};
const deleteNgData = async (req, res) => {
  const { kind, value, userId } = req.body.data;
  console.log(userId, kind);
  if (value == "all") {
    await NgData.updateOne(
      { _id: userId },
      {
        [kind]: [],
      }
    )
      .then((ngdata) =>
        res
          .status(200)
          .json({ ngdata: ngdata, message: "ngword successfully deleted" })
      )
      .catch((err) => res.status(404).json({ nopostfound: "No ngword found" }));
  } else {
    await NgData.updateOne(
      {
        _id: userId,
      },
      { $pull: { [kind]: { value: value } } }
    )
      .then((ngdata) =>
        res
          .status(200)
          .json({ ngdata: ngdata, message: "ngword successfully deleted" })
      )
      .catch((err) => res.status(404).json({ nopostfound: "No ngword found" }));
  }
};
const ngfileUpload = async (req, res) => {
  const uploadedFile = req.file;
  let jsonData = [];
  console.log(req.file);
  if (
    req.file.mimetype
      ? req.file.mimetype?.includes("csv")
      : req.file.originalname?.includes("csv")
  ) {
    const results = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve())
        .on("error", (error) => reject(error));
    });

    jsonData = results.map((d) => {
      return {
        ngword: d.ngword ? { value: d.ngword, flag: true } : undefined,
        excludeword: d.excludeword
          ? { value: d.excludeword, flag: true }
          : undefined,
        ngcategory: d.ngcategory
          ? { value: d.ngcategory, flag: true }
          : undefined,
        ngasin: d.ngasin ? { value: d.ngasin, flag: true } : undefined,
        ngbrand: d.ngbrand ? { value: d.ngbrand, flag: true } : undefined,
      };
    });
  } else if (req.file.originalname.includes("txt")) {
    const data = fs.readFileSync(req.file.path, "utf8");
    const data1 = data.replaceAll("\r\n", " ");
    const results = data1.split(" ");

    jsonData = results.map((word) => {
      return {
        ngword: { value: word, flag: true },
        excludeword: undefined,
        ngcategory: undefined,
        ngasin: undefined,
        ngbrand: undefined,
      };
    });
  }
  jsonData.map((d, index) => {
    addTodb(d, req.body.userId);
  });
  setTimeout(function () {
    NgData.find({ _id: req.body.userId }).then((ngdata) =>
      res.status(200).json({ result: ngdata })
    );
  }, 20000);
};
module.exports = {
  addNgData,
  getAllNgData,
  useNgData,
  deleteNgData,
  ngfileUpload,
};
