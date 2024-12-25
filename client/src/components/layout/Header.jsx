import { useEffect, useRef, useState } from "react";
import amazon_logo from "../../assets/amazon-logo.png";
import menu from "../../assets/icon-menu.svg";
import avatar from "../../assets/image-avatar.png";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserDetails,
  getUsersDetails,
} from "../../redux/reducers/authSlice";
import { Button, message, Avatar, Menu } from "antd";
import {
  getAllProducts,
  getQoo10Category,
} from "../../redux/reducers/productSlice";
import { UserOutlined } from "@ant-design/icons";
import { getAllNgDatas } from "../../redux/reducers/ngSlice";

const Header = () => {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState("product");
  const { userInfo } = useSelector((state) => state.auth);
  const { error, errMsg } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.product);
  const [messageApi, contextHolder] = message.useMessage();
  const { pro_error, pro_errMsg } = useSelector((state) => state.product);
  let { check, ngdatas } = useSelector((state) => state.ng);

  //HAMBURGER MENU
  let navMenu = useRef(null);
  let darkScreen = useRef(null);
  let close = useRef(null);
  let hamburger = useRef(null);
  const items = [
    {
      label: (
        <NavLink to="/product" className="text-lg font-bold">
          出 品
        </NavLink>
      ),
      key: "product",
    },
    {
      label: (
        <NavLink to="/ng-setting" className="text-lg font-bold">
          商品検査ワード管理
        </NavLink>
      ),
      key: "ng",
    },
    {
      label: (
        <NavLink to="/exhibit-setting" className="text-lg font-bold">
          出 品 設 定
        </NavLink>
      ),
      key: "exhibit",
    },
    {
      label: userInfo?.isAdmin && (
        <NavLink to="/manager" className="text-lg font-bold">
          ユーザー管理
        </NavLink>
      ),
      key: "manage",
    },
  ];
  const displayMenu = () => {
    navMenu.current.classList.toggle("!translate-x-0");
    darkScreen.current.classList.toggle("!opacity-60");
    darkScreen.current.classList.toggle("!z-20");
    darkScreen.current.classList.toggle("!block");
    close.current.classList.toggle("!block");
    hamburger.current.classList.toggle("!hidden");
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: errMsg,
    });
  };
  const warning2 = () => {
    messageApi.open({
      type: "warning",
      content: pro_errMsg,
    });
  };
  const onClick = (e) => {
    setCurrent(e.key);
  };
  useEffect(() => {
    if (!userInfo) {
      dispatch(getUserDetails());
    }
  }, []);
  useEffect(() => {
    if (error && errMsg) {
      warning();
    } else if (pro_error && pro_errMsg) {
      warning2();
    }
  }, [error, pro_error]);
  useEffect(() => {
    dispatch(getQoo10Category());
    dispatch(
      getAllProducts({ userId: localStorage.getItem("userId"), length: 0 })
    );
  }, []);
  useEffect(() => {
    dispatch(getAllNgDatas(localStorage.getItem("userId")));
    if (userInfo?.isAdmin == true) {
      // dispatch(getUsersDetails());
      console.log(userInfo);
    }
  }, [check, loading]);
  return (
    <header className=" md:px-10 h-[8vh] flex justify-between items-center sm:px-3 mx-auto relative z-10 shadow-lg bg-blue-500">
      {contextHolder}

      <div className="left flex items-center lg:h-inherit ">
        <NavLink
          to=""
          className=" w-[270px] z-50 text-2xl font-black text-center"
        >
          <span className="logo">無 在 庫 シ ス テ ム</span>
        </NavLink>
        <Menu
          onClick={onClick}
          selectedKeys={current}
          mode="horizontal"
          className="ml-[50px]"
          items={items}
        />
      </div>
      <div className="user-bar flex justify-between items-center">
        <div>
          <div className="user h-6 w-6 mx-2 sm:h-8 sm:w-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hidden">
            <img src={avatar} alt="avatar" />
          </div>
          {!userInfo ? (
            <NavLink to="/login">
              <Button className="primary" type="primary">
                ログイン
              </Button>
            </NavLink>
          ) : (
            <NavLink
              to="/user-profile"
              className="cursor-pointer ml-4 lg:ml-0 lg:mt-2"
            >
              <Avatar icon={<UserOutlined />} size={40}></Avatar>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
