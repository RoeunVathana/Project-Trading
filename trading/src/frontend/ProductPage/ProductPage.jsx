import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style/ProductPage.css";
import { fetchCachedJson } from "../apiCache";

import fallbackProducts from "./DataProduct";
import EngineeringSection from "./EngineeringSection";
import {
  formatSpecificationSection,
  splitSpecificationValue,
  toSpecificationEntries,
} from "./specificationUtils";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const toMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const toMachineTypeSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const MACHINE_TYPE_OPTIONS = [
  { slug: "main-power-distribution", label: "Main Power Distribution" },
  { slug: "sub-power-distribution", label: "Sub Power Distribution" },
  { slug: "final-power-distribution", label: "Final Power Distribution" },
  { slug: "industrial-control", label: "Industrial Control" },
  { slug: "transmission", label: "Transmission" },
  { slug: "distribution", label: "Distribution" },
  { slug: "power-quality-automation", label: "Power Quality & Automation" },
  { slug: "electricity-meter", label: "Electricity Meter" },
];

const toCardSpecificationRows = (entries) => (entries || [])
  .flatMap((entry) => splitSpecificationValue(entry.value).map((value) => {
    const inlineLabel = !entry.label
      ? value.match(/^([^:]{1,80}):\s*(.+)$/)
      : null;
    const label = inlineLabel?.[1] || entry.label || formatSpecificationSection(entry.section);
    const displayValue = inlineLabel?.[2] || value;

    return [String(label).replace(/:\s*$/, ""), displayValue];
  }))
  .filter(([, value]) => value);

const toProduct = (machine) => {
  const categoryName = machine.category?.name || "Uncategorized";
  const rawMachineType = String(machine.machineType || "").trim();
  const machineTypeValue = `${rawMachineType} ${categoryName}`.toLowerCase();
  const powerValue = String(machine.power || "").toLowerCase();
  const powerNumber = Number.parseFloat(powerValue);
  const precisionValue = String(machine.precision || "").toLowerCase();
  const precisionNumber = Number.parseFloat(precisionValue);
  const availabilityValue = String(machine.availability || "").toLowerCase();
  const specificationEntries = toSpecificationEntries(machine.specs);
  const specs = toCardSpecificationRows(specificationEntries);

  if (specs.length === 0) {
    [
      ["MACHINE TYPE", rawMachineType],
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
    gallery: (machine.gallery || [])
      .map((image) => toMediaUrl(typeof image === "string" ? image : image?.imageUrl))
      .filter(Boolean),
    category: categoryName.toUpperCase(),
    searchText: [machine.name, machine.model, categoryName, rawMachineType, machine.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
    specificationRows: specificationEntries,
    specificationEntries,
    specs,
    machineType: rawMachineType,
    machineTypeKey: toMachineTypeSlug(rawMachineType),
    machineTypeClass: /turn|lathe/.test(machineTypeValue)
      ? "turning"
      : /5[ -]?axis|five[ -]?axis|universal/.test(machineTypeValue)
        ? "fiveAxis"
        : /mill|cnc/.test(machineTypeValue)
          ? "milling"
          : "",
    power:
      powerValue.includes("heavy") ||
      (Number.isFinite(powerNumber) && powerNumber > 60)
        ? "heavyDuty"
        : powerValue.includes("high") ||
            (Number.isFinite(powerNumber) && powerNumber >= 25)
          ? "highPower"
          : powerValue
            ? "standard"
            : "",
    precision:
      precisionValue.includes("sub-micron") ||
      precisionValue.includes("submicron") ||
      (Number.isFinite(precisionNumber) && precisionNumber <= 0.001)
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

const productContexts = {
  chint: {
    title: "PRODUCT CHINT",
    description:
      "Explore CHINT low-voltage, power transmission, distribution, and metering solutions for industrial power systems.",
  },
  huawei: {
    title: "PRODUCT HUAWEI",
    description:
      "Explore Huawei smart-energy solutions for residential, commercial, and industrial applications.",
  },
  factory: {
    title: "FACTORY",
    description:
      "Explore factory power transmission, distribution, and power-quality automation capabilities.",
  },
};

const ProductPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const collection = searchParams.get("collection");
  const productSlug = searchParams.get("product") || "";
  const selectedMachineTypeOption = MACHINE_TYPE_OPTIONS.find(
    (option) => option.slug === productSlug,
  );
  const selectedMachineType = selectedMachineTypeOption?.label || "";
  const selectedDivision = collection === "factory" ? "factory" : "chint";
  const productContext = productContexts[collection] || productContexts.chint;
  const [products, setProducts] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [totalMachines, setTotalMachines] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const loadRequestRef = useRef(0);

  const loadMachines = useCallback(
    async (pageToLoad) => {
      const requestId = ++loadRequestRef.current;
      setLoading(true);
      setLoadError("");

      try {
        const query = new URLSearchParams({ page: String(pageToLoad) });
        query.set("division", selectedDivision);
        if (selectedMachineType) query.set("machineType", selectedMachineType);

        const result = await fetchCachedJson(
          `${API_BASE_URL}/api/machines?${query.toString()}`,
        );
        if (requestId !== loadRequestRef.current) return;

        const newMachines = Array.isArray(result.data)
          ? result.data.map(toProduct)
          : [];
        const totalPages = Number(result.pagination?.totalPages);
        const totalItems = Number(result.pagination?.totalItems);

        setProducts((current) => {
          if (pageToLoad === 1) return newMachines;

          const loadedIds = new Set(current.map((machine) => machine.id));
          return [
            ...current,
            ...newMachines.filter((machine) => !loadedIds.has(machine.id)),
          ];
        });
        setTotalMachines(
          Number.isFinite(totalItems) ? totalItems : newMachines.length,
        );
        setNextPage(pageToLoad + 1);
        setHasMore(
          Number.isFinite(totalPages)
            ? pageToLoad < totalPages
            : newMachines.length > 0,
        );
      } catch (error) {
        if (requestId === loadRequestRef.current) {
          setLoadError(
            error.message || "Unable to connect to the machine server.",
          );
        }
      } finally {
        if (requestId === loadRequestRef.current) setLoading(false);
      }
    },
    [selectedDivision, selectedMachineType],
  );

  const loadTopCategories = useCallback(async () => {
    try {
      const result = await fetchCachedJson(
        `${API_BASE_URL}/api/categories/top?limit=5&division=${selectedDivision}`,
      );

      setTopCategories(
        (Array.isArray(result.data) ? result.data : []).map((category) => ({
          ...category,
          name: String(category.name || "UNCATEGORIZED")
            .trim()
            .toUpperCase(),
          machineCount: Number(category.machineCount || 0),
          viewCount: Number(category.viewCount || 0),
        })),
      );
    } catch {
      // Category ranking is optional; the local fallback still works with loaded products.
      setTopCategories([]);
    }
  }, [selectedDivision]);

  const loadCategories = useCallback(async () => {
    try {
      const result = await fetchCachedJson(`${API_BASE_URL}/api/categories?division=${selectedDivision}`);

      setCategoryOptions(
        (Array.isArray(result.data) ? result.data : [])
          .filter((category) => category.status !== "inactive")
          .map((category) => ({
            id: category.id,
            name: String(category.name || "").trim(),
          }))
          .filter((category) => category.id && category.name),
      );
    } catch {
      setCategoryOptions([]);
    }
  }, [selectedDivision]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProducts([]);
      setNextPage(1);
      setTotalMachines(0);
      setHasMore(true);
      loadMachines(1);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadMachines]);

  useEffect(() => {
    const initialTimer = window.setTimeout(loadTopCategories, 0);
    const refreshTimer = window.setInterval(loadTopCategories, 60 * 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(refreshTimer);
    };
  }, [loadTopCategories]);

  useEffect(() => {
    const timer = window.setTimeout(loadCategories, 0);

    return () => window.clearTimeout(timer);
  }, [loadCategories]);
  /* =================================================
       FILTER STATE
    ================================================= */

  const [filters, setFilters] = useState({
    categories: {},

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

  const handleCategoryFilter = (categoryId) => {
    const key = String(categoryId);
    setFilters((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: !prev.categories[key],
      },
    }));
  };

  const handleProductSearch = (event) => {
    event.preventDefault();
    setAppliedSearch(searchTerm.trim());
  };

  /* =================================================
       RESET FILTER
    ================================================= */

  const handleResetFilters = () => {
    setFilters({
      categories: {},

      standard: false,
      highPower: false,
      heavyDuty: false,

      subMicron: false,
      standardPrecision: false,

      inStock: false,
      customOrder: false,
    });
    setSelectedCategory("");
    setSearchTerm("");
    setAppliedSearch("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("product");
    setSearchParams(nextParams);
  };

  const popularCategories = useMemo(() => {
    if (selectedMachineTypeOption) {
      const relatedCategoryIds = new Set(
        products
          .filter(
            (product) =>
              product.machineTypeKey === selectedMachineTypeOption.slug,
          )
          .map((product) => String(product.categoryId || ""))
          .filter(Boolean),
      );
      const relatedTopCategories = topCategories.filter((category) =>
        relatedCategoryIds.has(String(category.id)),
      );

      if (relatedTopCategories.length > 0) return relatedTopCategories;
    } else if (topCategories.length > 0) {
      return topCategories;
    }

    const categoryMap = new Map();

    products
      .filter(
        (product) =>
          !selectedMachineTypeOption ||
          product.machineTypeKey === selectedMachineTypeOption.slug,
      )
      .forEach((product) => {
        const name = product.category || "UNCATEGORIZED";
        const current = categoryMap.get(name) || {
          name,
          machineCount: 0,
          viewCount: 0,
        };
        current.machineCount += 1;
        current.viewCount += Number(product.viewCount || 0);
        categoryMap.set(name, current);
      });

    return [...categoryMap.values()]
      .sort(
        (left, right) =>
          right.viewCount - left.viewCount ||
          right.machineCount - left.machineCount,
      )
      .slice(0, 5);
  }, [products, selectedMachineTypeOption, topCategories]);

  const relatedCategoryOptions = useMemo(() => {
    if (!selectedMachineTypeOption) return categoryOptions;

    const relatedCategoryIds = new Set(
      products
        .filter(
          (product) =>
            product.machineTypeKey === selectedMachineTypeOption.slug,
        )
        .map((product) => String(product.categoryId || ""))
        .filter(Boolean),
    );

    return categoryOptions.filter((category) =>
      relatedCategoryIds.has(String(category.id)),
    );
  }, [categoryOptions, products, selectedMachineTypeOption]);

  /* =================================================
       CHECK ACTIVE FILTER GROUP
    ================================================= */

  const hasCategoryFilter = Object.values(filters.categories).some(Boolean);

  const hasPowerFilter =
    filters.standard || filters.highPower || filters.heavyDuty;

  const hasPrecisionFilter = filters.subMicron || filters.standardPrecision;

  const hasAvailabilityFilter = filters.inStock || filters.customOrder;
  const normalizedSearch = appliedSearch.toLowerCase();
  const orderedProducts = useMemo(
    () => [...products].sort((left, right) => {
      const viewDifference = Number(right.viewCount || 0) - Number(left.viewCount || 0);
      return viewDifference || Number(right.id || 0) - Number(left.id || 0);
    }),
    [products],
  );

  /* =================================================
       FILTER PRODUCTS
    ================================================= */

  const filteredProducts = useMemo(() => {
    return orderedProducts
      .filter((product) => {
        const searchMatch =
          !normalizedSearch || product.searchText.includes(normalizedSearch);
        const categoryMatch =
          !selectedCategory || product.category === selectedCategory;
        const apiCategoryMatch =
          !hasCategoryFilter ||
          Boolean(
            filters.categories[
              String(product.categoryId || product.category?.id)
            ],
          );
        const machineTypeMatch =
          !selectedMachineTypeOption ||
          product.machineTypeKey === selectedMachineTypeOption.slug;

        /*
         * MACHINE TYPE
         */
        /*
         * POWER
         */
        const powerMatch = !hasPowerFilter || filters[product.power];

        /*
         * PRECISION
         */
        const precisionMatch =
          !hasPrecisionFilter || filters[product.precision];

        /*
         * AVAILABILITY
         */
        const availabilityMatch =
          !hasAvailabilityFilter || filters[product.availability];

        /*
         * Product must match
         * every active filter group
         */
        return (
          searchMatch &&
          machineTypeMatch &&
          categoryMatch &&
          apiCategoryMatch &&
          powerMatch &&
          precisionMatch &&
          availabilityMatch
        );
      });
  }, [
    orderedProducts,
    filters,
    hasCategoryFilter,
    hasPowerFilter,
    hasPrecisionFilter,
    hasAvailabilityFilter,
    normalizedSearch,
    selectedCategory,
    selectedMachineTypeOption,
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

          <h1>{productContext.title}</h1>

          <p>{productContext.description}</p>
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

            {/* CATEGORY */}

            <div className="filter-group">
              <h4>CATEGORY</h4>

              {relatedCategoryOptions.length ? (
                relatedCategoryOptions.map((category) => (
                  <label key={category.id}>
                    <input
                      type="checkbox"
                      checked={Boolean(filters.categories[String(category.id)])}
                      onChange={() => handleCategoryFilter(category.id)}
                    />

                    <span>{category.name}</span>
                  </label>
                ))
              ) : (
                <span className="product-filter-empty">
                  No categories available.
                </span>
              )}
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
            <form
              className="product-search"
              role="search"
              onSubmit={handleProductSearch}
            >
              <label
                className="product-search-label"
                htmlFor="product-search-input"
              >
                SEARCH PRODUCTS
              </label>
              <div className="product-search-controls">
                <input
                  id="product-search-input"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by product, model, or category"
                  aria-label="Search products"
                />
                <button type="submit">SEARCH</button>
                {appliedSearch && (
                  <button
                    type="button"
                    className="product-search-clear"
                    onClick={() => {
                      setSearchTerm("");
                      setAppliedSearch("");
                    }}
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </form>

            {popularCategories.length > 0 && (
              <section
                className="product-popular-categories"
                aria-label="Most viewed categories"
              >
                <div className="product-popular-heading">
                  <span>TOP CATEGORIES</span>
                  <strong>Most viewed by customers</strong>
                </div>
                <div className="product-popular-list">
                  <button
                    type="button"
                    className={`product-popular-category ${!selectedCategory ? "active" : ""}`}
                    onClick={() => setSelectedCategory("")}
                  >
                    All categories
                  </button>
                  {popularCategories.map((category) => (
                    <button
                      type="button"
                      className={`product-popular-category ${selectedCategory === category.name ? "active" : ""}`}
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <span>{category.name}</span>
                      <small>{category.viewCount} views</small>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* RESULT COUNT */}

            <div className="product-result-header">
              <span>
                SHOWING {filteredProducts.length} MATCHING MACHINES OF{" "}
                {totalMachines}
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

                      <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
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
                        {(product.specs || [])
                          .slice(0, 2)
                          .map(([label, value]) => (
                            <div className="product-spec" key={label}>
                              <span>{label}</span>

                              <strong>{value}</strong>
                            </div>
                          ))}
                      </div>

                      <button
                        type="button"
                        className="configure-button"
                        onClick={() =>
                          navigate(`/product/${product.id}`, {
                            state: { product },
                          })
                        }
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
                  {loading
                    ? "LOADING PRODUCTS..."
                    : loadError
                      ? "RETRY LOADING PRODUCTS"
                      : "LOAD MORE PRODUCTS"}
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
