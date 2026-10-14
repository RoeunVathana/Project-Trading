import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DataProduct from "./DataProduct";
import { groupSpecificationEntries, toSpecificationEntries } from "./specificationUtils";
import "./style/ProductDetail.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000")
  .replace(/\/$/, "");

const toMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const formatFileSize = (bytes) => {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size < 0) return "—";
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / (1024 * 1024)).toFixed(2)}MB`;
};

const formatReleaseTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toISOString().slice(0, 10);
};

const INFO_TABS = [
  ["overview", "Overview"],
  ["catalog", "Catalog"],
  ["manual", "Manual"],
  ["certificate", "Certificate"],
  ["drawing", "Drawing"],
  ["video", "Video"],
];

const normalizeApiProduct = (machine) => {
  const image = toMediaUrl(machine.image);
  const gallery = Array.isArray(machine.gallery)
    ? machine.gallery
        .map((item) => (typeof item === "string" ? item : item?.imageUrl))
        .map(toMediaUrl)
        .filter(Boolean)
    : [];
  const specificationEntries = toSpecificationEntries(machine.specs);
  const pdfs = Array.isArray(machine.pdfs)
    ? machine.pdfs.map((pdf) => ({
        ...pdf,
        filePath: toMediaUrl(pdf.filePath),
      }))
    : [];
  const specs = specificationEntries
    .map((entry) => [entry.label || entry.section, entry.value])
    .filter(([, value]) => value);

  return {
    ...machine,
    image,
    video: toMediaUrl(machine.video),
    gallery: [...new Set([image, ...gallery].filter(Boolean))],
    category: machine.category?.name || "UNCATEGORIZED",
    pdfs,
    specificationRows: specificationEntries,
    specificationEntries,
    specs,
  };
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const routeProduct = location.state?.product;

  const [apiProduct, setApiProduct] = useState(null);
  const [apiStatus, setApiStatus] = useState("loading");
  const [activeInfoTab, setActiveInfoTab] = useState("overview");
  const viewRequestRef = useRef("");

  useEffect(() => {
    if (!id || viewRequestRef.current === id) return undefined;
    viewRequestRef.current = id;

    const viewStorageKey = `efs-machine-view-${id}`;
    let shouldRecordView = true;

    try {
      const lastViewAt = Number(window.sessionStorage.getItem(viewStorageKey) || 0);
      shouldRecordView = !lastViewAt || Date.now() - lastViewAt > 2000;
    } catch {
      // Analytics should continue even when browser storage is unavailable.
    }

    if (!shouldRecordView) return undefined;

    fetch(`${API_BASE_URL}/api/machines/${id}/view`, {
      method: "POST",
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to record product view.");
        try {
          window.sessionStorage.setItem(viewStorageKey, String(Date.now()));
        } catch {
          // Analytics can still work when browser storage is unavailable.
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          // View analytics should never prevent customers from reading details.
        }
      });

    return undefined;
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE_URL}/api/machines/${id}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.data) {
          throw new Error(result.message || "Unable to load this product.");
        }
        let specs = Array.isArray(result.data.specs) ? result.data.specs : [];
        try {
          const specificationResponse = await fetch(
            `${API_BASE_URL}/api/machine-specs?machineId=${id}`,
            { signal: controller.signal },
          );
          const specificationResult = await specificationResponse.json();
          if (specificationResponse.ok && Array.isArray(specificationResult.data)) {
            specs = specificationResult.data;
          }
        } catch (specificationError) {
          if (specificationError.name === "AbortError") throw specificationError;
        }

        let pdfs = [];
        try {
          const pdfResponse = await fetch(
            `${API_BASE_URL}/api/machine-pdfs?machineId=${id}`,
            { signal: controller.signal },
          );
          const pdfResult = await pdfResponse.json();
          if (pdfResponse.ok && Array.isArray(pdfResult.data)) {
            pdfs = pdfResult.data;
          }
        } catch (pdfError) {
          if (pdfError.name === "AbortError") throw pdfError;
        }

        return { ...result.data, specs, pdfs };
      })
      .then((machine) => {
        setApiProduct(normalizeApiProduct(machine));
        setApiStatus("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setApiStatus("error");
      });

    return () => controller.abort();
  }, [id]);

  const fallbackProduct = DataProduct.find(
    (item) => String(item.id) === String(id),
  );
  const product = apiProduct || routeProduct || (apiStatus === "error" ? fallbackProduct : null);

  const [activeImage, setActiveImage] = useState(product?.image || "");

  const [animationDirection, setAnimationDirection] = useState("next");
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleImageMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  /* =========================================
       GALLERY
    ========================================= */

  const gallery = [product?.image, ...(product?.gallery || [])].filter(
    (image, index, images) => image && images.indexOf(image) === index,
  );

  /* =========================================
       RESET IMAGE WHEN PRODUCT CHANGES
    ========================================= */

  useEffect(() => {
    const resetTimer = window.setTimeout(() => {
      setActiveImage(product?.image || "");
      setAnimationDirection("next");
    }, 0);

    return () => window.clearTimeout(resetTimer);
  }, [product]);

  /* =========================================
       PRODUCT NOT FOUND
    ========================================= */

  if (!product && apiStatus === "loading") {
    return (
      <div className="product-detail-loading" role="status">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-not-found">
        <h1>PRODUCT NOT FOUND</h1>

        <p>The requested industrial machine could not be found.</p>

        <button type="button" onClick={() => navigate("/product")}>
          BACK TO PRODUCTS
        </button>
      </div>
    );
  }

  /* =========================================
       PREVIOUS IMAGE
    ========================================= */

  const handlePreviousImage = () => {
    const currentIndex = gallery.indexOf(activeImage);

    const previousIndex =
      currentIndex <= 0 ? gallery.length - 1 : currentIndex - 1;

    setAnimationDirection("prev");

    setActiveImage(gallery[previousIndex]);
  };

  /* =========================================
       NEXT IMAGE
    ========================================= */

  const handleNextImage = () => {
    const currentIndex = gallery.indexOf(activeImage);

    const nextIndex = currentIndex >= gallery.length - 1 ? 0 : currentIndex + 1;

    setAnimationDirection("next");

    setActiveImage(gallery[nextIndex]);
  };

  /* =========================================
       THUMBNAIL
    ========================================= */

  const handleThumbnailClick = (image) => {
    const currentIndex = gallery.indexOf(activeImage);

    const newIndex = gallery.indexOf(image);

    setAnimationDirection(newIndex > currentIndex ? "next" : "prev");

    setActiveImage(image);
  };

  const displaySpecificationEntries = product.specificationEntries?.length
    ? product.specificationEntries
    : (product.specificationRows?.length
      ? product.specificationRows
      : (product.specs || []).map(([label, value], index) => ({
          id: `fallback-${index}`,
          section: "Electrical and Control Characteristics",
          label,
          value,
          sortOrder: index,
        })));
  const groupedSpecificationEntries = groupSpecificationEntries(displaySpecificationEntries);
  const overviewSections = groupedSpecificationEntries.map((section) => ({
    title: section.title,
    items: section.items.flatMap((entry) => {
      const values = String(entry.value || "")
        .split(/\r?\n/)
        .map((value) => value.trim())
        .filter(Boolean);

      return values.map((value) => (
        entry.label ? `${entry.label}: ${value}` : value
      ));
    }),
  }));
  const productDocuments = Array.isArray(product.pdfs) ? product.pdfs : [];
  const visibleDocuments = activeInfoTab === "catalog"
    ? productDocuments
    : productDocuments.filter((document) =>
        String(document.fileName || "").toLowerCase().includes(activeInfoTab),
      );

  return (
    <div className="product-detail-page">
      {/* =========================================
                BREADCRUMB
            ========================================= */}

      <div className="product-detail-breadcrumb">
        <button type="button" onClick={() => navigate("/")}>
          Home
        </button>

        <span>›</span>

        <button type="button" onClick={() => navigate("/product")}>
          Low Voltage Electrical
        </button>

        <span>›</span>

        <span>{product.category}</span>

        <span>›</span>

        <strong>{product.model}</strong>
      </div>

      {/* =========================================
                PRODUCT HERO
            ========================================= */}

      <section className="product-detail-hero">
        {/* =====================================
                    LEFT IMAGE
                ===================================== */}

        <div className="product-detail-gallery">
          <div
            className="product-detail-main-image"
            onMouseMove={handleImageMouseMove}
          >
            <img
              key={`${activeImage}-${animationDirection}`}
              src={activeImage}
              alt={product.name}
              className={`product-main-image-animated ${animationDirection}`}
            />
            <div className="product-detail-image-zoom" aria-hidden="true">
              <img
                src={activeImage}
                alt=""
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
              <span>IMAGE ZOOM</span>
            </div>
            <span className="product-detail-zoom-hint">Hover to zoom</span>
          </div>

          {/* =================================
                        THUMBNAILS
                    ================================= */}

          <div className="product-detail-thumbnails">
            {/* PREVIOUS */}

            <button
              type="button"
              className="gallery-arrow"
              onClick={handlePreviousImage}
              aria-label="Previous image"
            >
              ‹
            </button>

            {/* THUMBNAILS */}

            <div className="thumbnail-list">
              {gallery.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={
                    activeImage === image ? "thumbnail active" : "thumbnail"
                  }
                  onClick={() => handleThumbnailClick(image)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>

            {/* NEXT */}

            <button
              type="button"
              className="gallery-arrow"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        </div>

        {/* =====================================
                    PRODUCT INFORMATION
                ===================================== */}

        <div className="product-detail-information">
          <div className="product-detail-label">
            <span></span>
            NEXT GENERATION LOW VOLTAGE DISTRIBUTION
          </div>

          <h1>{product.name}</h1>

          {/* TAGS */}

          <div className="product-detail-tags">
            <span>Frame Size up to 6300A</span>

            <span>Breaking Icu 120kA</span>

            <span>LSIG Multi-protection</span>

            <span>IEC/EN 60947-2</span>
          </div>

          {/* DESCRIPTION */}

          <p className="product-detail-description">
            {product.description?.trim() || (
              <>
                Engineered for maximum reliability and versatile performance, the{" "}
                {product.name} series offers seamless switchboard integration.
                Featuring advanced LSIG multi-protection trip units and multiple
                mounting options, it delivers superior control for complex
                industrial power distribution systems.
              </>
            )}
          </p>

          {/* FEATURE CARDS */}

          <div className="product-detail-features">
            <div className="detail-feature">
              <strong>630A - 6300A</strong>

              <span>Rated Current (In)</span>
            </div>

            <div className="detail-feature">
              <strong>Up to 120 kA</strong>

              <span>Breaking Capacity</span>
            </div>

            <div className="detail-feature">
              <strong>IEC 60947-2</strong>

              <span>Industry Standard</span>
            </div>
          </div>

          {/* CONTACT */}

          <button
            type="button"
            className="product-detail-contact"
            onClick={() => navigate("/contact")}
          >
            Contact Us
            <span>→</span>
          </button>
        </div>
      </section>

      <section
        className={`product-information ${activeInfoTab === "video" ? "video-information" : ""}`}
        aria-labelledby="product-information-title"
      >
        <div className="product-information-heading">
          <h2 id="product-information-title">
            <span aria-hidden="true" />
            Product Information
          </h2>
        </div>

        <div className="product-info-tabs" role="tablist" aria-label="Product information">
          {INFO_TABS.map(([tabKey, label]) => (
            <button
              type="button"
              role="tab"
              key={tabKey}
              aria-selected={activeInfoTab === tabKey}
              className={activeInfoTab === tabKey ? "active" : ""}
              onClick={() => setActiveInfoTab(tabKey)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="product-info-content">
          {activeInfoTab === "overview" && (
            <div className="product-info-overview" role="tabpanel">
              <h3>Main Specifications</h3>
              <div className="product-info-overview-grid">
                {overviewSections.length ? overviewSections.map((section) => (
                  <section className="product-info-group" key={section.title}>
                    <h4>{section.title}</h4>
                    <ul>
                      {section.items.length ? section.items.map((item) => (
                        <li key={item}>{item}</li>
                      )) : <li>No information available.</li>}
                    </ul>
                  </section>
                )) : (
                  <p className="product-info-empty">No specification data available from the API.</p>
                )}
              </div>
            </div>
          )}

          {activeInfoTab !== "overview" && activeInfoTab !== "video" && (
            <div className="product-info-documents" role="tabpanel">
              {visibleDocuments.length ? (
                <div className="product-document-table">
                  <div className="product-document-row product-document-heading" role="row">
                    <span>Name</span>
                    <span>Size</span>
                    <span>Release time</span>
                    <span>Operate</span>
                  </div>
                  {visibleDocuments.map((document) => (
                    <div className="product-document-row" role="row" key={document.id || document.filePath}>
                      <strong>{document.fileName || "Product document"}</strong>
                      <span>{formatFileSize(document.fileSize)}</span>
                      <span>{formatReleaseTime(document.createdAt)}</span>
                      <a href={toMediaUrl(document.filePath)} target="_blank" rel="noreferrer" download>
                        Download <span aria-hidden="true">↓</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="product-info-empty">
                  <strong>No {activeInfoTab} documents available</strong>
                  <p>Documents uploaded for this product will appear here.</p>
                </div>
              )}
            </div>
          )}

          {activeInfoTab === "video" && (
            <div className="product-info-video" role="tabpanel">
              {product.video ? (
                <video controls src={toMediaUrl(product.video)}>
                  Your browser does not support video playback.
                </video>
              ) : (
                <div className="product-info-empty">
                  <strong>No product video available</strong>
                  <p>A video uploaded for this product will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================================
                TECHNICAL SPECIFICATIONS
            ========================================= */}

      <section className="technical-specifications">
        <div className="technical-heading">
          <h2>Technical Specifications</h2>

          <p>
            Comprehensive performance matrix for {product.model} configurations.
          </p>
        </div>

        <div
          className={`specification-table-wrapper ${
            displaySpecificationEntries.length ? "has-specifications" : "is-empty"
          }`}
        >
          <table className="specification-table">
            <thead>
              <tr>
                <th>SECTION</th>
                <th>SPECIFICATION</th>
                <th>VALUE</th>
              </tr>
            </thead>

            <tbody>
              {displaySpecificationEntries.length ? displaySpecificationEntries.map((entry, index) => (
                <tr key={`${entry.id || entry.label || "specification"}-${index}`}>
                  <td>{entry.section || "—"}</td>
                  <td>{entry.label || "—"}</td>
                  <td className="cyan-value">{entry.value || "—"}</td>
                </tr>
              )) : (
                <tr>
                  <td className="specification-empty" colSpan="3">No technical specifications available for this product.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
