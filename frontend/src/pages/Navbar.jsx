import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";


function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isDarkMode ? "dark" : "light"}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Pixel Intelligence</Link>
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
          <li>
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? "🌙" : "🌞"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;