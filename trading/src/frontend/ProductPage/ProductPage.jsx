import React, { useMemo, useState } from "react";
import "./style/ProductPage.css";

import products from "./DataProduct";
import EngineeringSection from "./EngineeringSection";
import { useNavigate } from "react-router-dom";
const ProductPage = () => {
  const navigate = useNavigate();
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
       PAGINATION STATE
    ================================================= */

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  /* =================================================
       HANDLE FILTER
    ================================================= */

  const handleFilter = (name) => {
    setFilters((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));

    // Go back to page 1 after changing filter
    setCurrentPage(1);
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

    setCurrentPage(1);
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
    filters,
    hasMachineFilter,
    hasPowerFilter,
    hasPrecisionFilter,
    hasAvailabilityFilter,
  ]);

  /* =================================================
       PAGINATION
    ================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage),
  );

  /*
   * If current page becomes larger than
   * available pages after filtering.
   */
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const startIndex = (currentPage - 1) * productsPerPage;

  const endIndex = startIndex + productsPerPage;

  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  /* =================================================
       PAGINATION FUNCTIONS
    ================================================= */

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      window.scrollTo({
        top: 450,
        behavior: "smooth",
      });
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  /* =================================================
       PAGE NUMBERS
    ================================================= */

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
                SHOWING {filteredProducts.length === 0 ? 0 : startIndex + 1}
                {" - "}
                {Math.min(endIndex, filteredProducts.length)} OF{" "}
                {filteredProducts.length} PRODUCTS
              </span>
            </div>

            {/* PRODUCT GRID */}

            {currentProducts.length > 0 ? (
              <div className="product-grid">
                {currentProducts.map((product) => (
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
                        {product.specs.map(([label, value]) => (
                          <div className="product-spec" key={label}>
                            <span>{label}</span>

                            <strong>{value}</strong>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="configure-button"
                        onClick={() => navigate(`/product/${product.id}`)}
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

            {/* =================================================
                            PAGINATION
                        ================================================= */}

            {filteredProducts.length > 0 && (
              <div className="product-pagination">
                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  ‹
                </button>

                {/* PAGE NUMBERS */}

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={currentPage === page ? "pagination-active" : ""}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}

                {/* NEXT */}

                <button
                  type="button"
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  ›
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
