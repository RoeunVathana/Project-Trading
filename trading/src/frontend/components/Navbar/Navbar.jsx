import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import SnttLogo from "../../../assets/SNTT.png";
import { getHuaweiNavbarImage } from "../../ProductHuawei/productAssets";
import { useTheme } from "../ThemeContext";
import "./Navbar.css";

const productPath = (parameters) => {
  if (parameters.collection === "huawei") {
    const huaweiSolutionPaths = {
      "smart-string-ess": "/product-huawei/smart-string-ess",
      "smart-energy-controller": "/product-huawei/smart-energy-controller",
      "smart-module-controller": "/product-huawei/smart-module-controller",
      "smart-guard": "/product-huawei/smart-guard",
      "product-huawei-all": "/product-huawei",
    };

    // Product links must take precedence over their parent solution page.
    // Category-specific slugs let the Huawei API resolve the first published
    // product from the exact residential or commercial category.
    if (huaweiSolutionPaths[parameters.product] && !parameters.categorySlug) {
      const path = huaweiSolutionPaths[parameters.product];
      return parameters.solution
        ? `${path}?solution=${encodeURIComponent(parameters.solution)}`
        : path;
    }

    if (parameters.solution === "residential-solution") {
      return "/product-huawei/residential-solution";
    }

    if (parameters.solution === "commercial-industrial-solutions") {
      return "/commercial-industrial-solutions";
    }

    if (parameters.product || parameters.categorySlug) {
      const path = `/product-huawei/${parameters.categorySlug || parameters.product}`;
      return parameters.solution
        ? `${path}?solution=${encodeURIComponent(parameters.solution)}`
        : path;
    }
    return "/product-huawei";
  }

  if (parameters.collection === "chint" && parameters.solution === "low-voltage" && !parameters.product) {
    return "/low-voltage";
  }

  if (parameters.collection === "chint" && parameters.solution === "instruments-meters" && !parameters.product) {
    return "/instruments-and-meters";
  }

  if ((parameters.collection === "chint" || parameters.collection === "factory")
    && parameters.solution === "power-transmission-distribution"
    && !parameters.product) {
    return "/power-transmission-distribution";
  }

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
        label: "Residential Solutions",
        products: [
          { id: "smart-string-ess", label: "Smart String ESS", model: "LUNA2000-5/7/10/12/14...", icon: getHuaweiNavbarImage("smart-string-ess") },
          { id: "smart-energy-controller", label: "Smart Energy Controller", model: "SUN2000-12/15/17/20/25...", icon: getHuaweiNavbarImage("smart-energy-controller") },
          { id: "smart-module-controller", label: "Smart Module Controller", model: "SUN2000-600W-PA0", icon: getHuaweiNavbarImage("smart-module-controller", "residential-solution") },
          { id: "smart-guard", label: "Smart Guard", model: "SmartGuard-63A-S0", icon: getHuaweiNavbarImage("smart-guard") },
        ],
      },
      {
        id: "commercial-industrial-solutions",
        label: "Commercial & Industrial Solutions",
        products: [
          { id: "smart-pv-controller", categorySlug: "commercial-industrial-smart-pv-controller", label: "Smart PV Controller", model: "SUN2000-150K-MG0", icon: getHuaweiNavbarImage("smart-pv-controller") },
          { id: "smart-module-controller", categorySlug: "commercial-industrial-smart-module-controller", label: "Smart Module Controller", model: "MERC-1100/1300W-P", icon: getHuaweiNavbarImage("smart-module-controller", "commercial-industrial-solutions") },
          { id: "hybrid-cooling-grid-forming-ess", categorySlug: "commercial-industrial-c-and-i-hybrid-cooling-grid-forming-ess", label: "C&I Hybrid Cooling Grid Forming ESS", model: "LUNA2000-241 Series", icon: getHuaweiNavbarImage("hybrid-cooling-grid-forming-ess") },
          { id: "accessories", categorySlug: "commercial-industrial-accessories", label: "Accessories", model: "Smart Dongle - 4G", icon: getHuaweiNavbarImage("accessories") },
        ],
      },
      {
        id: "products-huawei",
        label: "products Huawei",
        products: [
          { id: "product-huawei-all", label: "Product Huawei" },
        ]
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
  { id: "Phnom Penh", label: "Phnom Penh" },
  { id: "Banteay Meanchey", label: "Banteay Meanchey" },
  { id: "Battambang", label: "Battambang" },
  { id: "Kampong Cham", label: "Kampong Cham" },
  { id: "Kampong Chhnang", label: "Kampong Chhnang" },
  { id: "Kampong Speu", label: "Kampong Speu" },
  { id: "Kampong Thom", label: "Kampong Thom" },
  { id: "Kampot", label: "Kampot" },
  { id: "Kandal", label: "Kandal" },
  { id: "Kep", label: "Kep" },
  { id: "Koh Kong", label: "Koh Kong" },
  { id: "Kratie", label: "Kratie" },
  { id: "Mondulkiri", label: "Mondulkiri" },
  { id: "Oddar Meanchey", label: "Oddar Meanchey" },
  { id: "Pailin", label: "Pailin" },
  { id: "Preah Vihear", label: "Preah Vihear" },
  { id: "Prey Veng", label: "Prey Veng" },
  { id: "Pursat", label: "Pursat" },
  { id: "Ratanakiri", label: "Ratanakiri" },
  { id: "Siem Reap", label: "Siem Reap" },
  { id: "Preah Sihanouk", label: "Preah Sihanouk" },
  { id: "Stung Treng", label: "Stung Treng" },
  { id: "Svay Rieng", label: "Svay Rieng" },
  { id: "Takeo", label: "Takeo" },
  { id: "Tbong Khmum", label: "Tbong Khmum" },
];

const referenceLinks = [
  { id: "chint", label: "Project Reference (CHINT)" },
];

const Navbar = () => {
  const navbarRef = useRef(null);
  const dropdownCloseTimer = useRef(null);
  const dropdownLockedByClick = useRef(null);
  const dropdownTriggerRefs = useRef({});
  const menuToggleRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeCollection, setActiveCollection] = useState(productCollections[0].id);
  const [activeSolution, setActiveSolution] = useState(productCollections[0].solutions[0].id);
  const [manualSelectionRoute, setManualSelectionRoute] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  const searchParams = new URLSearchParams(location.search);
  const routeCollectionId = location.pathname === "/low-voltage"
    ? "chint"
    : location.pathname === "/instruments-and-meters"
      ? "chint"
    : location.pathname === "/power-transmission-distribution"
      ? "chint"
    : location.pathname === "/commercial-industrial-solutions"
      ? "huawei"
    : location.pathname.startsWith("/product-huawei")
      ? "huawei"
      : searchParams.get("collection");
  const routeCollection = productCollections.find(
    (collection) => collection.id === routeCollectionId,
  );
  const routeSolutionId = location.pathname === "/low-voltage"
    ? "low-voltage"
    : location.pathname === "/instruments-and-meters"
      ? "instruments-meters"
    : location.pathname === "/power-transmission-distribution"
      ? "power-transmission-distribution"
    : location.pathname === "/commercial-industrial-solutions"
      ? "commercial-industrial-solutions"
    : location.pathname.startsWith("/product-huawei")
      ? "residential-solution"
      : searchParams.get("solution");
  const routeSolution = routeCollection?.solutions.find(
    (solution) => solution.id === routeSolutionId,
  );
  const currentRouteKey = (location.key || "")
    + location.pathname
    + location.search
    + location.hash;

  const selectionIsManual = manualSelectionRoute === currentRouteKey;
  const selectedCollectionId = selectionIsManual
    ? activeCollection
    : routeCollection?.id || activeCollection;
  const selectedSolutionId = selectionIsManual
    ? activeSolution
    : routeSolution?.id || activeSolution;

  const selectedCollection = productCollections.find(
    (collection) => collection.id === selectedCollectionId,
  ) || productCollections[0];
  const selectedSolution = selectedCollection.solutions.find(
    (solution) => solution.id === selectedSolutionId,
  ) || selectedCollection.solutions[0];

  const activateCollection = (collectionId) => {
    const collection = productCollections.find((item) => item.id === collectionId)
      || productCollections[0];

    setActiveCollection(collection.id);
    setActiveSolution(collection.solutions[0].id);
    setManualSelectionRoute(currentRouteKey);
  };

  const activateSolution = (solutionId) => {
    setActiveSolution(solutionId);
    setManualSelectionRoute(currentRouteKey);
  };

  const closeMenu = (restoreFocus = false) => {
    const activeTrigger = restoreFocus ? dropdownTriggerRefs.current[openDropdown] : null;
    const focusTarget = activeTrigger || (restoreFocus ? menuToggleRef.current : null);

    clearTimeout(dropdownCloseTimer.current);
    dropdownLockedByClick.current = null;
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
        dropdownLockedByClick.current = null;
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
      dropdownLockedByClick.current = null;
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
      if (dropdownLockedByClick.current && dropdownLockedByClick.current !== name) {
        dropdownLockedByClick.current = null;
      }
      setOpenDropdown(name);
    }
  };

  const handleDropdownLeave = () => {
    if (!isDesktopNavigation()) return;
    if (dropdownLockedByClick.current) return;

    clearTimeout(dropdownCloseTimer.current);
    dropdownCloseTimer.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 360);
  };

  const handleDropdownBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      dropdownLockedByClick.current = null;
      setOpenDropdown(null);
    }
  };

  const handleDropdownTriggerClick = (name) => {
    clearTimeout(dropdownCloseTimer.current);

    if (isDesktopNavigation()) {
      if (dropdownLockedByClick.current === name) {
        dropdownLockedByClick.current = null;
        setOpenDropdown(null);
      } else {
        dropdownLockedByClick.current = name;
        setOpenDropdown(name);
      }
      return;
    }

    setOpenDropdown((current) => (current === name ? null : name));
  };

  const isCurrentSection = (name) => {
    const { pathname } = location;

    if (name === "home") return pathname === "/";
    if (name === "product") {
      return pathname === "/low-voltage"
        || pathname === "/instruments-and-meters"
        || pathname === "/power-transmission-distribution"
        || pathname === "/commercial-industrial-solutions"
        || pathname === "/product"
        || pathname.startsWith("/product/")
        || pathname === "/product-huawei"
        || pathname.startsWith("/product-huawei/");
    }

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
        onClick={() => handleDropdownTriggerClick(name)}
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
    categorySlug: product.categorySlug,
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
                    SchneiTec Trading <span aria-hidden="true">{"\u2192"}</span>
                  </button>
                  <div className="home-nav-tree__links">
                    <Link to="/product?division=trd&collection=chint" onClick={closeMenu}>
                      Product CHINT
                    </Link>
                    <Link to="/product-huawei" onClick={closeMenu}>
                      Product HUAWEI
                    </Link>
                  </div>
                </div>
                <div className="home-nav-tree__branch">
                  <button type="button" className="home-nav-tree__branch-title">
                    Manufacturing <span aria-hidden="true">{"\u2192"}</span>
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
                    onMouseEnter={() => activateSolution(solution.id)}
                    onFocus={() => activateSolution(solution.id)}
                    onClick={() => {
                      activateSolution(solution.id);

                      if (selectedCollection.id === "huawei" && solution.id === "residential-solution") {
                        closeMenu();
                        navigate("/product-huawei/residential-solution");
                      }
                      if (selectedCollection.id === "huawei" && solution.id === "commercial-industrial-solutions") {
                        closeMenu();
                        navigate("/commercial-industrial-solutions");
                      }
                    }}
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
                    className={"product-mega-product-link" + (product.icon ? " has-image" : "")}
                    to={selectedProductPath(product)}
                    onClick={closeMenu}
                    key={product.id}
                  >
                    {product.icon && (
                      <img
                        className="product-mega-product-image"
                        src={product.icon}
                        alt=""
                        loading="lazy"
                      />
                    )}
                    <span>
                      <strong>{product.label}</strong>
                      {product.model && <small>Model: {product.model}</small>}
                    </span>
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
                <Link to="/reference?category=huawei#project-matrix" onClick={closeMenu}>
                  Project Reference (HUAWEI)
                </Link>
              </div>
            </div>
          ))}

          {renderDropdown("about", "About Us", (
            <div className="nav-tree-menu">
              <div className="nav-tree-menu__links">
                <Link to="/about?profile=trd" onClick={closeMenu}>Profile Company SchneiTec Trading</Link>
                <Link to="/about?profile=man" onClick={closeMenu}>Profile Company Manufacturing</Link>
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

