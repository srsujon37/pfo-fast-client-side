import React from "react";
import { Outlet } from "react-router";
import authImg from "../assets/authImage.png";
import ProFastLogo from "../Pages/Shared/ProFastLogo/ProFastLogo";

const AuthLayOuts = () => {
  return (
    <div className="container mx-auto  ">
      <div>
        <ProFastLogo />
      </div>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="flex-1">
          <img src={authImg} className=" rounded-lg shadow-2xl" />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayOuts;
