import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataProduct from "./DataProduct";
import "./style/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = DataProduct.find((item) => String(item.id) === String(id));

  const [activeImage, setActiveImage] = useState(product?.image || "");

  const [animationDirection, setAnimationDirection] = useState("next");

  /* =========================================
       GALLERY
    ========================================= */

  const gallery = product?.gallery?.length
    ? product.gallery
    : [product?.image].filter(Boolean);

  /* =========================================
       RESET IMAGE WHEN PRODUCT CHANGES
    ========================================= */

  useEffect(() => {
    setActiveImage(product?.image || "");
    setAnimationDirection("next");
  }, [product]);

  /* =========================================
       PRODUCT NOT FOUND
    ========================================= */

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
          <div className="product-detail-main-image">
            <img
              key={`${activeImage}-${animationDirection}`}
              src={activeImage}
              alt={product.name}
              className={`product-main-image-animated ${animationDirection}`}
            />
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
            Engineered for maximum reliability and versatile performance, the{" "}
            {product.name} series offers seamless switchboard integration.
            Featuring advanced LSIG multi-protection trip units and multiple
            mounting options, it delivers superior control for complex
            industrial power distribution systems.
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

        <div className="specification-table-wrapper">
          <table className="specification-table">
            <thead>
              <tr>
                <th>FRAME VARIATION</th>
                <th>RATED CURRENT (IN)</th>
                <th>VOLTAGE (UE)</th>
                <th>ICU / ICS (KA)</th>
                <th>POLES</th>
                <th>MOUNTING</th>
                <th>TRIP UNIT</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>NXA16</td>

                <td>630A - 1600A</td>

                <td>AC380/400/415V</td>

                <td className="cyan-value">50 / 50</td>

                <td>3P / 4P</td>

                <td>Fixed / Draw-out</td>

                <td>2.0 / 3.0 / 5.0 (LSIG)</td>
              </tr>

              <tr>
                <td>NXA20 - NXA32</td>

                <td>2000A - 3200A</td>

                <td>AC380/400/415/690V</td>

                <td className="cyan-value">80 / 80</td>

                <td>3P / 4P</td>

                <td>Fixed / Draw-out</td>

                <td>2.0 / 3.0 / 5.0 (LSIG)</td>
              </tr>

              <tr>
                <td>NXA40 - NXA63</td>

                <td>4000A - 6300A</td>

                <td>AC380/400/415/690V</td>

                <td className="cyan-value">100 / 120</td>

                <td>3P / 4P</td>

                <td>Fixed / Draw-out</td>

                <td>2.0 / 3.0 / 5.0 (LSIG)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
