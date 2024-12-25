import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import EditModal from "../components/EditModal";
import ExhibitionSettingModal from "../components/ExhibitionSettingModal";
import {
  addProduct,
  addProductByFile,
  deleteProduct,
  deleteSelectedP,
  getAllProducts,
  getQoo10Category,
  ngRecheckProducts,
} from "../redux/reducers/productSlice";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {
  Spin,
  Table,
  Button,
  Pagination,
  Input,
  message,
  Upload,
  Divider,
  Progress,
  Badge,
  Space,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [newItems, setNewItems] = useState([]);
  const [file, setFile] = useState(null);
  const [asin, setAsin] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showExhibitionModal, setShowExhibitionModal] = useState(false);
  const { products, loading, fileLength, successMsg, uploading, loadstate } =
    useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.auth);
  const [table_products, SetTable_products] = useState(products || []);
  const [error_Msg, SetError_Msg] = useState(null);
  let ngDataObject = useSelector((state) => state.ng.ngdatas);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const navigate = useNavigate();
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
            className="primary"
          >
            サーチ
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            リセット
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            フィルター
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            取り消し
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const getColumnngSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSelectedKeys(["合格"]);
              handleSearch(["合格"], confirm, dataIndex);
            }}
            size="small"
            style={{
              width: 90,
            }}
            className="primary"
          >
            合格
          </Button>

          <Button
            type="primary"
            onClick={() => {
              setSelectedKeys(["不合格"]);
              handleSearch(["不合格"], confirm, dataIndex);
            }}
            size="small"
            style={{
              width: 90,
            }}
            className="danger"
          >
            不合格
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex] == value,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
  const success = () => {
    messageApi.open({
      type: "success",
      content: successMsg,
    });
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: error_Msg,
    });
    SetError_Msg(null);
  };

  useEffect(() => {
    if (successMsg) {
      success();
    } else if (error_Msg) {
      warning();
    }
  }, [successMsg, error_Msg]);
  useEffect(() => {
    const keyProducts = products.map((product, index) => {
      return { ...product, key: index };
    });
    SetTable_products(keyProducts);
  }, [loading, uploading, products]);

  useEffect(() => {
    // const timeoutId = setTimeout(() => {
    //   dispatch(
    //     getAllProducts({
    //       userId: localStorage.getItem("userId"),
    //       length: products.length,
    //     })
    //   );
    // }, 3600000);
    // return () => {
    //   clearTimeout(timeoutId);
    // };
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const asin = event.target.elements.asin.value;
    setAsin("");
    dispatch(
      addProduct({ asin: asin, userId: localStorage.getItem("userId") })
    );
  };

  const handleEditClick = (index) => {
    const product = products[index];
    setSelectedProduct(product);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  const exhibitionSettingClick = () => {
    const data = selectedRowKeys.filter((key) => {
      return products[key].status === "新規追加";
    });
    let isCategory = true;
    selectedRowKeys.forEach((key) => {
      if (!products[key].SecondSubCat) isCategory = false;
    });
    if (userInfo.API_KEY && userInfo.USER_ID && userInfo.USER_PASSWORD) {
      if (data.length && isCategory) {
        setShowExhibitionModal(true);
      } else {
        if (!data.length) SetError_Msg("出品する商品がございません。");
        if (!isCategory) SetError_Msg("出品時にカテゴリを選択してください。");
      }
      setNewItems(data);
    } else {
      SetError_Msg("qoo10アカウント情報が入力されていません。");
      navigate("/user-profile/qoo10");
    }
  };
  const deleteSelectedProduct = () => {
    dispatch(
      deleteSelectedP({
        selectedRowKeys: selectedRowKeys,
        userId: userInfo._id,
      })
    );
    setSelectedRowKeys([]);
  };
  const onFileChange = (info) => {
    setFile(info.file);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userInfo._id);
    dispatch(addProductByFile(formData));
    setTimeout(function () {
      dispatch(
        getAllProducts({
          userId: localStorage.getItem("userId"),
          length: products.length,
        })
      );
    }, 40000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const checkExhibitedProduct = () => {
    const result = products.map((product) => {
      let total = product.title + product.description;
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
      if (!isexcept) {
        return { _id: product._id, ngRecheckedState: "合格" };
      } else {
        return { _id: product._id, ngRecheckedState: "不合格" };
      }
    });
    dispatch(ngRecheckProducts(result));
    axios.post(`/api/products/ngRecheck`, { data: result });
  };

  const columns = [
    {
      title: "画 像",
      width: 80,
      dataIndex: "qoo10_img",
      key: "_id",
      fixed: "left",
      render: (text) => (
        <img src={text} alt={text} className="m-auto w-[50px]" />
      ),
    },
    {
      title: "タイトル",
      width: 120,
      dataIndex: "title",
      key: "_id",
      ...getColumnSearchProps("title"),
      render: (title) => <label>{title?.slice(0, 18)}...</label>,
    },
    {
      title: "ASIN",
      width: 130,
      dataIndex: "asin",
      key: "_id",
    },
    {
      title: "Shopeeカテゴリ",
      width: 130,
      dataIndex: "SecondSubCat",
      key: "_id",
    },
    {
      title: "Amazon商品在庫",
      width: 90,
      dataIndex: "quantity",
      key: "_id",

      render: (title) => (
        <label>{(title == -1 && "未確認") || title}</label>
      ),
    },
    {
      title: "購入価格(円)",
      width: 130,
      dataIndex: "price",
      key: "_id",
    },
    {
      title: "出品価格(円)",
      width: 130,
      dataIndex: "qoo10_price",
      key: "_id",
    },
    {
      title: "見込み利益(円)",
      width: 130,
      dataIndex: "predictableIncome",
      key: "_id",
    },
    {
      title: "販売数量",
      width: 100,
      dataIndex: "selledQuantity",
      key: "_id",
    },
    {
      title: "出品数量",
      width: 100,
      dataIndex: "qoo10_quantity",
      key: "_id",
    },
    {
      title: "ng再検査",
      width: 120,
      dataIndex: "ngRecheckedState",
      ...getColumnngSearchProps("ngRecheckedState"),
      render: (state) => (
        <span>
          {state && (
            <Badge
              count={state}
              showZero
              color={state == "合格" ? "#52c41a" : "#f5222d"}
            />
          )}
        </span>
      ),

      key: "_id",
    },
    {
      title: "登録時間",
      width: 120,
      dataIndex: "createdAt",
      fixed: "right",
      render: (time) => <span>{time.replace("T", " ").slice(0, 16)}</span>,
      key: "_id",
      sorter: {
        compare: (a, b) =>
          moment(a.createdAt, "DD-MM-YYYY/HH-mm") -
          moment(b.createdAt, "DD-MM-YYYY/HH-mm"),
      },
    },
    {
      title: "状 態",
      width: 60,
      dataIndex: "status",
      key: "_id",
      fixed: "right",
    },
    {
      title: "オプション",
      width: 180,
      key: "_id",
      fixed: "right",
      render: (_, record) => (
        <>
          <Button
            disabled={loading}
            onClick={() => handleEditClick(record.key)}
            className="primary mr-3"
          >
            変 更
          </Button>
          <Button
            disabled={loading}
            onClick={() => dispatch(deleteProduct(record))}
            type="primary "
            className="danger"
          >
            削 除
          </Button>
        </>
      ),
    },
  ];
  useEffect(() => {
    if (loadstate < 4 && fileLength != 0)
      setTimeout(function () {
        dispatch(
          getAllProducts({
            userId: localStorage.getItem("userId"),
            length: products.length,
          })
        );
      }, 120000);
  }, [products, loadstate]);
  return (
    <section className="flex gap-3 px-3 py-3 w-full  absolute h-[92vh] z-10 ">
      {contextHolder}
      <div className=" w-full h-full overflow-auto">
        <div className="card h-full w-full   z-0">
          <div className="max-h-[30px] min-h-[30px]">
            <div className="flex pl-3 justify-between max-w-[65vw] gap-10 w-full mx-auto">
              <div>
                {selectedRowKeys.length !== 0 && (
                  <>
                    <span>
                      <label className="w-[40px]">
                        {selectedRowKeys.length}
                      </label>
                      <label>個商品が選択されました。</label>
                    </span>
                    <Button
                      className="danger"
                      type="primary"
                      onClick={() => {
                        deleteSelectedProduct();
                      }}
                    >
                      削 除
                    </Button>
                  </>
                )}
              </div>
              <div>
                <Button
                  onClick={() => {
                    checkExhibitedProduct();
                  }}
                  className="primary"
                  type="primary"
                  size="small"
                >
                  NGワード検査
                </Button>
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            loading={loading}
            className="max-w-[65vw] main-table mx-auto mt-2 max-h-[80vh]"
            rowSelection={rowSelection}
            dataSource={table_products}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            scroll={{
              y: 500,
              x: 1400,
            }}
          />
        </div>
      </div>
      <div className=" flex flex-col justify-between card h-full py-5 ">
        <div className=" card-3  h-full flex flex-col  justify-between">
          <div className=" relative items-center ">
            <form
              className=" justify-between shadow-none pb-2 pt-5 min-w-[300px] items-center w-full "
              onSubmit={handleSubmit}
            >
              <label
                htmlFor="asin"
                className="text-[16px] font-semibold text-gray-700 border-b-2 border-dark-grayish-blue pb-2"
              >
                商品登録
              </label>
              <div className="mt-8">
                <Input
                  className="mb-2 border-b-1 border-blue-300 text-very-dark-blue placeholder-grayish-blue focus:outline-none focus:border-blue-300 px-1 md:p-2 bg-white w-full"
                  id="asin"
                  type="text"
                  value={asin}
                  onChange={(e) => {
                    setAsin(e.target.value);
                  }}
                  placeholder="ASINコード入力"
                />
                <Button
                  disabled={loading}
                  className="primary h-[40px] w-full tracking-widest mb-2"
                  htmlType="submit"
                >
                  追 加
                </Button>
                <Divider></Divider>
                <div className="w-full flex gap-5 justify-center items-center">
                  <Upload
                    name="file"
                    beforeUpload={(file, FIleList) => false}
                    action=""
                    onChange={onFileChange}
                    multiple={false}
                    className="w-full flex"
                  >
                    <Button
                      disabled={loading}
                      className=" w-full h-auto"
                      icon={<UploadOutlined />}
                    >
                      ファイル
                      <br />
                      を読み込む
                    </Button>
                  </Upload>
                  {!file && (
                    <div className="w-full">
                      <span>*.xlsx/csv</span>
                    </div>
                  )}
                </div>
                <Button
                  disabled={!file || loading}
                  className="primary w-full mt-5"
                  onClick={onFileUpload}
                >
                  送信
                </Button>
                <Divider />
              </div>
            </form>
          </div>
          <div className="px-[40px] pb-[10px] w-[300px] ">
            <label
              htmlFor="asin"
              className="text-[16px] font-semibold text-gray-700 border-b-2 border-dark-grayish-blue pb-2"
            >
              出 品
            </label>

            <Button
              disabled={loading}
              onClick={exhibitionSettingClick}
              className="primary h-[40px] w-full tracking-widest mt-8 mb-2"
            >
              設 定
            </Button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 h-full w-[100vw] bg-black/80 flex justify-center items-center z-10">
          <EditModal
            selectedProduct={selectedProduct}
            onClick={handleModalClose}
          />
        </div>
      )}
      {showExhibitionModal && (
        <div className="fixed top-0 left-0 h-full w-[100vw] bg-black/80 flex justify-center items-center z-10">
          <ExhibitionSettingModal
            onClick={() => {
              setShowExhibitionModal(false);
              setSelectedRowKeys([]);
            }}
            checkedItems={newItems}
          />
        </div>
      )}
    </section>
  );
};

export default Product;
