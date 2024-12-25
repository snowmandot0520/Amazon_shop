import Title from "antd/es/skeleton/Title";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Select,
  InputNumber,
  Row,
  List,
  Typography,
  Modal,
  Table,
} from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const layout = {
  labelAlign: "left",
  labelCol: {
    span: 17,
  },
  wrapperCol: {
    span: 8,
  },
};

const ExhibitSetting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addPrice, setAddPrice] = useState([]);
  const [amount, setAmount] = useState({});
  const [transfee, setTransfee] = useState({});
  const [isAdd, setIsAdd] = useState(true);
  const [isEdit, setIsEdit] = useState(true);
  const [isEditAmout, setIsEditAmount] = useState(true);

  const [form] = Form.useForm();
  const [selectedAddPirce, setSelectedAddPirce] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.product);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const saveAddPrice = async (data) => {
    const result = await axios.post("api/exhibit/addprice/new", {
      data,
      userInfo,
    });
    setIsModalOpen(false);
    getAddPrice();
  };
  const getAddPrice = async () => {
    const { data } = await axios.get(`api/exhibit/addprice/${userInfo._id}`);
    form.resetFields();
    setAddPrice(data.data);
  };
  const getamount = async () => {
    const { data } = await axios.get(`api/exhibit/subquantity/${userInfo._id}`);
    form.resetFields();
    setAmount(data.data[0]);
  };
  const updateAddPrice = async (data) => {
    const result = await axios.post("api/exhibit/addprice/", {
      selectedAddPirce,
      data,
      userInfo,
    });
    setIsModalOpen(false);
    form.resetFields();
    getAddPrice();
  };
  const deleteAddPrice = async (data) => {
    await axios.delete(`api/exhibit/addprice/${data._id}`);
    getAddPrice();
  };
  const gettransfee = async () => {
    const { data } = await axios.get(`api/exhibit/transfee/${userInfo._id}`);
    setTransfee(data.data[0]);
  };
  const updatetransfee = async (data) => {
    console.log(data);
    await axios.post("api/exhibit/transfee/", {
      data,
      userInfo,
    });

    gettransfee();
  };
  const updateamout = async (payload) => {
    const { data } = await axios.post("api/exhibit/subquantity/", {
      payload,
      userInfo,
    });
    getamount();
  };
  const columns = [
    {
      title: "価格範囲",
      dataIndex: "price_scale",
      key: "_id",
    },
    {
      title: "追加の昇算価格",
      dataIndex: "odds_amount",
      key: "_id",
    },
    {
      title: "利益率",
      dataIndex: "bene_rate",
      key: "_id",
    },
    {
      title: "オプション",
      dataIndex: "option",
      key: "_id",
      render: (index, text) => (
        <div>
          <Button
            disabled={loading}
            onClick={() => {
              showModal();
              setIsAdd(false);
              setSelectedAddPirce(text);
            }}
            className="primary"
            type="default"
            ghost
          >
            変更
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              deleteAddPrice(text);
            }}
            type="default"
            danger
          >
            削除
          </Button>
        </div>
      ),
    },
  ];
  //   const shipping_options = [
  //     {
  //       value: "0",
  //       label: "無料",
  //     },
  //     {
  //       value: "687807",
  //       label: "50",
  //     },
  //     {
  //       value: "687754",
  //       label: "100",
  //     },
  //     {
  //       value: "687808",
  //       label: "150",
  //     },
  //     {
  //       value: "687755",
  //       label: "200",
  //     },
  //     {
  //       value: "687810",
  //       label: "250",
  //     },
  //     {
  //       value: "687760",
  //       label: "300",
  //     },
  //     {
  //       value: "687811",
  //       label: "350",
  //     },
  //     {
  //       value: "687812",
  //       label: "400",
  //     },
  //     {
  //       value: "687813",
  //       label: "450",
  //     },
  //   ];
  //   const data = {
  //     placeholder: "Search to Select",
  //     optionFilterProp: "children",
  //     filterOption: (input, option) => (option?.label ?? "").includes(input),
  //     options: shipping_options,
  //   };
  useEffect(() => {
    getAddPrice();
    gettransfee();
    getamount();
  }, []);
  return (
    <>
      <section className="flex gap-3 px-3 py-3 w-full  absolute h-[92vh] z-10  ">
        <div className=" h-full w-full z-0">
          <div className="h-full flex gap-5">
            {/* <div className="gutter-row w-full  card h-full flex justify-center items-center ">
              <div className="w-[500px]  h-[600px] ">
                <Form
                  {...layout}
                  onFinish={updatetransfee}
                  className="min-w-full h-full p-5 w-full text-center"
                >
                  <span className="text-xl">送 料 設 定</span>
                  <Divider />
                  <Form.Item
                    name={"transfee_1"}
                    label="A4以内厚さ2.3cm以内、1kg以内"
                    rules={[{ required: true, message: "" }]}
                    className="w-full pt-12"
                  >
                    {isEdit ? (
                      <span>
                        {shipping_options.map((e) => {
                          if (e.value == transfee.transfee_1) return e.label;
                        })}
                      </span>
                    ) : (
                      <Select {...data} showSearch />
                    )}
                  </Form.Item>
                  <Form.Item
                    name={"transfee_2"}
                    label="3辺合計60cm以内、2kg以内"
                    rules={[{ required: true, message: "" }]}
                    className="w-full"
                  >
                    {isEdit ? (
                      <span>
                        {shipping_options.map((e) => {
                          if (e.value == transfee.transfee_2) return e.label;
                        })}
                      </span>
                    ) : (
                      <Select {...data} showSearch />
                    )}
                  </Form.Item>

                  <Form.Item
                    name={"transfee_3"}
                    label="3辺合計80cm以内、5kg以内"
                    rules={[{ required: true, message: "" }]}
                    className="w-full"
                  >
                    {isEdit ? (
                      <span>
                        {shipping_options.map((e) => {
                          if (e.value == transfee.transfee_3) return e.label;
                        })}
                      </span>
                    ) : (
                      <Select {...data} showSearch />
                    )}
                  </Form.Item>

                  <Form.Item
                    name={"transfee_4"}
                    label="３辺合計100cm以内、10kg以内"
                    rules={[{ required: true, message: "" }]}
                    className="w-full"
                  >
                    {isEdit ? (
                      <span>
                        {shipping_options.map((e) => {
                          if (e.value == transfee.transfee_4) return e.label;
                        })}
                      </span>
                    ) : (
                      <Select {...data} showSearch />
                    )}
                  </Form.Item>
                  <Form.Item
                    name={"transfee_5"}
                    label="3辺合計120cm以内、10kg以内 "
                    rules={[{ required: true, message: "" }]}
                    className="w-full"
                  >
                    {isEdit ? (
                      <span>
                        {shipping_options.map((e) => {
                          if (e.value == transfee.transfee_5) return e.label;
                        })}
                      </span>
                    ) : (
                      <Select {...data} showSearch />
                    )}
                  </Form.Item>
                  <Form.Item
                    name={"transfee_6"}
                    label="3辺合計140cm以内、15kg以内"
                    rules={[{ required: true, message: "" }]}
                    className="w-full"
                  >
                    {isEdit ? (
                      <span>
                        {shipping_options.map((e) => {
                          if (e.value == transfee.transfee_6) return e.label;
                        })}
                      </span>
                    ) : (
                      <Select {...data} showSearch />
                    )}
                  </Form.Item>
                  {!isEdit ? (
                    <Button
                      disabled={loading}
                      onClick={() => {
                        setIsEdit(true);
                      }}
                      className="w-[80%] mt-10 m-auto"
                    >
                      保 存
                    </Button>
                  ) : (
                    <Button
                      disabled={loading}
                      htmlType="submit"
                      onClick={() => {
                        setIsEdit(false);
                      }}
                      className="w-[80%] mt-10 m-auto"
                    >
                      変 更
                    </Button>
                  )}
                </Form>
              </div>
            </div> */}
            <div className="gutter-row w-full h-full card flex justify-center items-center">
              <div className="flex justify-between flex-col h-[600px]">
                <div className="w-[500px] h-[300px] p-10　pt-0 card ">
                  <div className="flex justify-between justify-center items-center">
                    <span className="py-3 text-xl">販売価格設定</span>
                    <Button
                      disabled={loading}
                      type="primary"
                      className="primary"
                      onClick={showModal}
                    >
                      設定内容追加
                    </Button>
                  </div>

                  <div className="overflow-auto h-[200px] mt-3">
                    <Table
                      columns={columns}
                      size="small"
                      dataSource={addPrice}
                      pagination={false}
                    ></Table>
                  </div>
                </div>
                <div className="w-[500px] h-[200px] 　pt-0 ">
                  <Form
                    {...layout}
                    onFinish={updateamout}
                    className="min-w-full h-full p-5 px-16 w-full text-center"
                  >
                    <span className="py-3 text-xl">出品数量決定</span>
                    <Divider />
                    <Form.Item
                      name={"subquantity"}
                      label="数 量"
                      rules={[{ required: true, message: "" }]}
                      className="w-full"
                    >
                      {isEditAmout ? (
                        <span>{amount?.subquantity}</span>
                      ) : (
                        <InputNumber min={0} className="w-full" />
                      )}
                    </Form.Item>
                    {!isEditAmout ? (
                      <Button
                        disabled={loading}
                        onClick={() => {
                          setIsEditAmount(true);
                        }}
                        className="w-[80%] mt-1 m-auto"
                      >
                        保 存
                      </Button>
                    ) : (
                      <Button
                        disabled={loading}
                        htmlType="submit"
                        onClick={() => {
                          setIsEditAmount(false);
                        }}
                        className="w-[80%] mt-1 m-auto"
                      >
                        変 更
                      </Button>
                    )}
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          open={isModalOpen}
          onCancel={() => {
            setSelectedAddPirce(null);
            setIsAdd(true);
            form.resetFields();
            setIsModalOpen(false);
          }}
          footer={false}
        >
          <Form
            {...layout}
            form={form}
            onFinish={isAdd ? saveAddPrice : updateAddPrice}
            className="min-w-full h-full p-5 w-full text-center mt-10"
          >
            <span className="text-xl">
              {isAdd ? "設定内容追加" : "設定内容変更"}
            </span>
            <Divider />
            <Form.Item
              name={"price_scale"}
              label="次の価格より低い場合"
              rules={[{ required: true, message: "" }]}
              className="w-full"
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name={"odds_amount"}
              label="追加の昇算価格"
              rules={[{ required: true, message: "" }]}
              className="w-full"
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name={"bene_rate"}
              label="利益率"
              rules={[{ required: true, message: "" }]}
              className="w-full"
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                addonAfter="%"
              />
            </Form.Item>

            <Button
              disabled={loading}
              htmlType="submit"
              className="w-[80%] mt-4 m-auto"
            >
              {isAdd ? "保 存" : "変 更"}
            </Button>
          </Form>
        </Modal>
      </section>
    </>
  );
};
export default ExhibitSetting;
