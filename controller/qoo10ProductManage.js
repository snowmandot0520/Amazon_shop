const axios = require("axios");
const XLSX = require("xlsx");
const Category = require("../models/category");
const Product = require("../models/Product");
const NgData = require("../models/NgData");
const AmazonCategory = require("../models/amazonCategory");
const TransFee = require("../models/TransFee");
const AddPrice = require("../models/AddPrice");
const SubQuantity = require("../models/SubQuantity");
const amazonCategory = require("../models/amazonCategory");
const workbook = XLSX.readFile("./qoo10category.xlsx");
const amazonbook = XLSX.readFile("./CategoryMatch.xlsx");
const worksheet = workbook.Sheets["Qoo10_CategoryInfo"];
const amazonsheet = amazonbook.Sheets["CategoryMatch"];

// const createCategory = async () => {
//   const category = await Category.find();
//   if (category.length === 0) {
//     const good = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//     const documents = good.map((row, index) => {
//       return {
//         subCategory: row[4],
//         middleCategoryName: row[5],
//         subCategoryName: row[1] + row[3] + row[5],
//       };
//     });
//     Category.insertMany(documents)
//       .then((result) => {})
//       .catch((err) => {
//         console.error("ドキュメントの挿入エラー:", err);
//       })
//       .finally(() => {});
//   }
// };
// createCategory();
// const createAmazonCategory = async () => {
//   const amazoncategory = await AmazonCategory.find();
//   if (amazoncategory.length === 0) {
//     const amazonCategory = XLSX.utils.sheet_to_json(amazonsheet, { header: 1 });
//     const qoo10categories = await createCategory();

//     const documents = amazonCategory.map((row, index) => {
//       const data = row[0];
//       let category = "";
//       for (i = 0; i < qoo10categories.length; i++) {
//         if (
//           data.includes(qoo10categories[i].bigCategory.slice(0, 2)) &&
//           data.includes(
//             qoo10categories[i].subCategoryName ||
//               (data.includes(qoo10categories[i].bigCategory.slice(0, 3)) &&
//                 data.includes(qoo10categories[i].subCategoryName))
//           )
//         ) {
//           category = qoo10categories[i].subCategory;
//           break;
//         }
//       }
//       return {
//         categoryContent: row[0],
//         qoo10category: category || "300000207",
//       };
//     });
//     console.log("document", documents);
//     AmazonCategory.insertMany(documents)
//       .then((result) => {})
//       .catch((err) => {
//         console.error("ドキュメントの挿入エラー:", err);
//       })
//       .finally(() => {});
//   }
// };
// createAmazonCategory();
const createCategory = async () => {
  const qoo10categorys = await Category.find();
  if (qoo10categorys.length === 0) {
    const good = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const documents = good.map((row, index) => {
      if (index !== 0) {
        return {
          mainCategory: row[0],
          mainCategoryName: row[1],
          middleCategory: row[2],
          middleCategoryName: row[3],
          subCategory: row[4],
          subCategoryName: row[5],
        };
      }
    });
    Category.insertMany(documents)
      .then((result) => {})
      .catch((err) => {
        console.error("ドキュメントの挿入エラー:", err);
      })
      .finally(() => {});
  }
};
createCategory();
const CreateCertificationKey = async (userInfo) => {
  const url =
    "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/CertificationAPI.qapi/CreateCertificationKey";
  const requestConfig = {
    headers: {
      Giosiscertificationkey: userInfo.API_KEY,
    },
    params: {
      user_id: userInfo.USER_ID,
      pwd: userInfo.USER_PASSWORD,
    },
  };
  const result = await axios.get(url, requestConfig);
  return result.data.ResultObject;
};

const getQoo10Category = async (req, res) => {
  Category.find()
    .then((categories) => res.json({ categories }))
    .catch((err) =>
      res.status(404).json({ nopostfound: "No categories found" })
    );
};
const deleteProductAndAddAsin = async (good, userID) => {
  await Product.deleteOne({ _id: good._id });
  let ngData = await NgData.find({ _id: userID });
  if (ngData.length) {
    await NgData.updateOne(
      { _id: userID },
      { $push: { ngasin: { $each: [{ flag: true, value: good.asin }] } } }
    )
      .then((products) => {
        console.log(good.asin, "ngsuccess");
      })
      .catch((err) => {
        console.log("ngerror");
      });
  } else {
    ngData = new NgData({
      ngword: undefined,
      excludeword: undefined,
      ngcategory: undefined,
      ngasin: [{ flag: true, value: good.asin }],
      ngbrand: undefined,
    });
    await ngData.save();
  }
};
const setNewGoods = async (req, res) => {
  try {
    const { checkedKeys, userId, exceptedKeys, excludewords, userInfo } =
      req.body;
    console.log(userInfo);
    const transfee = await TransFee.find({ _id: userId });
    const addprice = await AddPrice.find({ user_id: userId });
    const subquantity = await SubQuantity.find({ _id: userId });
    const categories = await Category.find();
    const certificationKey = await CreateCertificationKey(userInfo);
    const url =
      "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ItemsBasic.qapi/SetNewGoods";
    const dbProducts = await Product.find({ userId: userId });
    const products = checkedKeys.map((key) => {
      return dbProducts[key];
    });
    let sentProducts = [];
    // console.log(addprice, transfee, subquantity);
    for (i = 0; i < products.length; i++) {
      const good = products[i];
      // let qoo10category = "";
      // let qoo10categoryName = "";
      let title = products[i].title;
      let description = products[i].description;
      excludewords.forEach((word) => {
        if (word.flag) {
          title = title.replace(word.value, "");
          description = description.replace(word.value, "");
        }
      });
      // console.log(excludewords, title, description);

      // const subcategories = categories.filter((cat) => {
      //   let content = good.description + good.title;
      //   return (
      //     content.includes(cat.middleCategoryName) ||
      //     cat.subCategoryName.includes(good.amaparentCat) ||
      //     content.includes(good.amaparentCat) ||
      //     content.includes(good.amaCat) ||
      //     cat.subCategoryName.includes(good.amaCat)
      //   );
      // });
      // qoo10category = subcategories[0]?.subCategory;
      // qoo10categoryName = subcategories[0]?.middleCategoryName;
      // if (!subcategories.length) {
      //   // if (good.amaparentCat.includes("ケース")) {
      //   qoo10category = "320002244";
      //   qoo10categoryName = "";
      //   // }
      // }
      let shippingNo = 0;
      const prices = addprice.filter((price) => {
        return price.price_scale > good.price;
      });
      let qoo10_price = good.price;
      if (prices.length) {
        qoo10_price =
          prices[0].odds_amount +
          (prices[0].bene_rate * good.price) / 100 +
          good.price;
      }
      // console.log(shippingNo, qoo10_price, subquantity[0].subquantity, prices);
      // console.log(qoo10category, good.quantity);
      const requestConfig = {
        headers: {
          Giosiscertificationkey: certificationKey,
        },
        params: {
          SecondSubCat: good.SecondSubCat,
          OuterSecondSubCat: good.asin || "",
          Drugtype: "1C" || "",
          BrandNo: "",
          ItemTitle: title.slice(0, 40) || "",
          PromotionName: "",
          SellerCode: "",
          IndustrialCodeType: "",
          IndustrialCode: "",
          ModelNM: "",
          ManufactureDate: "",
          AdditionalOption: good.asin,
          ProductionPlaceType: "1" || "",
          ProductionPlace: good.manufacturer || "",
          Weight: good.package.weight?.value ? good.package.weight?.value : "",
          Material: "",
          AdultYN: good.AdultYN ? "Y" : "N",
          ContactInfo: "",
          StandardImage: good.img[0].link || "",
          VideoURL: null || "",
          ItemDescription: description || "",
          ItemType: "",
          RetailPrice: "11" || "",
          ItemPrice: qoo10_price.toExponential(2),
          ItemQty: subquantity[0].subquantity,
          ExpireDate: "",
          ShippingNo: shippingNo,
          AvailableDateType: (good.quantity == -1 && "0") || "3",
          AvailableDateValue: (good.quantity == -1 && "3") || "20:30",
          Keyword: "",
        },
      };
      const qooResult = await axios.get(url, requestConfig);
      console.log(qooResult.data);
      if (!qooResult.data.ResultCode) {
        // console.log(
        //   "yas",
        //   title,
        //   description,
        //   qoo10_price.toExponential(2),
        //   qoo10_price.toExponential(2) * 0.9
        // );
        await Product.findOneAndUpdate(
          { _id: good._id },
          {
            status: "出品済み",
            title: title,
            description: description,
            qoo10_price: qoo10_price.toExponential(2),
            predictableIncome: qoo10_price.toExponential(2) * 0.9,
            // odds_amount: prices[0].odds_amount,
            // bene_rate: prices[0].bene_rate,
            // SecondSubCat: good.SecondSubCat,
            qoo10_quantity: subquantity[0].subquantity,
            ItemCode: qooResult.data.ResultObject.GdNo,
            // qoo10CategoryName: good.subCategoryName,
          }
        )
          .then(async () => {
            console.log("why?");
            sentdata = await Product.find({ _id: good._id });
            console.log(sentdata);
            sentProducts.push({ ...sentdata, status: "added" });
          })
          .catch((err) => {
            console.log("err", err);
          });
      } else {
        sentdata = await Product.find({ _id: good._id });
        sentProducts.push({ ...sentdata, status: "failed" });
        await deleteProductAndAddAsin(good, userId);
      }
      console.log("yaa1");
    }
    console.log("yaa2");

    const exceptedProducts = exceptedKeys.map((key) => {
      const product = dbProducts[key];
      deleteProductAndAddAsin(product, userId);
      return product;
    });
    for (i = 0; i < exceptedProducts.length; i++) {
      sentProducts.push({
        ...[{ _id: exceptedProducts[i]._id }],
        status: "failed",
      });
    }
    console.log(exceptedKeys);
    const ngdata = await NgData.find({ _id: userId });
    res.status(200).json({
      message: "qoo10に正確に出品されました。",
      products: sentProducts,
      ngdata,
    });
  } catch (err) {
    res.status(500).json({ err: err, message: "e" });
  }
};

const updatePrice = async (ItemCode, qoo10_price, quantity, user) => {
  const certificationKey = await CreateCertificationKey(user);
  const url =
    "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ItemsOrder.qapi/SetGoodsPriceQty";
  const requestConfig = {
    headers: {
      Giosiscertificationkey: certificationKey,
    },
    params: {
      ItemCode: ItemCode,
      SellerCode: "",
      Price: qoo10_price,
      Qty: quantity,
      ExpireDate: "",
    },
  };
  axios
    .get(url, requestConfig)
    .then(async (response) => {
      if (response) {
      }
    })
    .catch((error) => {
      // Handle the error
    });
};
const UpdateMydbOfQoo10 = async (ItemCode, last_quantity, user) => {
  const certificationKey = await CreateCertificationKey(user);
  const url = "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi";
  const requestConfig = {
    params: {
      key: certificationKey,
      ItemCode: ItemCode,
      SellerCode: "",
      v: 1.2,
      returnType: "json",
      method: "ItemsLookup.GetItemDetailInfo",
      Qty: "",
      ExpireDate: "",
    },
  };
  axios
    .get(url, requestConfig)
    .then(async (response) => {
      if (response) {
        await Product.findOneAndUpdate(
          { ItemCode: ItemCode },
          {
            selledQuantity:
              last_quantity - response.data.ResultObject[0]?.ItemQty,
            ItemStatus: response.data.ResultObject[0]?.ItemStatus,
          }
        )
          .then(async (response1) => {
            if (response1) {
            }
          })
          .catch((error) => {
            // Handle the error
          });
      }
    })
    .catch((error) => {
      // Handle the error
    });
};
const deleteProductOfQoo10Mydb = async (req, res) => {
  // if (req.body.status == "出品済み") {
  //   const certificationKey = await CreateCertificationKey();
  //   console.log(certificationKey);
  //   const url =
  //     "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi";
  //   const requestConfig = {
  //     params: {
  //       key: certificationKey,
  //       v: "1.0",
  //       returnType: "json",
  //       method: "ItemsOptions.DeleteInventoryDataUnit",
  //       ItemCode: req.body.ItemCode,
  //       SellerCode: "",
  //       OptionName: req.body.asin,
  //       OptionValue: "",
  //       OptionCode: "",
  //     },
  //   };
  //   axios
  //     .get(url, requestConfig)
  //     .then(async (response) => {
  //       if (response) {
  //         if (!response.data.ResultCode) {
  //           await Product.findOneAndDelete({ _id: req.body.id })
  //             .then((product) => {
  //               res.status(200).json(product);
  //             })
  //             .catch((error) => {
  //               res.status(404).json();
  //             });
  //         } else {
  //           res.status(404).json();
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       // Handle the error
  //       res.status(404).json();
  //     });
  // } else {
  await Product.findOneAndDelete({ _id: req.body._id })
    .then((product) => {
      res.status(200).json({ _id: req.body._id });
    })
    .catch((error) => {
      res.status(404).json({ _id: req.body._id });
    });
  // }
};
module.exports = {
  setNewGoods,
  updatePrice,
  getQoo10Category,
  UpdateMydbOfQoo10,
  deleteProductOfQoo10Mydb,
};
