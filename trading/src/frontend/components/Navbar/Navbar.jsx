import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import "./Navbar.css";
import SNTT from "../../../assets/SNTT.png";

const productCategories = [
  "Low-voltage",
  "Power Transmission and Distribution",
  "Low Voltage Switchgear and Software",
  "Instruments and Meters",
  "EV Charging",
];

const productCategoryItems = {
  "Power Transmission and Distribution": ["Distribution", "Power Quality & Automation"],
  "Low Voltage Switchgear and Software": [
    "Main Distribution Board",
    "Sub Distribution Board",
    "Final Distribution Box",
    "Software",
    "Intelligent Solution",
  ],
  "Instruments and Meters": ["Gas Meter", "Electricity Meter"],
  "EV Charging": ["AC Charging", "DC Charging"],
};

const Navbar = () => {
  const navbarRef = useRef(null);
  const dropdownCloseTimer = useRef(null);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeProductCategory, setActiveProductCategory] = useState(null);
  const [activeProductStandard, setActiveProductStandard] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  const activateProductCategory = (category) => {
    setActiveProductCategory(category);
    setActiveProductStandard(null);
  };

  useEffect(() => {
    const closeWhenClickingOutside = (event) => {
      if (!navbarRef.current?.contains(event.target)) {
        clearTimeout(dropdownCloseTimer.current);
        setOpenDropdown(null);
        setOpen(false);
        setActiveProductCategory(null);
        setActiveProductStandard(null);
      }
    };

    document.addEventListener("pointerdown", closeWhenClickingOutside);
    return () => {
      document.removeEventListener("pointerdown", closeWhenClickingOutside);
      clearTimeout(dropdownCloseTimer.current);
    };
  }, []);

  // Close mobile menu
  const closeMenu = () => {
    clearTimeout(dropdownCloseTimer.current);
    setOpen(false);
    setOpenDropdown(null);
    setActiveProductCategory(null);
    setActiveProductStandard(null);
  };

  const handleDropdownEnter = (name) => {
    clearTimeout(dropdownCloseTimer.current);
    if (window.matchMedia("(min-width: 1101px)").matches) {
      setOpenDropdown(name);
    }
  };

  const handleDropdownLeave = (name) => {
    if (!window.matchMedia("(min-width: 1101px)").matches) return;

    clearTimeout(dropdownCloseTimer.current);
    dropdownCloseTimer.current = setTimeout(() => {
      setOpenDropdown(null);
      if (name === "product") {
        setActiveProductCategory(null);
        setActiveProductStandard(null);
      }
    }, 180);
  };

  const handleDropdownBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenDropdown(null);
    }
  };

  const renderDropdown = (name, label, children) => (
    <div
      className={`navbar-dropdown navbar-dropdown--${name} ${openDropdown === name ? "is-open" : ""}`}
      onMouseEnter={() => handleDropdownEnter(name)}
      onMouseLeave={() => handleDropdownLeave(name)}
      onFocusCapture={() => handleDropdownEnter(name)}
      onBlur={handleDropdownBlur}
    >
      <button
        type="button"
        className="navbar-dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={openDropdown === name}
        onClick={() => {
          if (window.matchMedia("(min-width: 1101px)").matches) {
            setOpenDropdown(name);
            return;
          }

          const closing = openDropdown === name;
          setOpenDropdown(closing ? null : name);
          if (closing && name === "product") {
            setActiveProductCategory(null);
            setActiveProductStandard(null);
          }
        }}
      >
        {label}
      </button>
      <div className="navbar-submenu" onMouseEnter={() => handleDropdownEnter(name)}>
        {children}
      </div>
    </div>
  );

  return (
    <nav className="navbar" ref={navbarRef}>
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

          {renderDropdown("product", "Product", (
            <div className={`product-mega-menu ${activeProductCategory && activeProductCategory !== "Low-voltage" ? "product-mega-menu--category" : ""}`}>
              <div className="product-mega-categories">
                <div className="product-mega-category-list">
                  {productCategories.map((category) => (
                    <button
                      type="button"
                      className={`product-mega-category ${activeProductCategory === category ? "active" : ""}`}
                      aria-expanded={activeProductCategory === category}
                      key={category}
                      onMouseEnter={() => activateProductCategory(category)}
                      onFocus={() => activateProductCategory(category)}
                      onClick={() => activateProductCategory(category)}
                    >
                      <span>{category}</span>
                      <span className="product-mega-arrow" aria-hidden="true">{"\u2192"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {activeProductCategory === "Low-voltage" && (
                <div className="product-mega-standards" aria-label="Standards">
                  {["IEC", "UL"].map((standard) => (
                    <button
                      type="button"
                      className={`product-mega-standard ${activeProductStandard === standard ? "active" : ""}`}
                      aria-expanded={activeProductStandard === standard}
                      key={standard}
                      onMouseEnter={() => setActiveProductStandard(standard)}
                      onFocus={() => setActiveProductStandard(standard)}
                      onClick={() => setActiveProductStandard(standard)}
                    >
                      {standard}<span aria-hidden="true">{"\u2192"}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeProductCategory === "Low-voltage" && activeProductStandard && (
                <div className="product-mega-applications" aria-label="Applications">
                  {["Main Power Distribution", "Sub Power Distribution", "Final Power Distribution", "Industrial Control"].map((application) => (
                    <Link to="/product" onClick={closeMenu} key={application}>
                      {application}({activeProductStandard})
                    </Link>
                  ))}
                </div>
              )}

              {activeProductCategory && activeProductCategory !== "Low-voltage" && (
                <div className="product-mega-category-items" aria-label={`${activeProductCategory} products`}>
                  {productCategoryItems[activeProductCategory].map((item) => (
                    <Link to="/product" onClick={closeMenu} key={item}>
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

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
            onClick={() => {
              setOpen((current) => !current);
              setOpenDropdown(null);
            }}
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
