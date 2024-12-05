import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png"; // Import the logo image (make sure the path is correct)

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          {/* Add the logo image and brand name */}
          <img src={logo} alt="Logo" className="logo" />
          <Link to="/" className="navbar-brand">
            Pixel Intelligence
          </Link>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`navbar-links ${isMenuOpen ? "show" : ""}`}>
          <li>
            <Link to="/">Gallery</Link>
          </li>
          <li>
            <Link to="/editor">Editor</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
