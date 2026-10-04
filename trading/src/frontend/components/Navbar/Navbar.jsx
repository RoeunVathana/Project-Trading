import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import "./Navbar.css";
import SNTT from "../../../assets/SNTT.png";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  // Close mobile menu
  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          {/* <span className="logo-box"></span> */}
          <span><img src={SNTT} alt="SNTT Logo" width="100px" /></span>
        </NavLink>

        {/* Menu */}
        <div className={`navbar-menu ${open ? "active" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/product" onClick={closeMenu}>
            Product
          </NavLink>

          <NavLink to="/distribution" onClick={closeMenu}>
            Distribution Partner
          </NavLink>

          <NavLink to="/reference" onClick={closeMenu}>
            Project Reference
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          {/* Mobile Get Started */}
          <NavLink
            to="/get-started"
            className="mobile-get-started"
            onClick={closeMenu}
          >
            Get Started
          </NavLink>
        </div>

        <div className="navbar-actions">
          <NavLink to="/get-started" className="get-started">
            Get Started
          </NavLink>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
            aria-pressed={theme === "dark"}
            title={`Switch to ${nextTheme} mode`}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {theme === "dark" ? "☀" : "☾"}
            </span>
            <span className="theme-toggle-label">{nextTheme} mode</span>
          </button>

          <button
            type="button"
            className={`menu-toggle ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
