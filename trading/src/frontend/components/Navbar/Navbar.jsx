import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SnttLogo from "../../../assets/SNTT.png";
import { useTheme } from "../ThemeContext";
import "./Navbar.css";

const productPath = (parameters) => {
  const search = new URLSearchParams(
    Object.entries(parameters).filter(([, value]) => value),
  ).toString();

  return "/product?" + search;
};

const productCollections = [
  {
    id: "chint",
    division: "trd",
    label: "Product CHINT",
    solutions: [
      {
        id: "low-voltage",
        label: "Low-voltage",
        products: [
          { id: "main-power-distribution", label: "Main Power Distribution" },
          { id: "sub-power-distribution", label: "Sub Power Distribution" },
          { id: "final-power-distribution", label: "Final Power Distribution" },
          { id: "industrial-control", label: "Industrial Control" },
        ],
      },
      {
        id: "power-transmission-distribution",
        label: "Power Transmission and Distribution",
        products: [
          { id: "transmission", label: "Transmission" },
          { id: "distribution", label: "Distribution" },
          { id: "power-quality-automation", label: "Power Quality & Automation" },
        ],
      },
      {
        id: "instruments-meters",
        label: "Instruments and Meters",
        products: [
          { id: "electricity-meter", label: "Electricity Meter" },
        ],
      },
    ],
  },
  {
    id: "huawei",
    division: "trd",
    label: "Product HUAWEI",
    solutions: [
      {
        id: "residential-solution",
        label: "Residential Solution",
        products: [
          { id: "smart-string-ess", label: "Smart String ESS" },
          { id: "smart-energy-controller", label: "Smart Energy Controller" },
          { id: "smart-module-controller", label: "Smart Module Controller" },
          { id: "smart-guard", label: "Smart Guard" },
        ],
      },
      {
        id: "commercial-industrial-solutions",
        label: "Commercial & Industrial Solutions",
        products: [
          { id: "smart-pv-controller", label: "Smart PV Controller" },
          { id: "smart-module-controller", label: "Smart Module Controller" },
          { id: "hybrid-cooling-grid-forming-ess", label: "Hybrid Cooling Grid Forming ESS" },
          { id: "accessories", label: "Accessories" },
        ],
      },
    ],
  },
  {
    id: "factory",
    division: "man",
    label: "Factory",
    solutions: [
      {
        id: "power-transmission-distribution",
        label: "Power Transmission and Distribution",
        products: [
          { id: "transmission", label: "Transmission" },
          { id: "distribution", label: "Distribution" },
          { id: "power-quality-automation", label: "Power Quality & Automation" },
        ],
      },
    ],
  },
];

const locationLinks = [
  { id: "bangkok", label: "Bangkok" },
  { id: "chiang-mai", label: "Chiang Mai" },
  { id: "phuket", label: "Phuket" },
];

const referenceLinks = [
  { id: "chint", label: "Project Reference (CHINT)" },
  { id: "power-transmission-factory", label: "Power Transmission (Factory)" },
  { id: "distribution-factory", label: "Distribution (Factory)" },
];

const Navbar = () => {
  const navbarRef = useRef(null);
  const dropdownCloseTimer = useRef(null);
  const dropdownTriggerRefs = useRef({});
  const menuToggleRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeCollection, setActiveCollection] = useState(productCollections[0].id);
  const [activeSolution, setActiveSolution] = useState(productCollections[0].solutions[0].id);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  const selectedCollection = productCollections.find(
    (collection) => collection.id === activeCollection,
  ) || productCollections[0];
  const selectedSolution = selectedCollection.solutions.find(
    (solution) => solution.id === activeSolution,
  ) || selectedCollection.solutions[0];

  const activateCollection = (collectionId) => {
    const collection = productCollections.find((item) => item.id === collectionId)
      || productCollections[0];

    setActiveCollection(collection.id);
    setActiveSolution(collection.solutions[0].id);
  };

  const closeMenu = (restoreFocus = false) => {
    const activeTrigger = restoreFocus ? dropdownTriggerRefs.current[openDropdown] : null;
    const focusTarget = activeTrigger || (restoreFocus ? menuToggleRef.current : null);

    clearTimeout(dropdownCloseTimer.current);
    setOpen(false);
    setOpenDropdown(null);

    if (focusTarget) {
      window.requestAnimationFrame(() => focusTarget.focus());
    }
  };

  useEffect(() => {
    const closeWhenClickingOutside = (event) => {
      if (!navbarRef.current?.contains(event.target)) {
        clearTimeout(dropdownCloseTimer.current);
        setOpen(false);
        setOpenDropdown(null);
      }
    };

    document.addEventListener("pointerdown", closeWhenClickingOutside);
    return () => {
      document.removeEventListener("pointerdown", closeWhenClickingOutside);
      clearTimeout(dropdownCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    const compactNavigation = window.matchMedia("(max-width: 1199px)");
    const previousOverflow = document.body.style.overflow;
    const syncPageScroll = () => {
      document.body.style.overflow = open && compactNavigation.matches
        ? "hidden"
        : previousOverflow;
    };

    syncPageScroll();
    compactNavigation.addEventListener("change", syncPageScroll);

    return () => {
      compactNavigation.removeEventListener("change", syncPageScroll);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    const compactNavigation = window.matchMedia("(max-width: 1199px)");
    const resetNavigation = () => {
      clearTimeout(dropdownCloseTimer.current);
      setOpen(false);
      setOpenDropdown(null);
    };

    compactNavigation.addEventListener("change", resetNavigation);
    return () => compactNavigation.removeEventListener("change", resetNavigation);
  }, []);

  const isDesktopNavigation = () => window.matchMedia(
    "(min-width: 1200px) and (hover: hover) and (pointer: fine)",
  ).matches;

  const handleDropdownEnter = (name) => {
    clearTimeout(dropdownCloseTimer.current);
    if (isDesktopNavigation()) {
      setOpenDropdown(name);
    }
  };

  const handleDropdownLeave = () => {
    if (!isDesktopNavigation()) return;

    clearTimeout(dropdownCloseTimer.current);
    dropdownCloseTimer.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 240);
  };

  const handleDropdownBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenDropdown(null);
    }
  };

  const isCurrentSection = (name) => {
    const { pathname } = location;

    if (name === "home") return pathname === "/";
    if (name === "product") return pathname === "/product" || pathname.startsWith("/product/");

    return pathname === "/" + name;
  };

  const renderDropdown = (name, label, children) => (
    <div
      className={"navbar-dropdown navbar-dropdown--" + name
        + (openDropdown === name ? " is-open" : "")
        + (isCurrentSection(name) ? " is-current" : "")}
      onMouseEnter={() => handleDropdownEnter(name)}
      onMouseLeave={handleDropdownLeave}
      onFocusCapture={() => handleDropdownEnter(name)}
      onBlur={handleDropdownBlur}
    >
      <button
        ref={(node) => {
          dropdownTriggerRefs.current[name] = node;
        }}
        type="button"
        className={"navbar-dropdown-trigger" + (isCurrentSection(name) ? " active" : "")}
        aria-haspopup="true"
        aria-controls={"navbar-" + name + "-panel"}
        aria-expanded={openDropdown === name}
        onClick={() => {
          if (isDesktopNavigation()) return;

          const closing = openDropdown === name;
          setOpenDropdown(closing ? null : name);
        }}
      >
        {label}
      </button>
      <div id={"navbar-" + name + "-panel"} className="navbar-submenu" onMouseEnter={() => handleDropdownEnter(name)}>
        {children}
      </div>
    </div>
  );

  const selectedProductPath = (product) => productPath({
    division: selectedCollection.division,
    collection: selectedCollection.id,
    solution: selectedSolution.id,
    product: product.id,
  });

  return (
    <nav
      className={"navbar" + (open ? " is-menu-open" : "")}
      ref={navbarRef}
      aria-label="Primary navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape") closeMenu(true);
      }}
    >
      <button
        type="button"
        className="navbar-backdrop"
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
        onClick={() => closeMenu(true)}
      />
      <div className="navbar-container">
        <NavLink
          to="/"
          end
          className="navbar-logo"
          aria-label="SNTT Power Systems"
          onClick={closeMenu}
        >
          <img
            src={SnttLogo}
            alt="SNTT Power Systems"
            className="navbar-logo-image"
          />
        </NavLink>

        <div id="primary-navigation" className={"navbar-menu" + (open ? " active" : "")}>
          {renderDropdown("home", "Home", (
            <div className="home-nav-tree">
              <div className="home-nav-tree__branches">
                <div className="home-nav-tree__branch">
                  <button type="button" className="home-nav-tree__branch-title">
                    TRD <span aria-hidden="true">{"\u2192"}</span>
                  </button>
                  <div className="home-nav-tree__links">
                    <Link to="/product?division=trd&collection=chint" onClick={closeMenu}>
                      Product CHINT
                    </Link>
                    <Link to="/product?division=trd&collection=huawei" onClick={closeMenu}>
                      Product HUAWEI
                    </Link>
                  </div>
                </div>
                <div className="home-nav-tree__branch">
                  <button type="button" className="home-nav-tree__branch-title">
                    MAN <span aria-hidden="true">{"\u2192"}</span>
                  </button>
                  <div className="home-nav-tree__links">
                    <Link to="/product?division=man&collection=factory" onClick={closeMenu}>
                      Factory
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {renderDropdown("product", "Product", (
            <div className="product-mega-menu">
              <div className="product-mega-collections" aria-label="Product collections">
                <p className="nav-menu-eyebrow">PRODUCT</p>
                {productCollections.map((collection) => (
                  <button
                    type="button"
                    className={"product-mega-collection" + (selectedCollection.id === collection.id ? " active" : "")}
                    aria-pressed={selectedCollection.id === collection.id}
                    key={collection.id}
                    onMouseEnter={() => activateCollection(collection.id)}
                    onFocus={() => activateCollection(collection.id)}
                    onClick={() => activateCollection(collection.id)}
                  >
                    <span>{collection.label}</span>
                    <span className="product-mega-arrow" aria-hidden="true">{"\u2192"}</span>
                  </button>
                ))}
              </div>

              <div className="product-mega-solutions" aria-label={selectedCollection.label + " solutions"}>
                <Link
                  className="product-mega-heading"
                  to={productPath({
                    division: selectedCollection.division,
                    collection: selectedCollection.id,
                  })}
                  onClick={closeMenu}
                >
                  <span>{selectedCollection.label}</span>
                  <small>View all {"\u2192"}</small>
                </Link>
                {selectedCollection.solutions.map((solution) => (
                  <button
                    type="button"
                    className={"product-mega-solution" + (selectedSolution.id === solution.id ? " active" : "")}
                    aria-pressed={selectedSolution.id === solution.id}
                    key={solution.id}
                    onMouseEnter={() => setActiveSolution(solution.id)}
                    onFocus={() => setActiveSolution(solution.id)}
                    onClick={() => setActiveSolution(solution.id)}
                  >
                    <span>{solution.label}</span>
                    <span className="product-mega-arrow" aria-hidden="true">{"\u2192"}</span>
                  </button>
                ))}
              </div>

              <div className="product-mega-products" aria-label={selectedSolution.label + " products"}>
                <Link
                  className="product-mega-heading"
                  to={productPath({
                    division: selectedCollection.division,
                    collection: selectedCollection.id,
                    solution: selectedSolution.id,
                  })}
                  onClick={closeMenu}
                >
                  <span>{selectedSolution.label}</span>
                  <small>View all {"\u2192"}</small>
                </Link>
                {selectedSolution.products.map((product) => (
                  <Link
                    className="product-mega-product-link"
                    to={selectedProductPath(product)}
                    onClick={closeMenu}
                    key={product.id}
                  >
                    {product.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {renderDropdown("distribution", "Distribution Partner", (
            <div className="nav-tree-menu nav-tree-menu--progressive">
              <Link className="nav-tree-menu__heading" to="/distribution" onClick={closeMenu}>
                Depot / Location <span aria-hidden="true">{"\u2192"}</span>
              </Link>
              <div className="nav-tree-menu__links">
                {locationLinks.map((location) => (
                  <Link
                    to={"/distribution?location=" + location.id}
                    onClick={closeMenu}
                    key={location.id}
                  >
                    {location.label}
                  </Link>
                ))}
              </div>
              <p className="nav-tree-menu__note">Sales, service &amp; support contacts</p>
            </div>
          ))}

          {renderDropdown("reference", "Project Reference", (
            <div className="nav-tree-menu">
              <div className="nav-tree-menu__links">
                {referenceLinks.map((reference) => (
                  <Link
                    to={"/reference?category=" + reference.id + "#project-matrix"}
                    onClick={closeMenu}
                    key={reference.id}
                  >
                    {reference.label}
                  </Link>
                ))}
                <Link to="/reference#project-matrix" onClick={closeMenu}>All Projects</Link>
              </div>
            </div>
          ))}

          {renderDropdown("about", "About Us", (
            <div className="nav-tree-menu">
              <div className="nav-tree-menu__links">
                <Link to="/about?profile=trd" onClick={closeMenu}>Profile Company TRD</Link>
                <Link to="/about?profile=man" onClick={closeMenu}>Profile Company MAN</Link>
              </div>
            </div>
          ))}

          {renderDropdown("contact", "Contact", (
            <div className="nav-tree-menu">
              <div className="nav-tree-menu__links">
                <Link to="/contact#contact-form-title" onClick={closeMenu}>Contact form</Link>
                <Link to="/contact#contact-details" onClick={closeMenu}>Phone, email &amp; address</Link>
              </div>
            </div>
          ))}

          <NavLink to="/get-started" className="mobile-get-started" onClick={closeMenu}>
            Get Started
          </NavLink>

        </div>

        <div className="navbar-actions">
          <NavLink to="/get-started" className="get-started" onClick={closeMenu}>
            Get Started
          </NavLink>

          <button
            ref={menuToggleRef}
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={"Switch to " + nextTheme + " mode"}
            aria-pressed={theme === "dark"}
            title={"Switch to " + nextTheme + " mode"}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
                </svg>
              )}
            </span>
          </button>

          <button
            type="button"
            className={"menu-toggle" + (open ? " open" : "")}
            onClick={() => {
              setOpen((current) => !current);
              setOpenDropdown(null);
            }}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-controls="primary-navigation"
            aria-expanded={open}
          >
            <svg className="menu-toggle-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              {open ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
