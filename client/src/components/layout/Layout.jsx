import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen ">
      <Header />
      <div>
        <main className="h-[92vh] z-10" >
          <div className="background absolute bg-black opacity-100 w-screen h-screen z-0"></div>
          <div className=" absolute bg-black opacity-70 w-screen h-screen z-1"></div>
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;
