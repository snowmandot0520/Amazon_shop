const express = require("express");
const bodyParser = require("body-parser");
const SellingPartner = require("amazon-sp-api");
const app = express();
const Product = require("../models/Product");
const NgData = require("../models/NgData");
const XLSX = require("xlsx");
const csv = require("csv-parser");
const fs = require("fs");
const { updatePrice, UpdateMydbOfQoo10 } = require("./qoo10ProductManage");
const AddPrice = require("../models/AddPrice");
const loadstate = require("../models/loadstate");
const _ = require("lodash");
const price = require("../models/price");
const User = require("../models/User");

require("dotenv").config({
  path: `../`,
});
app.use(bodyParser.json());

// Function to get Access Token using Refresh Token
var access_token1;
var spClient2;
async function getAccessToken() {
  try {
    const spClient = new SellingPartner({
      region: "fe",
      refresh_token: process.env.REFRESH_TOKEN,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.CLIENT_SECRET,
      },
      options: {
        auto_request_tokens: false,
      },
    });
    await spClient.refreshAccessToken();
    let access_token = spClient.access_token;
    access_token1 = spClient.access_token;

    spClient2 = new SellingPartner({
      region: "fe",
      refresh_token: process.env.REFRESH_TOKEN,
      access_token: access_token1,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.CLIENT_SECRET,
      },
    });
    // console.log(spClient2);

    return access_token;
  } catch (error) {
    console.log("sss", error);
  }
}
getAccessToken();
const getAmazonProduct = async (asin) => {
  try {
    // Get Access Token
    // const accessToken = await getAccessToken();
    // Make request to Amazon SP API

    // const spClient = new SellingPartner({
    //   region: "fe",
    //   refresh_token: process.env.REFRESH_TOKEN,
    //   access_token: access_token1,
    //   credentials: {
    //     SELLING_PARTNER_APP_CLIENT_ID: process.env.CLIENT_ID,
    //     SELLING_PARTNER_APP_CLIENT_SECRET: process.env.CLIENT_SECRET,
    //   },
    // });

    // let category = await spClient.callAPI({
    //   operation: "listCatalogCategories",
    //   endpoint: "catalogItems",
    //   query: {
    //     MarketplaceId: "A1VC38T7YXB528",
    //     ASIN: asin,
    //   },
    // });

    let catalog_item = await spClient2.callAPI({
      operation: "getCatalogItem",
      endpoint: "catalogItems",
      path: {
        asin: asin,
      },
      query: {
        marketplaceIds: "A1VC38T7YXB528",
        includedData: "attributes,dimensions,images,summaries",
        locale: "ja_JP",
      },
      options: {
        version: "2022-04-01",
      },
    });
    return {
      ...catalog_item,
      // amaCat: category[0].ProductCategoryName,
      quantity:
        (catalog_item.attributes.unit_count != undefined &&
          catalog_item.attributes.unit_count[0].value) ||
        (catalog_item.attributes.number_of_items != undefined &&
          catalog_item.attributes.number_of_items[0].value) ||
        (catalog_item.attributes.number_of_boxes != undefined &&
          catalog_item.attributes.number_of_boxes[0].value) ||
        -1,
      // amaparentCat:
      //   category[category.length - 1].ProductCategoryName.split("関連商品")[0],
    };
  } catch (error) {
    console.error("ddd", error);
  }
};
const addProductToMydbBasic = async (asin, userId) => {
  const catalog_item = await getAmazonProduct(asin);

  if (!catalog_item) {
    return { state: "asin code error", product: null };
  }

  if (catalog_item.quantity < 1) {
    return { state: "quantify is not enough", product: null }
  }

  let list_price = 0;
  let prices = await price.find({ userId: userId, ASIN: asin });

  if (catalog_item && catalog_item.images[0].images.length) {
    list_price =
      (prices.length &&
        prices[0].Product?.CompetitivePricing.CompetitivePrices[0]?.Price
          .LandedPrice.Amount) ||
      1300;
    //      ||
    // catalog_item.attributes.list_price[0].value;
    // let product = await Product.findOne({
    //   asin: asin,
    //   userId: userId,
    // });
    // if (!product) {
    let bullet_point = "";
    catalog_item.attributes.bullet_point?.map((des) => {
      bullet_point += des.value;
    });
    let product = new Product({
      asin: asin,
      userId: userId,
      title: catalog_item.summaries[0].itemName
        ? catalog_item.summaries[0].itemName
        : "",
      SecondSubCat: null,
      // amaparentCat: catalog_item.amaparentCat,
      // amaCat: catalog_item.amaCat,
      amaparentCat: "",
      amaCat: "",

      qoo10_img: catalog_item.images[0].images
        ? catalog_item.images[0].images[0]?.link
        : "",
      img: catalog_item.images[0].images ? catalog_item.images[0].images : [],
      description: catalog_item.attributes.product_description
        ? catalog_item.attributes.product_description[0].value
        : bullet_point,
      price: list_price,
      qoo10_price: null,
      predictableIncome: null,
      bullet_point: catalog_item.attributes.bullet_point
        ? catalog_item.attributes.bullet_point
        : [],
      quantity: catalog_item.quantity,
      package: catalog_item.dimensions[0].package
        ? catalog_item.dimensions[0].package
        : "",
      brand: catalog_item.summaries[0].brand
        ? catalog_item.summaries[0].brand
        : "",
      part_number: catalog_item.summaries[0].part_number
        ? catalog_item.summaries[0].part_number
        : "",
      manufacturer: catalog_item.summaries[0].manufacturer
        ? catalog_item.summaries[0].manufacturer
        : "",
      releaseDate: catalog_item.summaries[0].releaseDate
        ? catalog_item.summaries[0].releaseDate
        : "",
      AdultYN: catalog_item.summaries[0].adultProduct
        ? catalog_item.summaries[0].adultProduct
        : false,
    });
    await product
      .save()
      .then()
      .catch((err) => {
        console.log(err);
      });
    const result = {};
    result['state'] = "ok";
    result['product'] = product;

    return result;
  }
};
// };
const addProductToMydb = async (req, res) => {
  try {
    const { asin, userId } = req.body;
    await definePrice(asin, userId, 0);

    const result = await addProductToMydbBasic(asin, userId);
    console.log(result);
    const state = result['state']
    let message = "";
    if (state === "ok") {
      message = "商品登録成功";
    } else if(state !== "asin code error"){
      message = "在庫不足！";
    } else {
      message = "ASINコードが無効です。";
    }
    const product = result['product']

    res.json({ product: product, message: message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
const definePrice = async (asins, userID, number) => {
  try {
    // Get Access Token
    // const accessToken = await getAccessToken();
    // Make request to Amazon SP API
    // const spClient = new SellingPartner({
    //   region: "fe",
    //   refresh_token: process.env.REFRESH_TOKEN,
    //   access_token: accessToken,
    //   credentials: {
    //     SELLING_PARTNER_APP_CLIENT_ID: process.env.CLIENT_ID,
    //     SELLING_PARTNER_APP_CLIENT_SECRET: process.env.CLIENT_SECRET,
    //   },
    // });
    try {
      let res = await spClient2.callAPI({
        operation: "getCompetitivePricing",
        endpoint: "productPricing",
        query: {
          Asins: asins,
          ItemType: "Asin",
          MarketplaceId: "A1VC38T7YXB528",
        },
        options: {
          version: "v0",
          raw_result: true,
          timeouts: {
            response: 5000,
            idle: 10000,
            deadline: 30000,
          },
        },
      });
      const data = JSON.parse(res.body);

      const prices = data.payload.map((ele, index) => {
        return {
          ...ele,
          ASIN: ele.ASIN,
          userId: userID,
        };
      });
      await price.insertMany(prices).catch((err) => {
        console.log(err);
      });
    } catch (err) {
      if (err.code) {
        if (err.code === "API_RESPONSE_TIMEOUT")
          console.log(
            "SP-API ERROR: response timeout: " + err.timeout + "ms exceeded.",
            err.message
          );
        if (err.code === "API_IDLE_TIMEOUT")
          console.log(
            "SP-API ERROR: idle timeout: " + err.timeout + "ms exceeded.",
            err.message
          );
        if (err.code === "API_DEADLINE_TIMEOUT")
          console.log(
            "SP-API ERROR: deadline timeout: " + err.timeout + "ms exceeded.",
            err.message
          );
      }
    }
  } catch (error) {
    console.error("ddd", error);
  }
};
const getAllProductOfMydb = async (req, res) => {
  const { userId, length } = req.query;
  console.log(length);
  const addPrice = await AddPrice.find();
  Product.find({ userId: userId })
    .then((products) => {
      if (length == 0) {
        res.json({ products: products, addPrice: addPrice, filelength: 0 });
      } else {
        res.json({
          products: products.splice(length),
          addPrice: addPrice,
          filelength: length,
        });
      }
      return products;
    })
    .catch((err) =>
      res.status(404).json({ nopostfound: "商品が見つかりませんでした" })
    );
};

const updateProductOfMydb = async (req, res) => {
  // console.log((req.body));
  Product.updateOne(
    { asin: req.body.asin, userId: req.body.userId },
    { $set: req.body }
  )
    .then(async () => {
      const product = await Product.find({
        asin: req.body.asin,
        userId: req.body.userId,
      });
      res.json({ product: product[0], message: "商品情報変更成功" });
    })
    .catch((err) => res.status(404).json({ nopostfound: "No Products found" }));
};

const updateProductOfMydbRelatedToTime = async () => {
  const users = await User.find();
  users.map(async (user) => {
    const products = await Product.find({ userId: user._id });
    if (products.length) {
      products.map(async (product, index) => {
        const catalog_item = await getAmazonProduct(product.asin);
        if (catalog_item) {
          const quantity = catalog_item.quantity;
          console.log(quantity);
          const prices = await price.find({ ASIN: product.asin });
          const productprice =
            prices[0]?.Product?.CompetitivePricing.CompetitivePrices[0]?.Price
              .LandedPrice.Amount || 1300;

          Product.updateOne(
            { asin: product.asin },
            { $set: { price: productprice, quantity: quantity } }
          )
            .then((product) => {})
            .catch((err) => {
              console.log(err);
            });
          if (product.status === "出品済み") {
            const qoo10_price =
              productprice * 1 +
              product.odds_amount * 1 +
              (productprice * product.bene_rate * 1) / 100;
            updatePrice(
              product.ItemCode,
              qoo10_price.toFixed(2),
              quantity,
              user
            );
            UpdateMydbOfQoo10(product.ItemCode, product.qoo10_quantity, user);
          }
        }
      });
    }
  });

  timeout_function();
};
const timeout_function = () => {
  setTimeout(function () {
    updateProductOfMydbRelatedToTime();
  }, 28800000);
};
// updateProductOfMydbRelatedToTime();

timeout_function();
const exhibitProducts = async (req, res) => {
  await req.body.map(async (product, index) => {
    await Product.findOneAndUpdate(
      { _id: product._id },
      { status: product.status }
    );
  });
  const data = await Product.find({ status: "新規追加" });
  let asins = data.map((pro) => {
    return { flag: false, value: pro.asin };
  });
  let ngData = await NgData.find();
  if (data.length) {
    if (ngData.length) {
      await NgData.updateOne(
        { _id: ngData[0]._id },
        { ngasin: [...ngData[0].ngasin, ...asins] }
      )
        .then((products) =>
          res.status(200).json({ message: "ngword successfully inserted" })
        )
        .catch((err) =>
          res.status(404).json({ nopostfound: "No Products found" })
        );
    } else {
      ngData = new NgData({
        ngword: undefined,
        excludeword: undefined,
        ngcategory: undefined,
        ngasin: asins,
        ngbrand: undefined,
      });
      await ngData.save();
    }
  }

  await Product.deleteMany({ status: "新規追加" });
};

const asinfileUpload = async (req, res) => {
  const uploadedFile = req.file;
  console.log(req.file);

  let jsonData = [];
  if (req.file.originalname.includes("csv")) {
    const results = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve())
        .on("error", (error) => reject(error));
    });
    jsonData = results.map((d) => {
      return [d.ASIN];
    });
  } else {
    const workbook = XLSX.readFile(uploadedFile.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    // Process and save the data to the database
    const result = await loadstate.find({ _id: req.body.userId });
    const basicData = await Product.find({ userId: req.body.userId });
    if (!result.length) {
      const newloadState = new loadstate({
        _id: req.body.userId,
        length: jsonData.length + basicData.length,
      });
      await newloadState.save();
    } else {
      await loadstate.findByIdAndUpdate(
        { _id: req.body.userId },
        { length: jsonData.length + basicData.length }
      );
    }
  }
  console.log(jsonData);

  jsonData.map(async (row, index) => {
    if (index == 0) {
      res.json({
        totalLength: jsonData.length,
      });
    }
    if (jsonData.length < 20 && index == jsonData.length) {
      await definePrice(jsonData, req.body.userId, index + 1);
    } else if ((index + 1) % 20 == 0 && index != 0) {
      await definePrice(
        jsonData.slice(index - 19, index + 1),
        req.body.userId,
        index + 1
      );
    } else if (jsonData.length > 20 && index + 1 == jsonData.length) {
      await definePrice(
        jsonData.slice(index - 19, index + 1),
        req.body.userId,
        index + 1
      );
    }

    await addProductToMydbBasic(row[0], req.body.userId);
  });
};
const deleteSeletedProduct = async (req, res) => {
  try {
    const { selectedRowKeys, userId } = req.body;
    console.log(selectedRowKeys);
    const data = await Product.find({ userId: userId });
    let deletedproduct = [];
    selectedRowKeys.forEach(async (key, index) => {
      await Product.findByIdAndRemove({ _id: data[key]._id }).then((d) => {
        deletedproduct.push(d._id);
        console.log(deletedproduct);

        if (deletedproduct.length == selectedRowKeys.length)
          res.json({ ids: deletedproduct });
      });
    });
  } catch (err) {
    console.log(err);
    res.json();
  }
};
const ngRecheckProducts = async (req, res) => {
  try {
    const { data } = req.body;
    console.log(req.body);
    data.map(async (e) => {
      await Product.findOneAndUpdate(
        { _id: e._id },
        { ngRecheckedState: e.ngRecheckedState }
      );
    });
    res.json({ message: "ok" });
  } catch (err) {
    res.json({ message: "error" });
  }
};
module.exports = {
  getAllProductOfMydb,
  updateProductOfMydb,
  exhibitProducts,
  addProductToMydb,
  asinfileUpload,
  deleteSeletedProduct,
  ngRecheckProducts,
};
