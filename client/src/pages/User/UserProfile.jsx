import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducers/authSlice";
import Loading from "../../components/Loading";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Menu } from "antd";
import { resetProducts } from "../../redux/reducers/productSlice";
const UserProfile = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { userInfo, loading, error, userErrorMsg, userToken } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogOut = () => {
    dispatch(logout());
    dispatch(resetProducts());
    navigate("/login");
  };

  const items = [
    getItem(
      <NavLink to="">私のアカウント</NavLink>,
      "person",
      <ion-icon class="p-2 text-base" name="person"></ion-icon>
    ),
    getItem(
      <NavLink to="password">パスワード</NavLink>,
      "key",
      <ion-icon class="p-2 text-base" name="key"></ion-icon>
    ),
    getItem(
      <NavLink to="settings">個人情報の設定</NavLink>,
      "settings",
      <ion-icon class="p-2 text-base" name="settings"></ion-icon>
    ),
    getItem(
      <NavLink to="qoo10">shopeeアカウント管理</NavLink>,
      "qoo10",
      <ion-icon class="p-2 text-base" name="settings"></ion-icon>
    ),
  ];
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  return (
    <div className="wrapper w-full h-full py-12 sm:py-8 flex items-center justify-center">
      <div className="flex gap-2 drop-shadow-md bg-white rounded-md p-5">
        <div className=" text-center rounded-lg w-[200px] h-auto py-4 ">
          <Avatar size={64} icon={<UserOutlined />} />
          <h3 className="capitalize text-lg text-center my-6">
            <div className="font-bold ">
              {userInfo && (
                <>
                  {userInfo.firstname} {userInfo.lastname}
                </>
              )}
            </div>
          </h3>
          <Menu
            defaultSelectedKeys="person"
            mode="inline"
            inlineCollapsed={collapsed}
            items={items}
          />
          <nav className=" bg-white">
            <div className="p-2">
              <Button
                onClick={() => onLogOut()}
                className="primary w-full mt-32 h-10 flex items-center gap-4  justify-center text-center "
              >
                <LogoutOutlined />
                <span>ログアウト</span>
              </Button>
            </div>
          </nav>
        </div>
        <Divider type="vertical" className="h-[500px]" />
        <div className=" w-[480px] p-8 pb-1">
          {userToken ? (
            <>
              {!error ? (
                <>
                  {loading ? (
                    <div className=" w-full h-full flex items-center justify-center">
                      <Loading />
                    </div>
                  ) : (
                    <>
                      {userInfo ? (
                        <Outlet />
                      ) : (
                        <>
                          <NavLink
                            to="/login"
                            className="text-sm border-b-2 border-b-orange font-bold"
                          >
                            Login
                          </NavLink>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <p className=" mt-20 text-center text-very-dark-blue">
                  {userErrorMsg}
                </p>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
