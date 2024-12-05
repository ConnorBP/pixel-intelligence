
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";



const Layout = () => {
  return (
    <>
      <Navbar/>
      <main style={{ marginTop: "80px" }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;