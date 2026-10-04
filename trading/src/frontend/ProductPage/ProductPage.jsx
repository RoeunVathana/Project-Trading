import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./style/ProductPage.css";

import fallbackProducts from "./DataProduct";
import EngineeringSection from "./EngineeringSection";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000")
  .replace(/\/$/, "");

const toMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const toProduct = (machine) => {
  const categoryName = machine.category?.name || "Uncategorized";
  const machineTypeValue = `${machine.machineType || ""} ${categoryName}`.toLowerCase();
  const powerValue = String(machine.power || "").toLowerCase();
  const powerNumber = Number.parseFloat(powerValue);
  const precisionValue = String(machine.precision || "").toLowerCase();
  const precisionNumber = Number.parseFloat(precisionValue);
  const availabilityValue = String(machine.availability || "").toLowerCase();
  const specs = (machine.specs || []).map((spec) => [spec.specName, spec.specValue]);

  if (specs.length === 0) {
    [
      ["MACHINE TYPE", machine.machineType],
      ["POWER", machine.power],
      ["PRECISION", machine.precision],
      ["AVAILABILITY", machine.availability],
    ].forEach(([label, value]) => {
      if (value) specs.push([label, value]);
    });
  }

  return {
    ...machine,
    image: toMediaUrl(machine.image) || fallbackProducts[0]?.image || "",
    gallery: (machine.gallery || []).map((image) => toMediaUrl(image.imageUrl)),
    category: categoryName.toUpperCase(),
    specs,
    machineType: /turn|lathe/.test(machineTypeValue)
      ? "turning"
      : /5[ -]?axis|five[ -]?axis|universal/.test(machineTypeValue)
        ? "fiveAxis"
        : /mill|cnc/.test(machineTypeValue)
          ? "milling"
          : "",
    power: powerValue.includes("heavy") || (Number.isFinite(powerNumber) && powerNumber > 60)
      ? "heavyDuty"
      : powerValue.includes("high") || (Number.isFinite(powerNumber) && powerNumber >= 25)
        ? "highPower"
        : powerValue
          ? "standard"
          : "",
    precision: precisionValue.includes("sub-micron") || precisionValue.includes("submicron") || (Number.isFinite(precisionNumber) && precisionNumber <= 0.001)
      ? "subMicron"
      : precisionValue
        ? "standardPrecision"
        : "",
    availability: /stock|ready/.test(availabilityValue)
      ? "inStock"
      : /custom|order|lead/.test(availabilityValue)
        ? "customOrder"
        : "",
  };
};

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [totalMachines, setTotalMachines] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadMachines = useCallback(async (pageToLoad) => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/machines?page=${pageToLoad}`,
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to load machines.");
      }

      const newMachines = (result.data || []).map(toProduct);
      setProducts((current) => {
        const loadedIds = new Set(current.map((machine) => machine.id));
        return [
          ...current,
          ...newMachines.filter((machine) => !loadedIds.has(machine.id)),
        ];
      });
      setTotalMachines(result.pagination?.totalItems ?? newMachines.length);
      setNextPage(pageToLoad + 1);
      setHasMore(pageToLoad < (result.pagination?.totalPages ?? 0));
    } catch (error) {
      setLoadError(error.message || "Unable to connect to the machine server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMachines(1);
  }, [loadMachines]);
  /* =================================================
       FILTER STATE
    ================================================= */

  const [filters, setFilters] = useState({
    milling: false,
    turning: false,
    fiveAxis: false,

    standard: false,
    highPower: false,
    heavyDuty: false,

    subMicron: false,
    standardPrecision: false,

    inStock: false,
    customOrder: false,
  });

  /* =================================================
       HANDLE FILTER
    ================================================= */

  const handleFilter = (name) => {
    setFilters((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));

  };

  /* =================================================
       RESET FILTER
    ================================================= */

  const handleResetFilters = () => {
    setFilters({
      milling: false,
      turning: false,
      fiveAxis: false,

      standard: false,
      highPower: false,
      heavyDuty: false,

      subMicron: false,
      standardPrecision: false,

      inStock: false,
      customOrder: false,
    });

  };

  /* =================================================
       CHECK ACTIVE FILTER GROUP
    ================================================= */

  const hasMachineFilter =
    filters.milling || filters.turning || filters.fiveAxis;

  const hasPowerFilter =
    filters.standard || filters.highPower || filters.heavyDuty;

  const hasPrecisionFilter = filters.subMicron || filters.standardPrecision;

  const hasAvailabilityFilter = filters.inStock || filters.customOrder;

  /* =================================================
       FILTER PRODUCTS
    ================================================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      /*
       * MACHINE TYPE
       */
      const machineMatch = !hasMachineFilter || filters[product.machineType];

      /*
       * POWER
       */
      const powerMatch = !hasPowerFilter || filters[product.power];

      /*
       * PRECISION
       */
      const precisionMatch = !hasPrecisionFilter || filters[product.precision];

      /*
       * AVAILABILITY
       */
      const availabilityMatch =
        !hasAvailabilityFilter || filters[product.availability];

      /*
       * Product must match
       * every active filter group
       */
      return machineMatch && powerMatch && precisionMatch && availabilityMatch;
    });
  }, [
    products,
    filters,
    hasMachineFilter,
    hasPowerFilter,
    hasPrecisionFilter,
    hasAvailabilityFilter,
  ]);

  /* =================================================
       RETURN
    ================================================= */

  return (
    <div className="product-page">
      {/* =================================================
                HERO
            ================================================= */}

      <section className="product-hero">
        <div className="product-hero-overlay"></div>

        <div className="product-hero-content">
          <div className="product-category">
            <span>//</span> CATEGORY
          </div>

          <h1>PRODUCT CHINT</h1>

          <p>
            Precision-engineered milling centers, lathes, and multi-axis
            processing units designed for sub-micron accuracy in extreme
            industrial environments. Efsan Global CNC solutions represent the
            pinnacle of structural rigidity and thermal stability for aerospace,
            medical, and automotive applications.
          </p>
        </div>
      </section>

      {/* =================================================
                PRODUCT AREA
            ================================================= */}

      <section className="product-section">
        <div className="product-layout">
          {/* =================================================
                        FILTER SIDEBAR
                    ================================================= */}

          <aside className="product-filter">
            <h3>FILTER PARAMETERS</h3>

            {/* MACHINE TYPE */}

            <div className="filter-group">
              <h4>MACHINE TYPE</h4>

              <label>
                <input
                  type="checkbox"
                  checked={filters.milling}
                  onChange={() => handleFilter("milling")}
                />

                <span>Milling Centers</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filters.turning}
                  onChange={() => handleFilter("turning")}
                />

                <span>Turning Centers</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filters.fiveAxis}
                  onChange={() => handleFilter("fiveAxis")}
                />

                <span>5-Axis Universal</span>
              </label>
            </div>

            {/* POWER OUTPUT */}

            <div className="filter-group">
              <h4>POWER OUTPUT</h4>

              <label>
                <input
                  type="checkbox"
                  checked={filters.standard}
                  onChange={() => handleFilter("standard")}
                />

                <span>Standard (&lt; 25kW)</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filters.highPower}
                  onChange={() => handleFilter("highPower")}
                />

                <span>High Power (25kW - 60kW)</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filters.heavyDuty}
                  onChange={() => handleFilter("heavyDuty")}
                />

                <span>Heavy Duty (&gt; 60kW)</span>
              </label>
            </div>

            {/* PRECISION */}

            <div className="filter-group">
              <h4>PRECISION LEVEL</h4>

              <label>
                <input
                  type="checkbox"
                  checked={filters.subMicron}
                  onChange={() => handleFilter("subMicron")}
                />

                <span>Sub-Micron (0.001mm)</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filters.standardPrecision}
                  onChange={() => handleFilter("standardPrecision")}
                />

                <span>Standard (0.005mm)</span>
              </label>
            </div>

            {/* AVAILABILITY */}

            <div className="filter-group">
              <h4>AVAILABILITY</h4>

              <label>
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={() => handleFilter("inStock")}
                />

                <span>In Stock / Ready to Ship</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filters.customOrder}
                  onChange={() => handleFilter("customOrder")}
                />

                <span>Custom Order / Lead-time</span>
              </label>
            </div>

            {/* RESET */}

            <button
              type="button"
              className="reset-filter-button"
              onClick={handleResetFilters}
            >
              RESET FILTERS
            </button>

            {/* SUPPORT */}

            <div className="technical-support">
              <h4>TECHNICAL SUPPORT</h4>

              <p>
                Download our full CNC catalog in high-resolution PDF format.
              </p>

              <button type="button">
                <span>⇩</span>
                DOWNLOAD CATALOG
              </button>
            </div>
          </aside>

          {/* =================================================
                        PRODUCTS
                    ================================================= */}

          <div className="product-content">
            {/* RESULT COUNT */}

            <div className="product-result-header">
              <span>
                SHOWING {filteredProducts.length} MATCHING MACHINES OF {totalMachines}
              </span>
            </div>

            {/* PRODUCT GRID */}

            {loading && products.length === 0 ? (
              <div className="no-products">
                <h3>LOADING MACHINES</h3>
                <p>Fetching machines from the catalog...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    {/* IMAGE */}

                    <div className="product-image">
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}

                      <img src={product.image} alt={product.name} />
                    </div>

                    {/* BODY */}

                    <div className="product-card-body">
                      <div className="product-card-heading">
                        <span className="product-card-category">
                          {product.category}
                        </span>

                        <span className="product-model">{product.model}</span>
                      </div>

                      <h2>{product.name}</h2>

                      <div className="product-specs">
                        {(product.specs || []).slice(0, 2).map(([label, value]) => (
                          <div className="product-spec" key={label}>
                            <span>{label}</span>

                            <strong>{value}</strong>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="configure-button"
                        onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                      >
                        CONFIGURE SPECIFICATION
                      </button>

                      <button
                        type="button"
                        className="compare-button"
                        onClick={() => console.log("Compare:", product)}
                      >
                        ADD TO COMPARE
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* NO PRODUCTS */

              <div className="no-products">
                <h3>NO PRODUCTS FOUND</h3>

                <p>Try changing your filter parameters.</p>

                <button type="button" onClick={handleResetFilters}>
                  RESET FILTERS
                </button>
              </div>
            )}

            {loadError && (
              <p className="product-load-error" role="alert">
                {loadError}
              </p>
            )}

            {(hasMore || loadError) && (
              <div className="product-load-more">
                <button
                  type="button"
                  onClick={() => loadMachines(nextPage)}
                  disabled={loading}
                >
                  {loading ? "LOADING MACHINES..." : "SHOW MORE MACHINES"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <EngineeringSection />
    </div>
  );
};

export default ProductPage;
