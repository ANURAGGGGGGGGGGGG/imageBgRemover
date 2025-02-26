import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Css/Navbar.css';
import './Css/Theme.css';

function Navbar() {
  const [darkTheme, setDarkTheme] = useState(() => localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = darkTheme ? 'dark' : 'light';
    localStorage.setItem("theme", darkTheme ? "dark" : "light");
  }, [darkTheme]);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-title" onClick={() => handleNavigation("/")}>
        Image BG Remover
      </div>
      
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><a onClick={() => handleNavigation("/")}>Home</a></li>
        <li><a onClick={() => handleNavigation("/about")}>About</a></li>
        <li><a onClick={() => handleNavigation("/contact")}>Contact</a></li>
      </ul>
      
      <div className="nav-actions">
        <button className="theme-toggle" onClick={() => setDarkTheme(prev => !prev)}>
          {darkTheme ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div className="hamburger" onClick={() => setMenuOpen(prev => !prev)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
