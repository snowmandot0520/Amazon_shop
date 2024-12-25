import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductByFile,
  deleteProduct,
  deleteSelectedP,
  getAllProducts,
  getQoo10Category,
  ngRecheckProducts,
} from "../redux/reducers/productSlice";
import {
  UploadOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
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
  Form,
  Switch,
  Space,
  Modal,
} from "antd";
import axios from "axios";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  deleteUser,
  getUsersDetails,
  updateQoo10,
  updateUserPermission,
} from "../redux/reducers/authSlice";
dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";
const Manager = () => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { products, loading, fileLength, successMsg, uploading, loadstate } =
    useSelector((state) => state.product);
  const { usersInfo } = useSelector((state) => state.auth);
  const [table_products, SetTable_products] = useState(products || []);
  const [error_Msg, SetError_Msg] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [modal, contextHolder2] = Modal.useModal();
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
  useEffect(() => {
    dispatch(getUsersDetails());
  }, []);
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
    console.log(usersInfo);
    const keyUsers = usersInfo?.map((user, index) => {
      return { ...user, key: index + 1 };
    });
    SetTable_products(keyUsers);
  }, [loading, uploading, usersInfo]);

  const handleEditClick = (index) => {
    const product = usersInfo[index - 1];
    setSelectedProduct(product);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onSubmit = (e) => {
    dispatch(updateUserPermission(e));
    console.log(e);
  };
  const confirm = (record) => {
    modal.confirm({
      title: "削除",
      icon: <ExclamationCircleOutlined />,
      content: "本当に削除しますか？",
      okText: "确认",
      cancelText: "取消",
      okType: "danger",
      onOk: () => {
        dispatch(deleteUser(record));
      },
    });
  };
  const columns = [
    {
      title: "No",
      width: 40,
      dataIndex: "key",
      key: "_id",
    },
    {
      title: "期限日",
      width: 80,
      dataIndex: "deadline",
      render: (title) => <span>{title?.slice(0, 10)}</span>,
      key: "_id",
    },
    {
      title: "ユーザー名",
      width: 80,
      dataIndex: "username",
      key: "_id",
      ...getColumnSearchProps("username"),
    },
    {
      title: "電子メール",
      width: 80,
      dataIndex: "email",
      key: "_id",
      ...getColumnSearchProps("email"),
    },
    {
      title: "登録時間",
      width: 80,
      dataIndex: "createdAt",
      render: (time) => <span>{time.replace("T", " ").slice(0, 16)}</span>,
      key: "_id",
      sorter: {
        compare: (a, b) =>
          moment(a.createdAt, "DD-MM-YYYY/HH-mm") -
          moment(b.createdAt, "DD-MM-YYYY/HH-mm"),
      },
    },
    {
      title: "許可状態",
      width: 40,
      dataIndex: "permission",
      render: (title) => <span>{title ? "許可" : "不許可"}</span>,
      key: "_id",
    },
    {
      title: "オプション",
      width: 80,
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
            onClick={() => confirm(record)}
            type="primary "
            className="danger"
          >
            削 除
          </Button>
        </>
      ),
    },
  ];
  return (
    <section className="flex gap-3 px-3 py-3 w-full  absolute h-full pb-20 z-10 ">
      {contextHolder}
      {contextHolder2}
      <div className="card h-full w-full z-0">
        <Table
          columns={columns}
          loading={loading}
          className="  mx-auto mt-2 h-full"
          // rowSelection={rowSelection}
          dataSource={table_products}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          scroll={{
            y: 500,
            x: 1400,
          }}
        />
      </div>
      <Modal
        title="権 限 設 定"
        okType="default"
        footer={false}
        open={showModal}
        onOk={() => {
          setShowModal(false);
        }}
        onCancel={() => setShowModal(false)}
      >
        <Form
          onFinish={onSubmit}
          layout="horizontal"
          className=" min-w-full max-w-full p-5"
        >
          <p>{selectedProduct?.username}</p>
          <Form.Item
            hidden
            name="_id"
            initialValue={selectedProduct?._id}
            required
          >
            <Input hidden value={selectedProduct?._id}></Input>
          </Form.Item>
          <Input hidden value={selectedProduct?._id}></Input>
          {console.log(selectedProduct)}
          <Divider />
          <div className="flex justify-between">
            <Form.Item label="期限日" name="deadline" required>
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="許可状態"
              valuePropName="checked"
              name="permission"
              required
            >
              <Switch
                checkedChildren="許可"
                unCheckedChildren="不許可"
                defaultChecked={selectedProduct?.permission}
                className="primary"
              />
            </Form.Item>
          </div>
          <Divider />
          <div className="flex flex-row-reverse">
            <Button className="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </Form>
      </Modal>
    </section>
  );
};

export default Manager;
