import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ProductHuawei.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const toMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const formatFileSize = (value) => {
  const size = Number(value);
  if (!Number.isFinite(size) || size < 0) return "—";
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toISOString().slice(0, 10);
};

const getCategoryName = (product, categories) => {
  if (typeof product.category === "string" && product.category.trim()) return product.category;
  if (product.category?.name) return product.category.name;
  if (product.categoryName) return product.categoryName;
  return categories.find((category) => Number(category.id) === Number(product.categoryId))?.name || "Uncategorized";
};

const normalizeCategoryName = (category) => {
  const categoryName = typeof category === "object" ? category?.name || category?.slug : category;
  return String(categoryName || "").replace(/[^a-z0-9]/gi, "").toLowerCase();
};

const isSmartModuleCategory = (categoryName) => normalizeCategoryName(categoryName)
  === "smartmodulecontroller";

const isSmartEnergyCategory = (categoryName) => normalizeCategoryName(categoryName)
  === "smartenergycontroller";

const isSmartStringESSCategory = (categoryName) => ["smartstringess", "smartstringenergystorage"]
  .includes(normalizeCategoryName(categoryName));

const getLearnMorePath = (product) => {
  const categoryValues = [
    product.category,
    product.categoryName,
    product.categorySlug,
    product.category?.slug,
  ];
  if (categoryValues.some(isSmartModuleCategory)) return `/product-huawei/${product.id}/learn-more`;
  if (categoryValues.some(isSmartEnergyCategory)) return `/product-huawei/${product.id}/learn-more-energy`;
  if (categoryValues.some(isSmartStringESSCategory)) return `/product-huawei/${product.id}/learn-more-string-ess`;
  return "";
};

const normalizeHuaweiProduct = (product, categories = [], imageRows = [], pdfRows = []) => {
  const images = imageRows
    .filter((image) => Number(image.productId) === Number(product.id))
    .sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0));
  const primaryImage = images.find((image) => image.isPrimary) || images[0];
  const imageAltText = primaryImage?.altText || primaryImage?.alt_text || "";
  const gallery = images.map((image) => ({
    ...image,
    imageUrl: toMediaUrl(image.imageUrl),
  })).filter((image) => image.imageUrl);
  const productPdfs = pdfRows
    .filter((pdf) => Number(pdf.productId) === Number(product.id) && pdf.isPublished !== false)
    .map((pdf) => ({ ...pdf, filePath: toMediaUrl(pdf.filePath) }));
  const categoryName = getCategoryName(product, categories);
  const categoryRecord = product.category && typeof product.category === "object"
    ? product.category
    : categories.find((category) => Number(category.id) === Number(product.categoryId));

  return {
    ...product,
    id: product.id ?? product.productId,
    name: product.productName || product.name || product.modelCode,
    model: product.modelCode || product.model || "—",
    category: categoryName,
    categorySlug: categoryRecord?.slug || "",
    displayCategory: categoryName,
    imageAltText,
    image: toMediaUrl(primaryImage?.imageUrl),
    gallery,
    pdfs: productPdfs,
    description: product.description || product.shortDescription || "",
    specs: [
      ["BRAND", product.brandName || "Huawei"],
      ["STATUS", product.status || "PUBLISHED"],
    ],
  };
};

const fetchJson = async (path, signal) => {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to load Huawei products.");
  return result.data;
};

const HuaweiCatalog = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadCatalog = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [productRows, categoryRows, imageRows] = await Promise.all([
          fetchJson("/api/huawei", controller.signal),
          fetchJson("/api/huawei-categories", controller.signal),
          fetchJson("/api/huawei-product-images", controller.signal),
        ]);
        const safeCategories = Array.isArray(categoryRows) ? categoryRows : [];
        const safeImages = Array.isArray(imageRows) ? imageRows : [];
        const publicProducts = (Array.isArray(productRows) ? productRows : [])
          .filter((product) => String(product.status || "PUBLISHED").toUpperCase() === "PUBLISHED")
          .map((product) => normalizeHuaweiProduct(product, safeCategories, safeImages));
        setCategories(safeCategories.filter((category) => category.isActive !== false));
        setProducts(publicProducts);
      } catch (error) {
        if (error.name !== "AbortError") setLoadError(error.message || "Unable to load Huawei products.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadCatalog();
    return () => controller.abort();
  }, []);

  const categoriesWithProducts = useMemo(() => {
    return categories
      .filter((category) => category.isActive !== false && category.parentId !== null && category.parentId !== undefined)
      .sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0) || Number(left.id) - Number(right.id));
  }, [categories]);

  const popularCategories = useMemo(() => categoriesWithProducts
    .map((category) => ({
      ...category,
      productCount: products.filter((product) => Number(product.categoryId) === Number(category.id)).length,
    }))
    .sort((left, right) => right.productCount - left.productCount || Number(left.displayOrder) - Number(right.displayOrder)),
  [categoriesWithProducts, products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = appliedSearch.trim().toLowerCase();
    const activeCategoryIds = Object.keys(selectedCategories).filter((id) => selectedCategories[id]);
    return products.filter((product) => {
      const searchableText = [product.name, product.model, product.category, product.displayCategory, product.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const searchMatch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const categoryMatch = !activeCategoryIds.length || activeCategoryIds.includes(String(product.categoryId));
      return searchMatch && categoryMatch;
    });
  }, [appliedSearch, products, selectedCategories]);

  const toggleCategory = (categoryId) => {
    const key = String(categoryId);
    setSelectedCategories((current) => ({ ...current, [key]: !current[key] }));
  };

  const resetFilters = () => {
    setSelectedCategories({});
    setSearchTerm("");
    setAppliedSearch("");
  };

  return (
    <div className="product-page huawei-product-page">
      <section className="product-hero">
        <div className="product-hero-overlay" />
        <div className="product-hero-content">
          <div className="product-category"><span>//</span> CATEGORY</div>
          <h1>PRODUCT HUAWEI</h1>
          <p>Explore Huawei smart-energy solutions for residential, commercial, and industrial applications.</p>
        </div>
      </section>

      <section className="product-section">
        <div className="product-layout">
          <aside className="product-filter">
            <h3>FILTER PARAMETERS</h3>
            <div className="filter-group">
              <h4>HUAWEI CATEGORY</h4>
              {categoriesWithProducts.length ? categoriesWithProducts.map((category) => (
                <label key={category.id}>
                  <input
                    type="checkbox"
                    checked={Boolean(selectedCategories[String(category.id)])}
                    onChange={() => toggleCategory(category.id)}
                  />
                  <span>{category.name}</span>
                </label>
              )) : <span className="product-filter-empty">No categories available.</span>}
            </div>
            <button type="button" className="reset-filter-button" onClick={resetFilters}>RESET FILTERS</button>
            <div className="technical-support">
              <h4>HUAWEI PRODUCT LIBRARY</h4>
              <p>Browse Huawei products and download the available product PDFs.</p>
              <button type="button" onClick={() => document.getElementById("huawei-product-search")?.focus()}>
                SEARCH LIBRARY <span aria-hidden="true">→</span>
              </button>
            </div>
          </aside>

          <div className="product-content">
            <form
              className="product-search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                setAppliedSearch(searchTerm.trim());
              }}
            >
              <label className="product-search-label" htmlFor="huawei-product-search">SEARCH HUAWEI PRODUCTS</label>
              <div className="product-search-controls">
                <input
                  id="huawei-product-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by product, model, or category"
                  aria-label="Search Huawei products"
                />
                <button type="submit">SEARCH</button>
                {appliedSearch && <button type="button" className="product-search-clear" onClick={() => { setSearchTerm(""); setAppliedSearch(""); }}>CLEAR</button>}
              </div>
            </form>

            {popularCategories.length > 0 && (
              <section className="product-popular-categories" aria-label="Huawei categories">
                <div className="product-popular-heading">
                  <span>HUAWEI CATEGORIES</span>
                  <strong>Browse by solution</strong>
                </div>
                <div className="product-popular-list">
                  <button type="button" className={`product-popular-category ${Object.values(selectedCategories).every((value) => !value) ? "active" : ""}`} onClick={() => setSelectedCategories({})}>All products</button>
                  {popularCategories.map((category) => (
                    <button
                      type="button"
                      className={`product-popular-category ${selectedCategories[String(category.id)] ? "active" : ""}`}
                      key={category.id}
                      onClick={() => setSelectedCategories({ [String(category.id)]: true })}
                    >
                      <span>{category.name}</span><small>{category.productCount} products</small>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div className="product-result-header">SHOWING {filteredProducts.length} MATCHING PRODUCTS OF {products.length}</div>

            {loading ? (
              <div className="no-products"><h3>LOADING HUAWEI PRODUCTS</h3><p>Fetching products from the Huawei catalog...</p></div>
            ) : filteredProducts.length ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image">
                      {product.status && <span className="product-badge">{product.status}</span>}
                      {product.image ? <img src={product.image} alt={product.name} /> : <div className="huawei-product-image-placeholder"><span>HUAWEI</span><strong>{product.model}</strong></div>}
                    </div>
                    <div className="product-card-body">
                      <div className="huawei-product-model">Model: {product.model}</div>
                      <div className="huawei-product-category">{product.displayCategory}</div>
                      <div className="huawei-product-actions">
                        <button type="button" disabled={!getLearnMorePath(product)} title={getLearnMorePath(product) ? "Open product details" : "Learn More is available for supported Huawei categories only"} onClick={() => { const path = getLearnMorePath(product); if (path) navigate(path, { state: { product } }); }}>Learn More <span aria-hidden="true">›</span></button>
                        <button type="button" onClick={() => navigate(`/product-huawei/${product.id}/downloads`, { state: { product } })}>Downloads <span aria-hidden="true">›</span></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-products"><h3>NO HUAWEI PRODUCTS FOUND</h3><p>Try changing your search or category filter.</p><button type="button" onClick={resetFilters}>RESET FILTERS</button></div>
            )}

            {loadError && <p className="product-load-error" role="alert">{loadError}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

const HuaweiProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(location.state?.product?.image || "");
  const [activeTab, setActiveTab] = useState(new URLSearchParams(location.search).get("tab") === "catalog" ? "catalog" : "overview");
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadProduct = async () => {
      setLoading(true);
      try {
        const [productRow, imageRows, pdfRows, productRows, categoryRows] = await Promise.all([
          fetchJson(`/api/huawei/${id}`, controller.signal),
          fetchJson("/api/huawei-product-images", controller.signal),
          fetchJson("/api/huawei-product-pdfs", controller.signal),
          fetchJson("/api/huawei", controller.signal),
          fetchJson("/api/huawei-categories", controller.signal),
        ]);
        const safeCategories = Array.isArray(categoryRows) ? categoryRows : [];
        const normalized = normalizeHuaweiProduct(productRow, safeCategories, imageRows || [], pdfRows || []);
        setProduct(normalized);
        setActiveImage(normalized.image || normalized.gallery[0]?.imageUrl || "");
        const allProducts = (Array.isArray(productRows) ? productRows : [])
          .filter((item) => String(item.status || "PUBLISHED").toUpperCase() === "PUBLISHED")
          .map((item) => normalizeHuaweiProduct(item, safeCategories, imageRows || []));
        setSimilarProducts(allProducts.filter((item) => String(item.id) !== String(id) && Number(item.categoryId) === Number(normalized.categoryId)).slice(0, 4));
      } catch (loadError) {
        if (loadError.name !== "AbortError") setError(loadError.message || "Unable to load this Huawei product.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadProduct();
    return () => controller.abort();
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    return [...new Set([product.image, ...(product.gallery || []).map((image) => image.imageUrl)].filter(Boolean))];
  }, [product]);

  if (loading && !product) return <div className="product-detail-loading huawei-product-detail">Loading Huawei product details...</div>;
  if (!product) return <div className="product-detail-not-found huawei-product-detail"><h1>PRODUCT NOT FOUND</h1><p>{error || "The requested Huawei product could not be found."}</p><button type="button" onClick={() => navigate("/product-huawei")}>BACK TO HUAWEI PRODUCTS</button></div>;

  const displayedImage = gallery.includes(activeImage) ? activeImage : gallery[0] || "";
  const activeGalleryIndex = Math.max(0, gallery.indexOf(displayedImage));
  const moveImage = (direction) => {
    if (gallery.length < 2) return;
    const nextIndex = direction === "next"
      ? (activeGalleryIndex + 1) % gallery.length
      : (activeGalleryIndex - 1 + gallery.length) % gallery.length;
    setActiveImage(gallery[nextIndex]);
  };

  return (
    <div className="product-detail-page huawei-product-detail">
      <div className="product-detail-breadcrumb">
        <button type="button" onClick={() => navigate("/")}>Home</button><span>›</span>
        <button type="button" onClick={() => navigate("/product-huawei")}>Product Huawei</button><span>›</span>
        <span>{product.category}</span><span>›</span><strong>{product.model}</strong>
      </div>

      <section className="product-detail-hero">
        <div className="product-detail-gallery">
          <div className="product-detail-main-image">
            {displayedImage ? <img src={displayedImage} alt={product.name} /> : <div className="huawei-detail-image-placeholder"><span>HUAWEI</span><strong>{product.model}</strong></div>}
            <span className="product-detail-zoom-hint">Huawei product image</span>
          </div>
          <div className="product-detail-thumbnails">
            <button type="button" className="gallery-arrow" onClick={() => moveImage("prev")} aria-label="Previous image" disabled={gallery.length < 2}>‹</button>
            <div className="thumbnail-list">
              {gallery.map((image, index) => <button type="button" key={`${image}-${index}`} className={displayedImage === image ? "thumbnail active" : "thumbnail"} onClick={() => setActiveImage(image)}><img src={image} alt={`${product.name} ${index + 1}`} /></button>)}
            </div>
            <button type="button" className="gallery-arrow" onClick={() => moveImage("next")} aria-label="Next image" disabled={gallery.length < 2}>›</button>
          </div>
        </div>

        <div className="product-detail-information">
          <div className="product-detail-label"><span /> HUAWEI SMART ENERGY SOLUTION</div>
          <h1>{product.name}</h1>
          <div className="product-detail-tags"><span>{product.brandName || "Huawei"}</span><span>{product.model}</span><span>{product.category}</span><span>{product.status || "PUBLISHED"}</span></div>
          <p className="product-detail-description">{product.description || `Explore the ${product.name} Huawei smart-energy solution.`}</p>
          <div className="product-detail-features">
            <div className="detail-feature"><strong>{product.brandName || "Huawei"}</strong><span>Brand</span></div>
            <div className="detail-feature"><strong>{product.model}</strong><span>Model code</span></div>
            <div className="detail-feature"><strong>{product.status || "PUBLISHED"}</strong><span>Catalog status</span></div>
          </div>
          <button type="button" className="product-detail-contact" onClick={() => navigate("/contact")}>Contact Us <span>→</span></button>
        </div>
      </section>

      <section className={`product-information ${activeTab === "catalog" ? "huawei-catalog-information" : ""}`} aria-labelledby="huawei-product-information-title">
        <div className="product-information-heading"><h2 id="huawei-product-information-title"><span aria-hidden="true" /> Product Information</h2></div>
        <div className="product-info-tabs" role="tablist" aria-label="Huawei product information">
          {[['overview', 'Overview'], ['catalog', 'PDF Library']].map(([tab, label]) => <button type="button" role="tab" key={tab} aria-selected={activeTab === tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{label}</button>)}
        </div>
        <div className="product-info-content">
          {activeTab === "overview" ? (
            <div className="product-info-overview" role="tabpanel">
              <h3>Product summary</h3>
              <div className="product-info-overview-grid">
                <section className="product-info-group"><h4>CATALOG INFORMATION</h4><ul><li><span className="product-info-item-label">Category</span>: {product.category}</li><li><span className="product-info-item-label">Model code</span>: {product.model}</li><li><span className="product-info-item-label">Brand</span>: {product.brandName || "Huawei"}</li><li><span className="product-info-item-label">Status</span>: {product.status || "PUBLISHED"}</li></ul></section>
                <section className="product-info-group"><h4>DESCRIPTION</h4><ul><li>{product.description || "No additional description is available for this product."}</li></ul></section>
              </div>
            </div>
          ) : (
            <div className="product-info-documents" role="tabpanel">
              {product.pdfs?.length ? <div className="product-document-table"><div className="product-document-row product-document-heading"><span>Name</span><span>Size</span><span>Uploaded</span><span>Operate</span></div>{product.pdfs.map((pdf) => <div className="product-document-row" key={pdf.id || pdf.filePath}><strong>{pdf.title || pdf.originalFileName}</strong><span>{formatFileSize(pdf.fileSizeBytes)}</span><span>{formatDate(pdf.uploadedAt)}</span><a href={pdf.filePath} target="_blank" rel="noreferrer" download>Download <span aria-hidden="true">↓</span></a></div>)}</div> : <div className="product-info-empty"><strong>No product PDFs available</strong><p>PDF documents uploaded for this product will appear here.</p></div>}
            </div>
          )}
        </div>
      </section>

      <section className="technical-specifications">
        <div className="technical-heading"><h2>Catalog Details</h2><p>Key information for the {product.model} Huawei product.</p></div>
        <div className="specification-table-wrapper has-specifications"><table className="specification-table"><thead><tr><th>FIELD</th><th>VALUE</th></tr></thead><tbody><tr><td>Product</td><td className="cyan-value">{product.name}</td></tr><tr><td>Model code</td><td className="cyan-value">{product.model}</td></tr><tr><td>Category</td><td className="cyan-value">{product.category}</td></tr><tr><td>PDF documents</td><td className="cyan-value">{product.pdfs?.length || 0}</td></tr></tbody></table></div>
      </section>

      {similarProducts.length > 0 && <section className="similar-products" aria-labelledby="huawei-similar-products-title"><div className="similar-products-heading"><h2 id="huawei-similar-products-title"><span aria-hidden="true" /> Similar Huawei Products</h2></div><div className="similar-products-grid">{similarProducts.map((similarProduct) => <article className="similar-product-card" key={similarProduct.id}><div className="similar-product-image">{similarProduct.image ? <img src={similarProduct.image} alt={similarProduct.name} /> : <div className="huawei-product-image-placeholder"><span>HUAWEI</span></div>}</div><div className="similar-product-copy"><span className="similar-product-category">{similarProduct.category}</span><h3>{similarProduct.name}</h3><span className="similar-product-model">{similarProduct.model}</span></div><div className="similar-product-actions"><button type="button" className="similar-product-view" onClick={() => navigate(`/product-huawei/${similarProduct.id}/learn-more`)}>View Details</button><button type="button" className="similar-product-documents" onClick={() => navigate(`/product-huawei/${similarProduct.id}/downloads`)}>PDF Library <span aria-hidden="true">↓</span></button></div></article>)}</div></section>}
    </div>
  );
};

const ProductHuawei = () => {
  const { id } = useParams();
  return id ? <HuaweiProductDetail /> : <HuaweiCatalog />;
};

export default ProductHuawei;
