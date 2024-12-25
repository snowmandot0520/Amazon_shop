import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { exhibitProducts } from "../redux/reducers/productSlice";
import { getAllNgDatas } from "../redux/reducers/ngSlice";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

const ExhibitionSettingModal = (props) => {
  const [passedProducts, setPassedProduct] = useState();
  const [exceptedProducts, setExceptedProduct] = useState();
  const [checkedKeys, setCheckedKeys] = useState();
  const [exceptedKeys, setExceptedKeys] = useState();

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const productData = useSelector((state) => state.product.products); // Accessing state.products using useSelector
  let ngDataObject = useSelector((state) => state.ng.ngdatas);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  };

  const exhibit_Products = async (event) => {
    dispatch(
      exhibitProducts({
        checkedKeys: checkedKeys,
        exceptedKeys: exceptedKeys,
        userId: userInfo._id,
        userInfo: userInfo,
        excludewords: ngDataObject[0].excludeword,
      })
    );
    props.onClick();
    console.log(checkedKeys, exceptedKeys);
  };
  const ngCheck = () => {
    let checkProducts = [];
    let excepted_Products = [];
    let checkedkeys = [];
    let exceptedkeys = [];

    props.checkedItems.map((key) => {
      const product = productData[key];
      let title = product.title.toLowerCase();
      let Cbullet_point = "";
      product.bullet_point.map((bull) => {
        Cbullet_point += "-" + bull.value.toLowerCase();
      });
      let total = title + Cbullet_point;
      let asin = product.asin.toLowerCase();
      // -ngword check
      let isexcept = false;
      ngDataObject[0]?.ngword.map((word, index) => {
        if (!isexcept && word.flag) {
          if (total.includes(word.value.toLowerCase())) {
            isexcept = true;
          }
        }
      });
      // -ngcategory check
      if (!isexcept) {
        ngDataObject[0]?.ngcategory.map((category, index) => {
          if (!isexcept && category.flag) {
            // title check
            if (asin.includes(category.value.toLowerCase())) {
              isexcept = true;
            }
          }
        });
      }
      // -ngAsin check
      if (!isexcept) {
        ngDataObject[0]?.ngasin.map((ngas, index) => {
          if (!isexcept && ngas.flag) {
            // title check
            if (asin.includes(ngas.value.toLowerCase())) {
              isexcept = true;
            }
          }
        });
      }
      // -ngBrand check
      if (!isexcept) {
        ngDataObject[0]?.ngbrand.map((brand, index) => {
          if (!isexcept && brand.flag) {
            // title check
            if (asin.includes(brand.value.toLowerCase())) {
              isexcept = true;
            }
          }
        });
      }
      // input products
      // if (!isexcept) {
      let editedTitle = "";
      let description = "";
      ngDataObject[0]?.excludeword.map((word) => {
        if (word.flag) {
          editedTitle = product.title.replace(word.value, "____");
          description = Cbullet_point.replace(word.value, "____");
        }
      });
      checkProducts.push({
        ...product,
        title: editedTitle || product.title,
        description: description || product.description,
        status: "出品済み",
      });
      checkedkeys.push(key);
      // } else if (isexcept) {
      //   exceptedkeys.push(key);
      //   excepted_Products.push(product);
      // }
    });
    setCheckedKeys(checkedkeys);
    setExceptedKeys(exceptedkeys);
    setPassedProduct(checkProducts);
    setExceptedProduct(excepted_Products);
  };
  useEffect(() => {
    dispatch(getAllNgDatas(userInfo._id));
  }, []);
  return (
    <div className="w-[80%] h-auto  py-3 bg-white">
      <div className="flex justify-end pt-3 pr-5">
        <a onClick={props.onClick}>
          <CloseCircleOutlined className="text-[30px] cursor-pointer" />
        </a>
      </div>
      <h2 className="text-center pt-[10px] pb-[10px] text-[26px] font-bold">
        出 品
      </h2>
      <div className="w-full ">
        <div className="w-[90%] mx-auto my-5">
          <div className="products-temple">
            <label className="check-kind">追加された商品</label>
            <div className="products-list flex gap-x-5 mt-3 justify-start">
              {props.checkedItems.map((key) => {
                return (
                  <div key={key} className="product-item">
                    <img src={productData[key].img[0].link}></img>
                    <label>{productData[key].title}</label>
                  </div>
                );
              }) || "内容なし"}
            </div>
          </div>
          <div className="products-temple">
            <label className="check-kind">合格商品</label>
            <div className="products-list flex gap-x-5 mt-3 justify-start w-full">
              {passedProducts?.length
                ? passedProducts?.map((product, index) => {
                    return (
                      <div key={index} className="product-item">
                        <img src={product.img[0].link}></img>
                        <label>{product.title}</label>
                      </div>
                    );
                  })
                : "内容なし"}
            </div>
          </div>
          <div className="products-temple">
            <label className="check-kind">除外された商品</label>
            <div className="products-list flex gap-x-5 mt-3 justify-start">
              {exceptedProducts?.length
                ? exceptedProducts?.map((product, index) => {
                    return (
                      <div key={index} className="product-item">
                        <img src={product.img[0].link}></img>
                        <label>{product.title}</label>
                      </div>
                    );
                  })
                : "内容なし"}
            </div>
          </div>
          <div className="product_btns mx-5 flex gap-5">
            <Button
              onClick={() => {
                ngCheck();
              }}
              className="blue-btn h-[40px] w-full mb-2 primary"
            >
              ng検査
            </Button>
            <Button
              onClick={() => {
                exhibit_Products();
              }}
              className="blue-btn h-[40px] w-full mb-2 primary"
            >
              出 品
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionSettingModal;
