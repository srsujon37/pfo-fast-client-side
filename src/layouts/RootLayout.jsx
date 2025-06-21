import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Pages/Shared/NavBar/Navbar";
import Footer from "../Pages/Shared/Footer/Footer";

const RootLayout = () => {
  return (
    <div>
      <section className="container mx-auto pt-5 pb-5">
        <Navbar></Navbar>
      </section>
      <section  className="min-h-[calc(100vh-300px)]">
        <Outlet></Outlet>
      </section>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
