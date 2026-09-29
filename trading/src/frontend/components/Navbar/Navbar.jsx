import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  // Close mobile menu
  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-box"></span>
          <span>EFSAN MACHINE</span>
        </NavLink>

        {/* Menu */}
        <div className={`navbar-menu ${open ? "active" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>
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

        {/* Desktop Get Started */}
        <NavLink to="/get-started" className="get-started">
          Get Started
        </NavLink>

        {/* Mobile Menu Button */}
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
    </nav>
  );
};

export default Navbar;
