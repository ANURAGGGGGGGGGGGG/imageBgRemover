import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import './Css/Navbar.css';
import './Css/Theme.css';

function Navbar() {
    const [darkTheme, setDarkTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme ? savedTheme === "dark" : systemDark;
    });
    
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.className = darkTheme ? 'dark' : 'light';
        localStorage.setItem("theme", darkTheme ? "dark" : "light");
    }, [darkTheme]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar" aria-label="Main navigation">
            <div 
                className="navbar-title" 
                onClick={() => navigate("/")}
                role="button"
                tabIndex="0"
                aria-label="Home"
            >
                Image BG Remover
            </div>
            
            <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
                <li>
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => isActive ? "active" : ""}
                        onClick={closeMenu}
                    >
                        <button className="nav-button">Home</button>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/about" 
                        className={({ isActive }) => isActive ? "active" : ""}
                        onClick={closeMenu}
                    >
                        <button className="nav-button">About</button>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/contact" 
                        className={({ isActive }) => isActive ? "active" : ""}
                        onClick={closeMenu}
                    >
                        <button className="nav-button">Contact</button>
                    </NavLink>
                </li>
            </ul>
            
            <div className="nav-actions">
                <button 
                    className="theme-toggle" 
                    onClick={() => setDarkTheme(prev => !prev)}
                    aria-label={`Switch to ${darkTheme ? 'light' : 'dark'} mode`}
                >
                    {darkTheme ? '🌞 Light' : '🌙 Dark'}
                </button>
                <div 
                    className={`hamburger ${menuOpen ? "active" : ""}`} 
                    onClick={() => setMenuOpen(prev => !prev)}
                    role="button"
                    tabIndex="0"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;