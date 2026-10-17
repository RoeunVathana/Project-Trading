import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCachedJson } from "../../apiCache";
import "./Residentail.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const toMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const normalizeCategoryName = (value) => String(value || "")
  .replace(/[^a-z0-9]/gi, "")
  .toLowerCase();

const getCategoryName = (product, categories) => {
  if (typeof product.category === "string" && product.category.trim()) return product.category;
  if (product.category?.name) return product.category.name;
  if (product.categoryName) return product.categoryName;
  return categories.find((category) => Number(category.id) === Number(product.categoryId))?.name || "Huawei Smart Energy";
};

const getProductLink = (product) => {
  const category = normalizeCategoryName(product.category);
  if (category === "smartguard") return `/product-huawei/${product.id}/learn-more-smart-guard`;
  if (category === "smartenergycontroller") return `/product-huawei/${product.id}/learn-more-energy`;
  if (["smartstringess", "smartstringenergystorage"].includes(category)) return `/product-huawei/${product.id}/learn-more-string-ess`;
  return `/product-huawei/${product.id}/learn-more`;
};

const heroImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=88";

const fallbackProducts = [
  { title: "Smart Charger", description: "Drive with sun power", image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=1000&q=88", slug: "smart-charger" },
  { title: "Smart Guard", description: "Grid goes off, life goes on", image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1000&q=88", slug: "smart-guard" },
  { title: "SmartAssistant", description: "Your personal energy management assistant", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=88", slug: "smartassistant" },
  { title: "Smart String ESS", description: "Store more clean energy for every day", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=88", slug: "smart-string-ess" },
  { title: "Smart Energy Controller", description: "One system for a more resilient home", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&q=88", slug: "smart-energy-controller" },
];

const featureSlides = [
  { title: "Take Control, Anytime", description: "Home appliances continue to operate smoothly, as if no blackouts ever occurred.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=88" },
  { title: "Stay Warm, Always", description: "Rest assured in any climate, with a wider operating temperature range from -20°C to 55°C.", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=88" },
  { title: "Be Smart, Anywhere", description: "One-stop management for clear visibility of whole-home energy use.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2200&q=88" },
];

const servicePoints = [
  ["One Supplier", "More business opportunities, lower time costs"],
  ["One Solution", "Extremely quick and easy installation with less effort"],
  ["One Service Window", "Reliable digital management, stress-free O&M"],
];

const stories = [
  { title: "A Shining Home, A Shining Community", location: "Gnesta, Sweden", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=88" },
  { title: "Green Silesia, Green Needs", location: "Suszec, Silesian Voivodeship, Poland", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=88" },
  { title: "It's a New Rooftop for Energy", location: "Guandimiao Village, Kuzhuang Town, Henan Province, China", image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=88" },
];

const ArrowButton = ({ direction, label, onClick }) => (
  <button type="button" className={`residential-arrow residential-arrow--${direction}`} onClick={onClick} aria-label={label}>
    <span aria-hidden="true">{direction === "previous" ? "‹" : "›"}</span>
  </button>
);

const Residentail = () => {
  const [productStart, setProductStart] = useState(0);
  const [productSlideDirection, setProductSlideDirection] = useState("next");
  const [productSlideKey, setProductSlideKey] = useState(0);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [featureSlideDirection, setFeatureSlideDirection] = useState("next");
  const [featureSlideKey, setFeatureSlideKey] = useState(0);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const feature = featureSlides[featureIndex];
  const products = catalogProducts.length ? catalogProducts : fallbackProducts;
  const visibleProducts = useMemo(() => (
    Array.from({ length: 3 }, (_, index) => products[(productStart + index) % products.length])
  ), [productStart, products]);

  useEffect(() => {
    let active = true;

    const loadHuaweiProducts = async () => {
      try {
        const [productResult, categoryResult, imageResult] = await Promise.all([
          fetchCachedJson(`${API_BASE_URL}/api/huawei`),
          fetchCachedJson(`${API_BASE_URL}/api/huawei-categories`),
          fetchCachedJson(`${API_BASE_URL}/api/huawei-product-images`),
        ]);
        if (!active) return;

        const productRows = Array.isArray(productResult?.data) ? productResult.data : [];
        const categories = Array.isArray(categoryResult?.data) ? categoryResult.data : [];
        const imageRows = Array.isArray(imageResult?.data) ? imageResult.data : [];
        const productsById = new Map();

        imageRows.forEach((image) => {
          const key = String(image.productId);
          const images = productsById.get(key) || [];
          images.push(image);
          productsById.set(key, images);
        });

        const normalizedProducts = productRows
          .filter((product) => String(product.status || "PUBLISHED").toUpperCase() === "PUBLISHED")
          .map((product, index) => {
            const images = (productsById.get(String(product.id)) || [])
              .slice()
              .sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0));
            const primaryImage = images.find((image) => image.isPrimary) || images[0];
            const category = getCategoryName(product, categories);

            return {
              id: product.id,
              title: product.productName || product.name || product.modelCode || category,
              description: product.shortDescription || product.description || category,
              image: toMediaUrl(primaryImage?.imageUrl) || fallbackProducts[index % fallbackProducts.length].image,
              category,
              model: product.modelCode || product.model || "",
            };
          });

        setCatalogProducts(normalizedProducts);
      } catch {
        // Keep the local cards visible if the public Huawei catalog is unavailable.
      } finally {
        if (active) setProductLoading(false);
      }
    };

    loadHuaweiProducts();
    return () => {
      active = false;
    };
  }, []);

  const changeProduct = (amount) => {
    setProductSlideDirection(amount > 0 ? "next" : "previous");
    setProductStart((current) => (current + amount + products.length) % products.length);
    setProductSlideKey((current) => current + 1);
  };

  const changeFeature = (amount) => {
    setFeatureSlideDirection(amount > 0 ? "next" : "previous");
    setFeatureIndex((current) => (current + amount + featureSlides.length) % featureSlides.length);
    setFeatureSlideKey((current) => current + 1);
  };

  return (
    <main className="residential-page">
      <section className="residential-hero" style={{ "--residential-hero-image": `url("${heroImage}")` }}>
        <div className="residential-hero-copy">
          <div className="residential-brand"><span aria-hidden="true">⌁</span> FusionSolar</div>
          <h1>Residential Smart PV &amp; ESS</h1>
          <p>A home that always shines</p>
          <Link className="residential-outline-button" to="/contact">Contact Us</Link>
        </div>
      </section>

      <section className="residential-intro residential-container">
        <p className="residential-intro-copy">FusionSolar Residential Smart PV &amp; ESS provides a one-fits-all solution from power generation, storage, to charging and power consumption. We always maximize efficiency and safety to power more households for a better, smarter, and more sustainable future.</p>
        <div className="residential-metrics">
          <div><strong>4.2</strong><span>Million Homes</span></div>
          <div><strong>170</strong><span>Countries</span></div>
        </div>
      </section>

      <section className="residential-statement residential-container"><p>Shine on</p><h2>Full Journey <span>Convenience</span></h2></section>

      <section className="residential-service residential-container">
        <div className="residential-service-list">
          {servicePoints.map(([title, description]) => (
            <article key={title}><h3>{title}</h3><p>{description}</p></article>
          ))}
        </div>
        <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=88" alt="Solar panels generating clean energy" loading="lazy" />
      </section>

      <section className="residential-products residential-container" aria-labelledby="residential-products-title" aria-busy={productLoading}>
        <div className="residential-section-heading"><h2 id="residential-products-title">Products</h2><div className="residential-heading-rule" aria-hidden="true" /></div>
        <div className="residential-product-stage">
          <ArrowButton direction="previous" label="Previous products" onClick={() => changeProduct(-1)} />
          <div
            key={productSlideKey}
            className={`residential-product-grid residential-product-grid--${productSlideDirection}`}
          >
            {visibleProducts.map((product) => (
              <article className="residential-product-card" key={product.id || product.slug}>
                <div className="residential-product-image"><img src={product.image} alt={product.title} loading="lazy" /></div>
                <h3>{product.title}</h3><p>{product.description}</p>
                <Link to={product.id ? getProductLink(product) : `/product-huawei/${product.slug}`}>Learn more <span aria-hidden="true">›</span></Link>
              </article>
            ))}
          </div>
          <ArrowButton direction="next" label="Next products" onClick={() => changeProduct(1)} />
        </div>
        <Link className="residential-small-button" to="/product-huawei">View All Products</Link>
      </section>

      <section className="residential-statement residential-statement--compact residential-container"><p>Shine on</p><h2><span>Intelligent</span> Yield</h2></section>

      <section
        key={featureSlideKey}
        className={`residential-feature residential-feature--${featureSlideDirection}`}
        style={{ "--residential-feature-image": `url("${feature.image}")` }}
      >
        <div className="residential-feature-panel residential-container">
          <div><h2>{feature.title}</h2><p>{feature.description}</p></div>
          <div className="residential-feature-controls">
            <div className="residential-feature-progress" aria-label={`Feature ${featureIndex + 1} of ${featureSlides.length}`}>
              {featureSlides.map((slide, index) => <span key={slide.title} className={index === featureIndex ? "active" : ""} />)}
            </div>
            <ArrowButton direction="previous" label="Previous feature" onClick={() => changeFeature(-1)} />
            <ArrowButton direction="next" label="Next feature" onClick={() => changeFeature(1)} />
          </div>
        </div>
      </section>

      <section className="residential-statement residential-statement--compact residential-container"><p>Shine on</p><h2><span>Active</span> Safety</h2></section>

      <section className="residential-support residential-container">
        <h2>Keep Your Solar Shining</h2>
        <div className="residential-support-grid">
          <article><h3>Home Owners</h3><p>We offer extended services for solar homeowners, including technical support, device maintenance, and spare parts replacement.</p><div><Link to="/contact">Maintenance Service ›</Link><Link to="/contact">Find an Installer ›</Link></div></article>
          <article><h3>Installers</h3><p>Join Huawei&apos;s Smart PV Community for specialized support as a solar PV installer. Access resources, courses, and training opportunities.</p><div><Link to="/resources">Installers Community ›</Link><Link to="/resources">Downloads ›</Link><Link to="/distribution">Find a Distributor ›</Link></div></article>
        </div>
      </section>

      <section className="residential-stories residential-container" aria-labelledby="residential-stories-title">
        <h2 id="residential-stories-title">Successful Stories</h2>
        <div className="residential-story-grid">
          {stories.map((story) => <article key={story.title}><img src={story.image} alt={story.title} loading="lazy" /><h3>{story.title}</h3><p>{story.location}</p></article>)}
        </div>
        <button type="button" className="residential-small-button">More Stories</button>
      </section>

      <section className="residential-final" style={{ "--residential-final-image": `url("${heroImage}")` }}>
        <div><h2>A Home that Always Shines</h2><Link className="residential-outline-button" to="/contact">Contact Us</Link></div>
      </section>
    </main>
  );
};

export default Residentail;
