import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateProduct } from "../redux/reducers/productSlice";
import { Button, InputNumber, List, Modal, Menu, Dropdown } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { GlobalOutlined } from '@ant-design/icons';
// import DeepL from 'deepl-node'

import TextArea from "antd/es/input/TextArea";
import axios from "axios";

const EditModal = (props) => {
  const [lang, setLang] = useState('en');
  const [editedProduct, setEditedProduct] = useState(props.selectedProduct);
  const [mainCategoryName, setMainCategoryName] = useState("");
  const [middleCategories, setMiddleCategories] = useState("");
  const [middleCategoryName, setMiddleCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState("");
  const [open, setOpen] = useState(false);
  const [predic_price, setPredic_price] = useState(0);
  const { qoo10categories } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const handleInputChange = (name, value) => {
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const { src } = event.target;

    const updatedImg = editedProduct.img.map((item) => ({ ...item }));
    const selectedImage = updatedImg.find((item) => item.link === src);
    const selectedIndex = updatedImg.indexOf(selectedImage);

    if (selectedIndex !== -1) {
      updatedImg.splice(selectedIndex, 1);
      updatedImg.unshift(selectedImage);
    }

    setEditedProduct((prevState) => ({
      ...prevState,
      img: updatedImg,
      qoo10_img: updatedImg[0].link,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(updateProduct(editedProduct));
    props.onClick();
  };
  let mainCategories = [];
  let middleC = [];
  let subC = [];

  qoo10categories.map((category, index) => {
    if (
      qoo10categories[index]?.mainCategoryName !==
      qoo10categories[index + 1]?.mainCategoryName
    )
      mainCategories.push(category);
  });
  useEffect(() => {
    middleC = qoo10categories.filter((category, index) => {
      if (
        qoo10categories[index]?.middleCategoryName !==
        qoo10categories[index + 1]?.middleCategoryName
      )
        return category.mainCategoryName === mainCategoryName;
    });
    setMiddleCategories(middleC);
    setSubCategories([]);
  }, [mainCategoryName]);
  useEffect(() => {
    subC = qoo10categories.filter((category, index) => {
      return category.middleCategoryName === middleCategoryName;
    });
    setSubCategories(subC);
  }, [middleCategoryName]);

  const changeLanguage = ({ key }) => {
    setLang(key);
    const translatedProduct =  translateProduct(editedProduct, key);
    setEditedProduct((prevState) => ({
      ...prevState,
      language: key
    }));
    // setEditedProduct({ ...translatedProduct });
    console.log(key)
  }

  const translateProduct = async (editedProduct, lang) => {
    // let translatedProduct = editedProduct;
    const translatedProduct = {}; 

    for (const key in editedProduct) {
      if (typeof editedProduct[key] === 'string') {
        // const translatedText = await DeepL.translate(editedProduct[key], 'EN', 'FR'); // Translate from English to French, you can change the languages as needed
        const response = await axios
          .get("https://api.deepl.com/v2/translate", {
            params: {
              auth_key: '45375261-70ce-7760-ebeb-3ee2cdeea426',
              text: editedProduct[key],
              target_lang: lang
            },
            proxy: {
              host: "localhost",
              port: 5173
            }
          });
        
        const translatedText = response.data.translations[0].text;
        setEditedProduct((prevState) => ({
          ...prevState,
          [key]: translatedText
        }));

        translatedProduct[key] = translatedText;
      } else {
        translatedProduct[key] = editedProduct[key];
      }
    }

    // Use translatedProduct object with all strings translated
    console.log(translatedProduct);
  }

  const menu = (
    <Menu onClick={changeLanguage}>
      <Menu.Item key="ja">日本語</Menu.Item>
      <Menu.Item key="en">English</Menu.Item>
      <Menu.Item key="zh">中文</Menu.Item>
    </Menu>
  );

  return (
    <div className="w-[750px] h-[776px]  bg-white overflow-y-scroll pt-10">
      <div className=" justify-between items-center p-5">
        <div className="flex justify-end pr-5">
          <a onClick={props.onClick}>
            <CloseCircleOutlined className="text-[30px] cursor-pointer" />
          </a>
        </div>
        <h2 className="text-center  pb-[3px] w-full text-[26px] font-bold">
          商 品 情 報 編 集
        </h2>
      </div>
      <div className="flex justify-end">
        <div className="w-1/4">

          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link bg-red-400" onClick={e => e.preventDefault()}>
              <GlobalOutlined /> Language
            </a>
          </Dropdown>
        </div>
      </div>

      <form
        className="w-full px-[20px] pt-0 shadow-none "
        onSubmit={handleSubmit}
      >
        <div className=" justify-between">
          <div className="card w-full mb-5">
            <div className="flex gap-6 w-full">
              <div className=" w-[200px] h-[160px]">
                <label
                  htmlFor="出品"
                  className="block font-semibold text-gray-900 dark:text-white text-[16px] mb-[10px]"
                >
                  画像選択
                </label>
                <div className=" mb-4 mt-2">
                  <div className="main-img mb-3 m-auto flex justify-center">
                    <img
                      className=" shadow-sm rounded-2xl w-[120px] h-[120px]"
                      onClick={() => {
                        setOpen(true);
                      }}
                      src={editedProduct?.qoo10_img}
                    ></img>
                  </div>
                </div>
                <div className="flex gap-1 justify-center items-center">
                  <span>{editedProduct.SecondSubCat}</span>
                </div>
              </div>
              <div>
                <div className="flex gap-2">
                  <div className=" my-1 w-[200px] ">
                    <label
                      htmlFor="title"
                      className="block w-[100px] mb-[8px] text-[16px] font-semibold text-gray-900 dark:text-white"
                    >
                      商 品 規 格
                    </label>
                    <div className="card-2 p-1 gap-2 w-[200px]">
                      <div>
                        <div>
                          <label>幅:</label>
                          <span className="ml-1">
                            {editedProduct?.package.width
                              ? editedProduct?.package.width.value.toPrecision(
                                3
                              ) + "inches"
                              : "未決定"}
                          </span>
                        </div>
                        <div>
                          <label>高さ:</label>
                          <span className="ml-1">
                            {editedProduct?.package.height
                              ? editedProduct?.package.height.value.toPrecision(
                                3
                              ) + "inches"
                              : "未決定"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div>
                          <label>長さ:</label>
                          <span className="ml-1">
                            {editedProduct?.package.length
                              ? editedProduct?.package.length.value.toPrecision(
                                3
                              ) + "inches"
                              : "未決定"}
                          </span>
                        </div>
                        <div>
                          <label>重量:</label>
                          <span className="ml-1">
                            {editedProduct?.package.weight
                              ? editedProduct?.package.weight.value.toPrecision(
                                3
                              ) + "pounds"
                              : "未決定"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" my-1 w-[100px] ">
                    <label
                      htmlFor="title"
                      className="block mb-[8px] w-[100px] text-[16px] font-semibold text-gray-900 dark:text-white"
                    >
                      購 入 価 格:
                    </label>
                    <div className="card-2 p-1 flex gap-2 w-[100px]">
                      <span>{editedProduct?.price} ¥</span>
                    </div>
                  </div>
                  <div className=" my-1 w-[100px] ">
                    <label
                      htmlFor="title"
                      className="block w-[120px] mb-[8px] text-[16px] font-semibold text-gray-900 dark:text-white"
                    >
                      出品数量:
                    </label>
                    <div className="card-2 p-1 flex gap-2 w-[120px]">
                      <span>
                        {(editedProduct?.qoo10_quantity == null && "未決定") ||
                          editedProduct?.qoo10_quantity}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex pt-5 gap-1 justify-left items-center">
                    {editedProduct.qoo10CategoryName && (
                      <label className="text-[16px]">カテゴリー：</label>
                    )}
                    <span>{editedProduct.qoo10CategoryName}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className=" my-1 w-full ">
                <label
                  htmlFor="title"
                  className="block mb-[8px] w-[100px] text-[16px] font-semibold text-gray-900 dark:text-white"
                >
                  タイトル:
                </label>
                <TextArea
                  className=" text-black"
                  placeholder="disable resize"
                  style={{ height: 80, resize: "none" }}
                  value={editedProduct?.title}
                  onChange={(e) => {
                    handleInputChange("title", e.target.value);
                  }}
                />
              </div>

              <div className="my-1 w-full ">
                <label
                  htmlFor="description"
                  className="block mb-[8px] w-[100px] text-[16px] font-semibold text-gray-900 dark:text-white"
                >
                  商 品 説 明:
                </label>
                <TextArea
                  className=" text-black"
                  placeholder="disable resize"
                  style={{ height: 80, resize: "none" }}
                  value={editedProduct?.description}
                  onChange={(e) => {
                    handleInputChange("description", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="card py-2 text-left mb-5">
            <label
              htmlFor="asin"
              className="ml-3 text-[16px] font-semibold text-gray-700 border-b-2 border-dark-grayish-blue pb-2"
            >
              カテゴリー
            </label>
            <div className=" text-center mt-5  flex gap-1">
              <div className="w-full">
                <span>大分類</span>
                <List
                  className="h-[182px] w-full mt-1 overflow-scroll overflow-x-hidden"
                  bordered
                  dataSource={mainCategories}
                  renderItem={(item) => (
                    <List.Item>
                      <a
                        onClick={() => {
                          setMainCategoryName(item.mainCategoryName);
                        }}
                      >
                        {item.mainCategoryName}
                      </a>
                    </List.Item>
                  )}
                />
              </div>
              <div className="w-full">
                <span>中分類カテゴリー</span>
                <List
                  className="h-[182px] w-full mt-1 overflow-scroll overflow-x-hidden"
                  bordered
                  dataSource={middleCategories}
                  renderItem={(item) => (
                    <List.Item>
                      <a
                        onClick={() => {
                          setMiddleCategoryName(item.middleCategoryName);
                        }}
                      >
                        {item.middleCategoryName}
                      </a>
                    </List.Item>
                  )}
                />
              </div>
              <div className="w-full">
                <span>小分類カテゴリー</span>
                <List
                  className="h-[182px] w-full mt-1 overflow-scroll overflow-x-hidden"
                  bordered
                  dataSource={subCategories}
                  renderItem={(item) => (
                    <List.Item>
                      <a
                        onClick={() => {
                          handleInputChange("SecondSubCat", item.subCategory);
                          handleInputChange(
                            "qoo10CategoryName",
                            item.subCategoryName
                          );
                        }}
                      >
                        {item.subCategoryName}
                      </a>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
          {/* <div className="flex gap-4 w-full my-3">
            <div className="w-full text-center flex flex-col justify-between">
              <div className="card text-left">
                <label
                  htmlFor="asin"
                  className="ml-3 text-[16px] font-semibold text-gray-700 border-b-2 border-dark-grayish-blue pb-2"
                >
                  カテゴリー
                </label>
                <div className=" text-center mt-5  flex gap-1">
                  <div className="w-full">
                    <span>大分類</span>
                    <List
                      className="h-[182px] w-full mt-1 overflow-scroll overflow-x-hidden"
                      bordered
                      dataSource={mainCategories}
                      renderItem={(item) => (
                        <List.Item>
                          <a
                            onClick={() => {
                              setMainCategoryName(item.mainCategoryName);
                            }}
                          >
                            {item.mainCategoryName}
                          </a>
                        </List.Item>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <span>中分類カテゴリー</span>
                    <List
                      className="h-[317px] w-full mt-1 overflow-scroll overflow-x-hidden"
                      bordered
                      dataSource={middleCategories}
                      renderItem={(item) => (
                        <List.Item>
                          <a
                            onClick={() => {
                              setMiddleCategoryName(item.middleCategoryName);
                            }}
                          >
                            {item.middleCategoryName}
                          </a>
                        </List.Item>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <span>小分類カテゴリー</span>
                    <List
                      className="h-[317px] w-full mt-1 overflow-scroll overflow-x-hidden"
                      bordered
                      dataSource={subCategories}
                      renderItem={(item) => (
                        <List.Item>
                          <a
                            onClick={() => {
                              handleInputChange(
                                "SecondSubCat",
                                item.subCategory
                              );
                            }}
                          >
                            {item.subCategoryName}
                          </a>
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left w-[420px] card  flex flex-col justify-between">
              <label
                htmlFor="asin"
                className="ml-3 w-[73%]  text-[16px] font-semibold text-gray-700 border-b-2 border-dark-grayish-blue pb-2"
              >
                出品価格と商品数量設定
              </label>
              <div className="text-center">
                <div className="card-2 w-full">
                  <label
                    htmlFor="asin"
                    className="text-[16px] font-semibold text-gray-700 border-b border-dark-grayish-blue pb-2"
                  >
                    数 量 設 定
                  </label>
                  <div className="my-2">
                    <InputNumber
                      addonBefore="数 量"
                      className="w-full"
                      step={1}
                      value={editedProduct.qoo10_quantity}
                      onChange={(e) => {
                        handleInputChange("qoo10_quantity", e);
                        setEditedProduct((prevState) => ({
                          ...prevState,
                          qoo10_price:
                            editedProduct?.price +
                            editedProduct?.odds_amount +
                            (editedProduct?.price * editedProduct?.bene_rate) /
                              100,
                        }));
                        setPredic_price(
                          (editedProduct?.odds_amount +
                            (editedProduct?.price * editedProduct?.bene_rate) /
                              100 -
                            editedProduct?.transport_fee) *
                            e
                        );
                      }}
                      min={0}
                      addonAfter="個"
                    ></InputNumber>
                  </div>
                  <label
                    htmlFor="asin"
                    className="text-[16px] font-semibold text-gray-700 border-b border-dark-grayish-blue pb-2"
                  >
                    販 売 価 格 設 定
                  </label>
                  <div className="mt-2">
                    <InputNumber
                      addonBefore="販売価格"
                      className="w-full"
                      step={1}
                      value={editedProduct?.qoo10_price}
                      min={0}
                      addonAfter="¥"
                    ></InputNumber>
                    <InputNumber
                      addonBefore="追加の昇算価格"
                      className="w-full"
                      onChange={(e) => {
                        handleInputChange("odds_amount", e);
                        setEditedProduct((prevState) => ({
                          ...prevState,
                          qoo10_price:
                            editedProduct?.price +
                            editedProduct?.odds_amount +
                            (editedProduct?.price * editedProduct?.bene_rate) /
                              100,
                        }));
                        setPredic_price(
                          (e * 1 +
                            (editedProduct?.price * editedProduct?.bene_rate) /
                              100 -
                            editedProduct?.transport_fee) *
                            editedProduct?.qoo10_quantity
                        );
                      }}
                      value={editedProduct?.odds_amount}
                      step={1}
                      min={0}
                      addonAfter="¥"
                    ></InputNumber>
                    <InputNumber
                      addonBefore="利益率"
                      className="w-full"
                      onChange={(e) => {
                        handleInputChange("bene_rate", e);
                        setEditedProduct((prevState) => ({
                          ...prevState,
                          qoo10_price:
                            editedProduct?.price +
                            editedProduct?.odds_amount +
                            (editedProduct?.price * editedProduct?.bene_rate) /
                              100,
                        }));
                        setPredic_price(
                          (editedProduct?.odds_amount +
                            (editedProduct?.price * e) / 100 -
                            editedProduct?.transport_fee) *
                            editedProduct?.qoo10_quantity
                        );
                      }}
                      value={editedProduct?.bene_rate}
                      addonAfter="%"
                      step={1}
                      max={100}
                      min={0}
                    ></InputNumber>
                  </div>
                  <div className=" w-full">
                    <label
                      htmlFor="asin"
                      className="text-[16px] font-semibold text-gray-700 border-b border-dark-grayish-blue pb-2"
                    >
                      送 料 設 定
                    </label>
                    <div className="my-2">
                      <InputNumber
                        className="w-full"
                        id="transport_fee"
                        name="transport_fee"
                        value={editedProduct?.transport_fee}
                        onChange={(e) => {
                          setPredic_price(
                            (editedProduct?.odds_amount +
                              (editedProduct?.price *
                                editedProduct?.bene_rate) /
                                100 -
                              e) *
                              editedProduct?.qoo10_quantity
                          );
                          handleInputChange("transport_fee", e);
                        }}
                        addonBefore="送 料"
                        step={1}
                        min={0}
                        addonAfter="¥"
                      ></InputNumber>
                    </div>
                  </div>
                </div>
                <div className="card-2 flex">
                  <label className="w-[60%]">利 益:</label>
                  <label>{predic_price} ¥</label>
                </div>
              </div>
            </div>
          </div> */}
          <Button className="h-[40px] w-full mb-2 primary" htmlType="submit">
            保存
          </Button>
        </div>
      </form>
      <Modal
        open={open}
        onOk={true}
        onCancel={() => {
          setOpen(false);
        }}
        footer={false}
        width={480}
      >
        <div className="img-box w-full flex flex-wrap justify-start items-center">
          {editedProduct &&
            editedProduct.img.map((item, index) => (
              <div
                key={index}
                className="w-[60px] h-[60px] m-1 drop-shadow-xl hover:border"
                onClick={handleImageChange}
              >
                <img
                  src={item.link}
                  alt=""
                  name="link"
                  className="w-full h-full drop-shadow-xl"
                />
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default EditModal;
