
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";



const Layout = () => {
  return (
    <>
      <Navbar/>
      {/* This is the main app content outlet */}
      <Outlet />
      {/* This outlet is for overlays */}
      <Outlet context="overlay" /> 
    </>
  );
};

export default Layout;