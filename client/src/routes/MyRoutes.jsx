import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import StripeProvider from "../pages/Payment/StripePayment";
import Product from "../pages/Product";
import SettingNG from "../pages/SettingNG";
import Layout from "../components/layout/Layout";
import { useSelector } from "react-redux";
import UserProfile from "../pages/User/UserProfile";
import Settings from "../pages/User/Profile/Settings";
import MyAccount from "../pages/User/Profile/MyAccount";
import Password from "../pages/User/Profile/Password";
import Main from "../components/layout/Main";
import ExhibitSetting from "../pages/Exhibit-setting";
import Qoo10 from "../pages/User/Profile/qoo10";
import Manager from "../pages/manage";

const MyRoutes = () => {
  const { userInfo, paymentStatus } = useSelector((state) => state.auth);
  return (
    <>
      <Layout>
        <Routes>
          <Route
            index
            element={
              // userInfo ? (
              //   paymentStatus ? (
              //     <Home />
              //   ) : (
              //     <StripeProvider />
              //   )
              //   // <Home />
              // ) : <Login />
              <Home />
            }
          />
          <Route
            path="/login"
            element={userInfo ? <Navigate to="/" replace={true} /> : <Login />}
          />
          <Route
            path="/register"
            element={
              userInfo ? <Navigate to="/" replace={true} /> : <Register />
            }
          />
          <Route
            path="/"
            element={
              userInfo ? (
                // paymentStatus ? (
                <Main />
              ) : (
                // ) : (
                //   <StripeProvider />
                // )
                <Login />
              )
            }
          >
            <Route path="product" element={<Product />} />
            <Route path="manager" element={<Manager />} />
            <Route path="ng-setting" element={<SettingNG />} />
            <Route path="exhibit-setting" element={<ExhibitSetting />} />
          </Route>
          <Route path="/stripe" element={<StripeProvider />} />
          <Route path="/user-profile" element={<UserProfile />}>
            <Route path="" element={<MyAccount />} />
            <Route path="password" element={<Password />} />
            <Route path="settings" element={<Settings />} />
            <Route path="qoo10" element={<Qoo10 />} />
          </Route>
        </Routes>
      </Layout>
    </>
  );
};

export default MyRoutes;
