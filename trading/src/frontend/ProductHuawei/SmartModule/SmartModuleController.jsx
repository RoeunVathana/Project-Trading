import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getHuaweiNavbarImage } from "../productAssets";
import "./SmartModuleController.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const toMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const getJson = async (path, signal) => {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to load Huawei product.");
  return result.data;
};

const fallbackProduct = {
  category: "Smart Module Controller",
  productName: "Smart Module Controller",
  modelCode: "SUN2000 Series",
  description: "Smart module control for dependable Huawei solar-energy performance.",
  image: "",
  images: [],
};

const benefitCards = [
  { title: "Higher Yields", description: "Improve power generation and make better use of every solar panel.", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85" },
  { title: "Active Safety", description: "Monitor the system and respond quickly to abnormal operating conditions.", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=85" },
  { title: "Flexible Design", description: "Support flexible solar panel layouts across available rooftop space.", image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=85" },
  { title: "Terminal Over-temperature Detection", description: "Detect overheating early and help protect the installation.", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=85" },
  { title: "Smart O&M", description: "View product status and power generation through smart monitoring.", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=85" },
  { title: "High Quality", description: "Designed for dependable operation in challenging environments.", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=85" },
];

const featureCards = [
  ["⌁", "Module-level Optimization", "Each solar panel works independently, unaffected by other panels."],
  ["▦", "Enhanced Installation Capacity", "More solar panels can be installed."],
  ["✧", "Flexible Design", "Solar panels can be installed in different orientations."],
  ["ϟ", "Rapid Shutdown", "In case of danger, the high-voltage rooftop can quickly transition to a safe state."],
  ["▱", "Power Generation Monitoring", "Real-time monitoring of solar panel power generation status through the FusionSolar app."],
  ["⌾", "Fault Detection", "Prompt detection and timely repair of faulty solar panels."],
  ["▦", "Quick Generation of Physical Layout Diagrams", "Quickly generate layout diagrams by scanning the QR code during on-site installation, saving more time."],
  ["210+", "Compatibility with the 210 mm modules*", "Compatible with the majority of solar panels available in the market."],
  ["⌁", "Support for long-string design", "Enable larger string capacity with fewer strings."],
];

const SmartModuleController = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const solutionId = new URLSearchParams(location.search).get("solution") || "residential-solution";
  const navbarProductImage = getHuaweiNavbarImage("smart-module-controller", solutionId);
  const navbarModel = solutionId === "commercial-industrial-solutions"
    ? "MERC-1100/1300W-P"
    : "SUN2000-600W-PA0";
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const [productRow, imageRows, categoryRows] = await Promise.all([
          getJson(`/api/huawei/${id}`, controller.signal),
          getJson("/api/huawei-product-images", controller.signal),
          getJson("/api/huawei-categories", controller.signal),
        ]);
        const productId = productRow.id || id;
        const images = (Array.isArray(imageRows) ? imageRows : [])
          .filter((image) => Number(image.productId) === Number(productId))
          .sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0));
        const primaryImage = images.find((image) => image.isPrimary) || images[0];
        const imageAltText = primaryImage?.altText || primaryImage?.alt_text || "";
        const category = productRow.category?.name
          || (Array.isArray(categoryRows) ? categoryRows.find((item) => Number(item.id) === Number(productRow.categoryId))?.name : "")
          || "Huawei Smart Energy";

        setProduct({
          ...productRow,
          category,
          modelCode: productRow.modelCode || navbarModel,
          imageAltText,
          image: toMediaUrl(productRow.baseImageUrl || productRow.base_image_url || primaryImage?.imageUrl) || navbarProductImage,
          images: images.map((image) => ({
            ...image,
            imageUrl: toMediaUrl(image.imageUrl),
          })),
        });
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          if (id === "smart-module-controller") {
            setProduct({ ...fallbackProduct, modelCode: navbarModel, image: navbarProductImage });
          } else {
            setError(loadError.message || "Unable to load this Huawei product.");
          }
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProduct();
    return () => controller.abort();
  }, [id, navbarModel, navbarProductImage]);

  useEffect(() => {
    const elements = document.querySelectorAll(".smart-module-page [data-scroll-reveal]");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [product]);

  if (loading) return <div className="smart-module-state">Loading Huawei product...</div>;
  if (!product) {
    return (
      <div className="smart-module-state">
        <h1>PRODUCT NOT FOUND</h1>
        <p>{error || "The requested Huawei product could not be found."}</p>
        <button type="button" onClick={() => navigate("/product-huawei")}>Back to Huawei products</button>
      </div>
    );
  }

  const title = product.category || "Smart Module Controller";
  const productName = product.productName || title;
  const model = product.modelCode || "—";
  const description = product.description || product.shortDescription || `The ${title} helps deliver dependable Huawei smart-energy performance for residential solar installations.`;
  const imageCards = product.images?.length
    ? product.images.map((image, index) => ({
      title: image.altText || image.alt_text || benefitCards[index]?.title || `${productName} image ${index + 1}`,
      description: image.description || benefitCards[index]?.description || "Product image description is not available.",
      image: image.imageUrl,
    }))
    : benefitCards;

  return (
    <main className="smart-module-page">
      <section className="smart-module-hero">
        <div className="smart-module-hero-image-wrap" data-scroll-reveal="left">
          {product.image ? <img src={product.image} alt={title} /> : <div className="smart-module-image-placeholder">HUAWEI</div>}
        </div>
        <div className="smart-module-hero-copy" data-scroll-reveal="right">
          <div className="smart-module-brand"><span aria-hidden="true">Ⅲ</span> FusionSolar</div>
          <h1>{title}</h1>
          <p className="smart-module-model">Model: {model}</p>
        </div>
      </section>

      <section className="smart-module-benefits smart-module-container" aria-label="Product benefits">
        {imageCards.map((card, index) => (
          <article
            className="smart-module-benefit-card"
            key={`${card.title}-${index}`}
            tabIndex="0"
            data-scroll-reveal
            style={{ "--reveal-delay": `${index * 70}ms`, backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.06) 68%), url(${card.image})` }}
          >
            <div className="smart-module-benefit-copy">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
            <span className="smart-module-benefit-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </article>
        ))}
      </section>

      <section className="smart-module-intro smart-module-container" data-scroll-reveal>
        <h2>More Energy,<br />Power All Your Appliances</h2>
        <p>{description} All your home appliances, lighting, central air conditioning, and heating, can be powered sufficiently after the installation of the Huawei {title}. Each panel can work to deliver their maximum power, unaffected by partial shading and module failure, and achieve accelerated power generation and higher yields<sup>1</sup>.</p>
      </section>

      <section className="smart-module-story smart-module-story-energy" data-scroll-reveal>
        <div className="smart-module-story-content smart-module-container">
          <div className="smart-module-stat"><span>Up to</span><strong>30<span>%</span></strong><small>*more power</small></div>
          <div className="smart-module-product-orbit">{product.image && <img src={product.image} alt="" />}</div>
        </div>
      </section>

      <section className="smart-module-story smart-module-story-panels" data-scroll-reveal="left">
        <div className="smart-module-story-copy smart-module-container">
          <h2>Solar Panels on<br />Every Side</h2>
          <p>Just make full use of your rooftop by installing solar panels in every available space and creating more green power. The {title} enables solar panels to operate independently without interfering with one another. This allows for flexible installation on the rooftop, fearless of shadows, and maximizes the utilization of the surface area.</p>
          <strong>An average increase of <b>30%</b><br />installation area</strong>
        </div>
      </section>

      <section className="smart-module-story smart-module-story-temperature" data-scroll-reveal="right">
        <div className="smart-module-story-copy smart-module-container">
          <h2>Temperature Protection<br />with Precision</h2>
          <p>The leading-edge terminal over-temperature detection technology ensures safety by accurately identifying overheating. It instantly triggers alarms or system shutdown to prevent fault escalation and eliminate risks of property damage.</p>
        </div>
      </section>

      <section className="smart-module-story smart-module-story-safety" data-scroll-reveal="left">
        <div className="smart-module-story-copy smart-module-container">
          <h2>Personnel &amp;<br />Property Safety,<br />First Priority</h2>
          <p>The Huawei {title} brings you a reassuringly ultimate safeguard. In any emergency, the inverter will be switched off instantly, or for any power outage, the rapid shutdown (RSD) of the module voltage will be activated to clear potential risks on a high-voltage rooftop for personnel and firefighting safety.</p>
        </div>
      </section>

      <section className="smart-module-story smart-module-story-maintenance" data-scroll-reveal="right">
        <div className="smart-module-story-copy smart-module-container">
          <h2>High Maintenance?<br />Never</h2>
          <p>The FusionSolar app allows you to instantly view the location and power generation status of the solar panels. In case of any malfunction, precise repairs can be carried out, reducing operational and installation costs, and improving overall efficiency.</p>
        </div>
      </section>

      <section className="smart-module-story smart-module-story-quality" data-scroll-reveal="left">
        <div className="smart-module-story-copy smart-module-container">
          <h2>High Quality<br />Stay Powerful in<br />All Weathers</h2>
          <p>Harsh environments and climates, including high temperatures, snow, sandstorms, and rainstorms, are no longer concerns. The Huawei {title} endures all the extremes and stands the test of time.</p>
        </div>
      </section>

      <section className="smart-module-features smart-module-container" data-scroll-reveal>
        <h2>Product Features</h2>
        <div className="smart-module-feature-grid">
          {featureCards.map(([icon, featureTitle, featureDescription], featureIndex) => (
            <article className="smart-module-feature-card" key={featureTitle} data-scroll-reveal style={{ "--reveal-delay": `${featureIndex * 70}ms` }}>
              <div className="smart-module-feature-icon" aria-hidden="true">{icon}</div>
              <h3>{featureTitle}</h3>
              <p>{featureDescription}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="smart-module-final-story" data-scroll-reveal="right">
        <div className="smart-module-final-copy smart-module-container">
          <h2>A Home that Always Shines.</h2>
          <p>FusionSolar Residential delivers clean energy for homes around the world, helping families create a brighter and more sustainable future.</p>
        </div>
      </section>
    </main>
  );
};

export default SmartModuleController;
