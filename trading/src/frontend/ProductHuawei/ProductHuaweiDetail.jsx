import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchCachedJson } from "../apiCache";
import "./ProductHuaweiDetail.css";

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
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const getJson = async (path) => {
  const result = await fetchCachedJson(`${API_BASE_URL}${path}`);
  return result.data;
};

const ProductHuaweiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const routeProduct = location.state?.product || null;
  const [product, setProduct] = useState(routeProduct);
  const [image, setImage] = useState(routeProduct?.image || "");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(!routeProduct);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDownloadPage = async () => {
      setLoading(!routeProduct);
      setError("");
      try {
        const [productRow, imageRows, pdfRows] = routeProduct
          ? [routeProduct, [], await getJson("/api/huawei-product-pdfs")]
          : await Promise.all([
              getJson(`/api/huawei/${id}`),
              getJson("/api/huawei-product-images"),
              getJson("/api/huawei-product-pdfs"),
            ]);
        if (!active) return;
        const productImages = (Array.isArray(imageRows) ? imageRows : [])
          .filter((item) => Number(item.productId) === Number(id))
          .sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0));
        const primaryImage = productImages.find((item) => item.isPrimary) || productImages[0];
        const productDocuments = (Array.isArray(pdfRows) ? pdfRows : [])
          .filter((item) => Number(item.productId) === Number(id) && item.isPublished !== false)
          .map((item) => ({ ...item, filePath: toMediaUrl(item.filePath) }));

        setProduct(productRow);
        setImage(routeProduct?.image || toMediaUrl(primaryImage?.imageUrl));
        setDocuments(productDocuments);
      } catch (loadError) {
        if (active) setError(loadError.message || "Unable to load this Huawei product.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDownloadPage();
    return () => {
      active = false;
    };
  }, [id, routeProduct]);

  if (loading) {
    return <div className="huawei-download-state">Loading Huawei downloads...</div>;
  }

  if (!product) {
    return (
      <div className="huawei-download-state huawei-download-error">
        <h1>PRODUCT NOT FOUND</h1>
        <p>{error || "The requested Huawei product could not be found."}</p>
        <button type="button" onClick={() => navigate("/product-huawei")}>Back to Huawei products</button>
      </div>
    );
  }

  return (
    <main className="huawei-download-page">
      <div className="huawei-download-shell">
        <div className="huawei-download-image-wrap">
          {image ? (
            <img className="huawei-download-image" src={image} alt={product.productName || product.modelCode} />
          ) : (
            <div className="huawei-download-image-placeholder"><span>HUAWEI</span><strong>{product.modelCode}</strong></div>
          )}
        </div>

        <section className="huawei-download-panel" aria-labelledby="huawei-download-title">
          <h1 id="huawei-download-title">{product.productName || product.modelCode}</h1>
          <div className="huawei-download-model">Model: {product.modelCode || "—"}</div>

          <div className="huawei-download-list">
            {documents.length ? documents.map((document) => (
              <div className="huawei-download-row" key={document.id || document.filePath}>
                <strong>{document.title || document.originalFileName || "Product document"}</strong>
                <a href={document.filePath} target="_blank" rel="noreferrer" download>
                  <span aria-hidden="true">⇩</span> {formatFileSize(document.fileSizeBytes)}
                </a>
              </div>
            )) : (
              <div className="huawei-download-empty">No PDF documents are available for this product.</div>
            )}
          </div>

          <button type="button" className="huawei-download-more" onClick={() => navigate("/product-huawei")}>
            Download More
          </button>
        </section>
      </div>
    </main>
  );
};

export default ProductHuaweiDetail;
