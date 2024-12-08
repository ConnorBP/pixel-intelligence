
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "../components/Footer.jsx";



const Layout = () => {
  return (
    <>
      {/*
        show the navbar on any page that is not editor.
        for now that is just gallery, but this might extend in the future
      */}
      <Navbar />
      {/* This is the main app content outlet */}
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;