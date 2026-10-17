import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCachedJson } from "../../apiCache";
import "./HuaweiShowcase.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const fallbackImages = [
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2400&q=88",
  "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2400&q=88",
  "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=2200&q=88",
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2200&q=88",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2200&q=88",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2200&q=88",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=88",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=2400&q=88",
];

const categoryConfigs = {
  "smart-guard": {
    label: "Smart Guard",
    fallbackModel: "SmartGuard-63A-S0/AUS0",
    heroImage: fallbackImages[0],
    allocationImage: fallbackImages[7],
    allocationTitle: "Intelligent Allocation",
    allocationCopy: "The intelligent allocation system prioritizes essential appliances automatically, helping your home stay comfortable and powered through changing grid conditions.",
    cards: [
      ["Whole Home Backup", "From partial to whole home support", fallbackImages[1]],
      ["Enduring Backup", "Keep essential loads protected", fallbackImages[2]],
      ["Bypass Switch", "A secure backup path when you need it", fallbackImages[3]],
      ["Easy Installation", "Integrated control with minimal circuit modification", fallbackImages[4]],
      ["Built-in SmartAssistant", "More intelligent scheduling for everyday loads", fallbackImages[5]],
      ["Seamless Switch", "Switch to backup power faster than a blink", fallbackImages[6]],
    ],
    features: [
      ["Highly Integrated for Easy Installation", "Say no to tedious assembling. Smart Guard combines communication, measurement, and management functions in one compact box.", fallbackImages[4]],
      ["Whole Home Power Backup, We’ve Got You Covered.", "Support essential and whole-home loads with a smooth transition between grid power and solar backup.", fallbackImages[1]],
      ["Bypass Mode for More Secure Backup", "A spare bypass path provides a dependable backup experience even when the main contactor needs service.", fallbackImages[3]],
      ["Built-in SmartAssistant, for More Intelligent Scheduling", "View and schedule appliance priorities through a clear energy management experience.", fallbackImages[5]],
      ["Seamless Switch, Faster than a Blink", "Keep household appliances working as if no blackout occurred with an ultra-fast switchover.", fallbackImages[6]],
    ],
    finalTitle: "A Home that Always Shines",
    finalCopy: "FusionSolar Residential delivers clean energy for homes around the world, helping families create a brighter and more sustainable future.",
  },
  "smart-string-ess": {
    label: "Smart String ESS",
    fallbackModel: "LUNA S1",
    heroImage: fallbackImages[0],
    allocationImage: fallbackImages[4],
    allocationTitle: "Charge and Discharge, Faster than You’ve Ever Expected",
    allocationCopy: "Independent module-level management enables fast charge and discharge for an efficient, dependable energy storage experience.",
    cards: [
      ["Reliable Cells", "Top-notch LFP cells for dependable energy storage", fallbackImages[2]],
      ["Active Safety", "Protection from cell level to system level", fallbackImages[3]],
      ["Against Crush, with Poise", "A high-strength cabinet built for demanding environments", fallbackImages[4]],
      ["Cell-level Management", "Real-time temperature and battery data analysis", fallbackImages[5]],
      ["Intelligent Fire Suppression", "Fast response for safer home energy storage", fallbackImages[6]],
      ["Smart Energy Management", "See energy flow, storage, and consumption clearly", fallbackImages[7]],
    ],
    features: [
      ["5-layer Protection, Well-considered for All", "Cell, electrical, structural, active, and emergency protection work together to safeguard the storage system.", fallbackImages[2]],
      ["More Energy, More Confidence", "High-performance storage helps make more green energy available whenever your home needs it.", fallbackImages[3]],
      ["Cell-level Management", "Real-time battery information supports stable operation and early warnings around the clock.", fallbackImages[4]],
      ["Active Pressure Release Protection", "Enhanced emergency protection helps reduce combustion risks from the very first second.", fallbackImages[5]],
      ["In the Know, On the Go", "FusionSolar provides a clear view of yields, storage, consumption, and plant operations.", fallbackImages[7]],
    ],
    finalTitle: "Energy that Moves with You",
    finalCopy: "Store more clean energy and make every day at home more resilient, efficient, and comfortable.",
  },
  "smart-module-controller": {
    label: "Smart Module Controller",
    fallbackModel: "SUN2000 Series",
    heroImage: fallbackImages[0],
    allocationImage: fallbackImages[0],
    allocationTitle: "More Energy, Power All Your Appliances",
    allocationCopy: "Each panel can work independently to deliver maximum power, even when partial shading or module failure affects the rooftop.",
    cards: [
      ["Higher Yields", "Make better use of every solar panel", fallbackImages[0]],
      ["Active Safety", "Monitor the system and respond quickly", fallbackImages[3]],
      ["Flexible Design", "Install panels in different orientations", fallbackImages[2]],
      ["Temperature Protection", "Detect overheating before faults escalate", fallbackImages[4]],
      ["Smart O&M", "View status and power generation remotely", fallbackImages[5]],
      ["High Quality", "Dependable operation in challenging environments", fallbackImages[6]],
    ],
    features: [
      ["Solar Panels on Every Side", "Use every available rooftop space with independent module operation that is less affected by shadows.", fallbackImages[2]],
      ["Temperature Protection with Precision", "Terminal over-temperature detection identifies overheating quickly and helps prevent fault escalation.", fallbackImages[4]],
      ["Personnel & Property Safety, First Priority", "Rapid shutdown helps clear potential risks on a high-voltage rooftop for people and firefighters.", fallbackImages[3]],
      ["High Maintenance? Never", "FusionSolar makes it easier to view panel status and carry out precise repairs when needed.", fallbackImages[5]],
      ["High Quality, Stay Powerful in All Weathers", "The controller is designed to keep working through high temperatures, snow, sandstorms, and rainstorms.", fallbackImages[6]],
    ],
    finalTitle: "Solar Power, Made More Powerful",
    finalCopy: "Better module-level control turns more sunlight into dependable energy for homes and businesses.",
  },
  "smart-energy-controller": {
    label: "Smart Energy Controller",
    fallbackModel: "SUN5000 Series",
    heroImage: fallbackImages[0],
    allocationImage: fallbackImages[7],
    allocationTitle: "Grid Goes Off, Life Goes On",
    allocationCopy: "Smart control keeps priority appliances running and coordinates solar, storage, and household loads for a more resilient home.",
    cards: [
      ["More Powerful", "Power more home appliances with a capable energy controller", fallbackImages[1]],
      ["Active Safety", "Intelligent protection for a stable system", fallbackImages[4]],
      ["Whole Home Backup", "Keep essential appliances running during outages", fallbackImages[2]],
      ["Intelligent Allocation", "Prioritize the loads that matter most", fallbackImages[3]],
      ["Expanded Storage", "Add storage as your energy needs grow", fallbackImages[6]],
      ["Future Ready", "A flexible foundation for a greener home", fallbackImages[7]],
    ],
    features: [
      ["Whole Home Power Backup, We’ve Got You Covered.", "Move from partial loads to whole-home support with a dependable controller for changing grid conditions.", fallbackImages[1]],
      ["Intelligent Allocation", "Automatically switch off less-demanding loads and keep power flowing to the appliances you prioritize.", fallbackImages[3]],
      ["Tried-and-Tested Reliability", "Designed to withstand dust, water jets, temperature changes, corrosion, and other demanding conditions.", fallbackImages[4]],
      ["Expanded Storage, Uninterrupted Energy", "Integrate storage whenever necessary to keep daytime solar energy available through nights and overcast days.", fallbackImages[6]],
      ["Backup Ready at All Times", "A whole-home backup solution powers up seamlessly when blackouts occur.", fallbackImages[7]],
    ],
    finalTitle: "A Home that Always Shines",
    finalCopy: "FusionSolar Residential delivers clean energy for homes around the world, helping families create a brighter and more sustainable future.",
  },
};

const genericCategoryConfigCache = new Map();

const normalizeCategory = (value) => String(value || "")
  .replace(/[^a-z0-9]/gi, "")
  .toLowerCase();

const toMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const getJson = async (path) => {
  const result = await fetchCachedJson(`${API_BASE_URL}${path}`);
  return result.data;
};

const getCategoryName = (product, categories, fallback) => {
  const productCategory = typeof product.category === "string"
    ? product.category
    : product.category?.name || product.category?.slug;

  return productCategory
    || product.categoryName
    || categories.find((category) => Number(category.id) === Number(product.categoryId))?.name
    || fallback;
};

const isProductInCategory = (product, categories, categorySlug) => {
  const category = typeof product.category === "object" ? product.category : null;
  const categoryRecord = categories.find((item) => Number(item.id) === Number(product.categoryId));
  const values = [
    product.category,
    product.categoryName,
    product.categorySlug,
    category?.name,
    category?.slug,
    categoryRecord?.name,
    categoryRecord?.slug,
  ];

  return values.some((value) => normalizeCategory(value) === normalizeCategory(categorySlug));
};

const toCategoryLabel = (categorySlug) => String(categorySlug || "Huawei product")
  .split("-")
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

const getConfig = (categorySlug) => {
  if (categoryConfigs[categorySlug]) return categoryConfigs[categorySlug];
  if (genericCategoryConfigCache.has(categorySlug)) return genericCategoryConfigCache.get(categorySlug);

  const baseConfig = categoryConfigs["smart-module-controller"];
  const label = toCategoryLabel(categorySlug);
  const config = {
    ...baseConfig,
    label,
    fallbackModel: "Huawei product",
    allocationTitle: `${label} for a More Connected Home`,
    allocationCopy: `Explore the ${label} solution and its role in a dependable Huawei smart-energy system.`,
    finalTitle: `${label}, Designed for Tomorrow`,
    finalCopy: `Discover a more connected, efficient, and dependable energy experience with Huawei ${label}.`,
  };
  genericCategoryConfigCache.set(categorySlug, config);
  return config;
};

const HuaweiShowcase = ({ categorySlug = "smart-string-ess" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const config = getConfig(categorySlug);
  const isCategoryRoute = id === categorySlug;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const [productResult, imageResult, categoryResult, catalogResult] = await Promise.allSettled([
          getJson(`/api/huawei/${id}`),
          getJson("/api/huawei-product-images"),
          getJson("/api/huawei-categories"),
          isCategoryRoute ? getJson("/api/huawei") : Promise.resolve([]),
        ]);
        if (!active) return;

        const imageRows = imageResult.status === "fulfilled" && Array.isArray(imageResult.value)
          ? imageResult.value
          : [];
        const categoryRows = categoryResult.status === "fulfilled" && Array.isArray(categoryResult.value)
          ? categoryResult.value
          : [];
        let productRow = productResult.status === "fulfilled" ? productResult.value : null;

        if (!productRow && isCategoryRoute) {
          const catalogRows = catalogResult.status === "fulfilled" && Array.isArray(catalogResult.value)
            ? catalogResult.value
            : [];
          productRow = catalogRows
            .filter((item) => String(item.status || "PUBLISHED").toUpperCase() === "PUBLISHED")
            .find((item) => isProductInCategory(item, categoryRows, categorySlug));
        }

        if (!productRow && !isCategoryRoute) {
          const productError = productResult.status === "rejected" ? productResult.reason : null;
          throw productError || new Error("Unable to load this Huawei product.");
        }

        productRow = productRow || {
          productName: config.label,
          category: config.label,
          modelCode: config.fallbackModel,
          description: config.allocationCopy,
        };

        const productId = productRow.id || id;
      const images = imageRows
        .filter((image) => Number(image.productId) === Number(productId))
          .sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0))
          .map((image) => ({ ...image, imageUrl: toMediaUrl(image.imageUrl) }));
        const primaryImage = images.find((image) => image.isPrimary) || images[0];

        setProduct({
          ...productRow,
          category: getCategoryName(productRow, categoryRows, config.label),
          image: toMediaUrl(primaryImage?.imageUrl),
          images,
        });
      } catch (loadError) {
        if (!active) return;
        if (isCategoryRoute) {
          setProduct({
            productName: config.label,
            category: config.label,
            modelCode: config.fallbackModel,
            description: config.allocationCopy,
            image: "",
            images: [],
          });
        } else {
          setError(loadError.message || "Unable to load this Huawei product.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      active = false;
    };
  }, [categorySlug, config, id, isCategoryRoute]);

  useEffect(() => {
    const showcase = document.querySelector(".huawei-showcase");
    if (!showcase) return undefined;

    const elements = showcase.querySelectorAll("[data-showcase-reveal], [data-showcase-text-reveal]");
    const cards = showcase.querySelectorAll(".showcase-card");
    cards.forEach((card, index) => {
      card.style.setProperty("--showcase-delay", `${Math.min(index * 72, 360)}ms`);
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
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
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [product]);

  useEffect(() => {
    const showcase = document.querySelector(".huawei-showcase");
    if (!showcase || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const layers = showcase.querySelectorAll(".showcase-allocation, .showcase-feature, .showcase-final");
    let frameId = 0;

    const updateParallax = () => {
      frameId = 0;
      const viewportCenter = window.innerHeight / 2;
      layers.forEach((layer) => {
        const rect = layer.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

        const distance = viewportCenter - (rect.top + rect.height / 2);
        const offset = Math.max(-24, Math.min(24, distance * 0.045));
        layer.style.setProperty("--showcase-parallax", `${offset.toFixed(1)}px`);
      });
    };

    const onScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [product]);

  if (loading) return <div className="huawei-showcase-state">Loading Huawei product...</div>;
  if (!product) {
    return (
      <div className="huawei-showcase-state">
        <h1>PRODUCT NOT FOUND</h1>
        <p>{error || "The requested Huawei product could not be found."}</p>
        <button type="button" onClick={() => navigate("/product-huawei")}>Back to Huawei products</button>
      </div>
    );
  }

  const title = product.productName || config.label;
  const category = product.category || config.label;
  const model = product.modelCode || config.fallbackModel;
  const productImages = product.images || [];
  const getProductImage = (fallback, index = 0) => productImages[index]?.imageUrl || fallback;
  const heroImage = product.image || config.heroImage;

  return (
    <main className={`huawei-showcase huawei-showcase--${categorySlug}`} style={{ "--showcase-hero-image": `url("${config.heroImage}")` }}>
      <section className="showcase-hero" data-showcase-reveal>
        <div className="showcase-hero-media" data-showcase-reveal="left">
          <img src={heroImage} alt={title} />
        </div>
        <div className="showcase-hero-copy" data-showcase-reveal="right" data-showcase-text-reveal="group">
          <div className="showcase-brand">FusionSolar</div>
          <p className="showcase-category">{category}</p>
          <h1>{title}</h1>
          <p className="showcase-model">Model: {model} <span className="showcase-new-badge">NEW</span></p>
          <span className="showcase-accent-line" aria-hidden="true" />
        </div>
      </section>

      <section className="showcase-card-grid showcase-container" aria-label={`${category} highlights`}>
        {config.cards.map(([cardTitle, cardDescription, cardImage], index) => (
          <article
            className={`showcase-card${index === 0 ? " showcase-card--featured" : ""}`}
            key={cardTitle}
            tabIndex="0"
            style={{
              "--showcase-card-image": `url("${getProductImage(cardImage, index)}")`,
              "--showcase-delay": `${Math.min(index * 72, 360)}ms`,
            }}
            data-showcase-reveal="card"
          >
            <div className="showcase-card-copy" data-showcase-text-reveal="group">
              <h2>{cardTitle}</h2>
              <p>{cardDescription}</p>
            </div>
            <span className="showcase-card-arrow" aria-hidden="true">⌄</span>
          </article>
        ))}
      </section>

      <section className="showcase-section-heading showcase-container" data-showcase-reveal="up">
        <h2 data-showcase-text-reveal>{config.allocationTitle}</h2>
      </section>

      <section className="showcase-allocation" style={{ "--showcase-section-image": `url("${getProductImage(config.allocationImage || config.heroImage, 0)}")` }} data-showcase-reveal="up">
        <div className="showcase-allocation-labels" aria-hidden="true">
          <span>Before</span>
          <span>After</span>
        </div>
        <div className="showcase-allocation-copy showcase-container" data-showcase-text-reveal="group">
          <h2>{config.features[1]?.[0] || config.allocationTitle}</h2>
          <p>{config.features[1]?.[1] || config.allocationCopy}</p>
        </div>
        <div className="showcase-allocation-visual showcase-container" aria-label="Connected household loads">
          <div className="showcase-allocation-product"><img src={heroImage} alt="" /></div>
          <div className="showcase-allocation-line" aria-hidden="true" />
          <div className="showcase-loads">
            {["Lighting", "Storage", "Appliances", "Backup", "EV charging"].map((load, index) => (
              <div
                className={`showcase-load showcase-load--${index < 3 ? "active" : "idle"}`}
                key={load}
                style={{ "--showcase-delay": `${index * 90}ms` }}
              >
                <span className="showcase-load-dot">{index < 3 ? "✓" : "×"}</span>
                <span>{load}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {config.features.map(([featureTitle, featureDescription, featureImage], index) => (
        <section
          className={`showcase-feature showcase-feature--${index % 2 === 0 ? "left" : "right"}${index === 0 ? " showcase-feature--light" : ""}`}
          key={featureTitle}
          style={{ "--showcase-feature-image": `url("${getProductImage(featureImage, index + 1)}")` }}
          data-showcase-reveal={index % 2 === 0 ? "left" : "right"}
        >
          <div className="showcase-feature-copy showcase-container" data-showcase-text-reveal="group">
            <h2>{featureTitle}</h2>
            <p>{featureDescription}</p>
          </div>
        </section>
      ))}

      <section
        className="showcase-final"
        style={{ "--showcase-final-image": `url("${config.finalImage || fallbackImages[7]}")` }}
        data-showcase-reveal="right"
      >
        <div className="showcase-final-copy showcase-container" data-showcase-text-reveal="group">
          <h2>{config.finalTitle}</h2>
          <p>{config.finalCopy}</p>
        </div>
      </section>
    </main>
  );
};

export default HuaweiShowcase;
