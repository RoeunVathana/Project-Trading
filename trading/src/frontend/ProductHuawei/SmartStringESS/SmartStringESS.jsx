import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SmartStringESS.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const fallbackImages = [
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=88",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=88",
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1600&q=88",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=88",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=88",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1600&q=88",
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=88",
  "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1600&q=88",
  "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1600&q=88",
];

const protectionLayers = [
  ["cell", "Cell level protection"],
  ["electrical", "Electrical protection"],
  ["structure", "Structural protection"],
  ["active", "Active protection"],
  ["emergency", "Emergency protection"],
];

const extraFeatures = [
  ["adjust", "Adjustable horizontal nuts, adapting to various locations."],
  ["wiring", "Power module wiring improvement, saving connection time."],
  ["modes", "Multiple working modes: TOU, Max. Self-consumption, and Fully Fed to Grid."],
  ["synergy", "Intelligent PV & ESS synergy, max. green energy consumption."],
];

const storyContent = [
  {
    title: "Reliable Cells",
    description: "Top-notch LFP cells have passed a succession of rigorous tests, such as 1/8 life cycle tests and puncture tests, etc. LUNA S1, committed to give you the top reliability.",
    imageIndex: 2,
    layout: "image-copy",
  },
  {
    title: "Against Crush,\nwith Poise",
    description: "The high-strength cabinet resists up to 5T of pressure, strong enough to withstand even an unexpected external crush or impact in a garage. It is formidable from the inside out.",
    note: "*Severe impact affects the stability of the ESS. Avoid impact whenever possible.",
    imageIndex: 3,
    layout: "image-copy",
  },
  {
    title: "Cell-level\nManagement",
    description: "Real-time temperature management with 4 sensors for 8 cells promises a 4-fold increase in accuracy for stable operations and ensures active protection by instant battery data analysis and pre-warning 24/7 around the clock.",
    imageIndex: 4,
    layout: "copy-image",
  },
  {
    title: "Active Pressure\nRelease Protection",
    description: "Active Pressure Release Technology is an enhanced emergency protection to reduce the oxygen concentration and eliminate combustion aids for fire prevention, safeguarding your solar energy storage system from the very first second.",
    imageIndex: 5,
    layout: "image-copy",
  },
  {
    title: "Intelligent Fire\nSuppression Kit",
    description: "Intelligent Fire Suppression Kit detects and extinguishes fires in 15s if any, eliminating fire risks right off the bat and safeguarding home energy storage as a real firefighter.",
    imageIndex: 6,
    layout: "copy-image",
  },
];

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

const getCategoryName = (product, categories) => product.category?.name
  || categories.find((category) => Number(category.id) === Number(product.categoryId))?.name
  || "Smart String ESS";

const ESSIcon = ({ type }) => {
  const paths = {
    cell: <><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4" /></>,
    electrical: <><path d="m13 2-7 11h6l-1 9 7-11h-6z" /><path d="M5 3h14M5 21h14" opacity=".35" /></>,
    structure: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /><path d="M9 5.2v4.5M15 5.2v4.5" /></>,
    active: <><rect x="7" y="4" width="10" height="16" rx="2" /><path d="M10 2h4M10 8h4M10 12h4M10 16h4M5 8h2M5 12h2M5 16h2M17 8h2M17 12h2M17 16h2" /></>,
    emergency: <><path d="M12 3 20 6v6c0 5-3.2 8-8 9-4.8-1-8-4-8-9V6z" /><path d="m12 7-2 5h3l-1 5 3-6h-3z" /></>,
    adjust: <><path d="M5 7h14M5 12h14M5 17h14" /><circle cx="9" cy="7" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="11" cy="17" r="2" /></>,
    wiring: <><path d="M5 5v7a3 3 0 0 0 3 3h2V9" /><path d="M19 19v-7a3 3 0 0 0-3-3h-2v6" /><circle cx="5" cy="5" r="2" /><circle cx="19" cy="19" r="2" /></>,
    modes: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>,
    synergy: <><path d="M12 3v18M3 12h18" /><path d="M7 7c2-2 8-2 10 0M7 17c2 2 8 2 10 0" /><circle cx="12" cy="12" r="2" /></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[type] || paths.cell}</svg>;
};

const SmartStringESS = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        const images = (Array.isArray(imageRows) ? imageRows : [])
          .filter((image) => Number(image.productId) === Number(id))
          .sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0))
          .map((image) => ({ ...image, imageUrl: toMediaUrl(image.imageUrl) }));
        const primaryImage = images.find((image) => image.isPrimary) || images[0];

        setProduct({
          ...productRow,
          category: getCategoryName(productRow, Array.isArray(categoryRows) ? categoryRows : []),
          image: toMediaUrl(primaryImage?.imageUrl),
          images,
        });
      } catch (loadError) {
        if (loadError.name !== "AbortError") setError(loadError.message || "Unable to load this Huawei product.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProduct();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const elements = document.querySelectorAll(".smart-string-page [data-ess-reveal]");
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

  if (loading) return <div className="smart-string-state">Loading Huawei product...</div>;
  if (!product) {
    return (
      <div className="smart-string-state">
        <h1>PRODUCT NOT FOUND</h1>
        <p>{error || "The requested Huawei product could not be found."}</p>
        <button type="button" onClick={() => navigate("/product-huawei")}>Back to Huawei products</button>
      </div>
    );
  }

  const title = product.productName || "Smart String ESS";
  const category = product.category || "Smart String ESS";
  const model = product.modelCode || "-";
  const images = product.images || [];
  const getImage = (index) => images[index]?.imageUrl || fallbackImages[index % fallbackImages.length];
  const getAlt = (index, fallback) => images[index]?.altText || images[index]?.alt_text || fallback;

  return (
    <main className="smart-string-page">
      <section className="smart-string-hero" data-ess-reveal>
        <div className="smart-string-hero-product" data-ess-reveal="left">
          {product.image ? <img src={product.image} alt={title} /> : <div className="smart-string-product-placeholder">HUAWEI</div>}
        </div>
        <div className="smart-string-hero-copy smart-string-container" data-ess-reveal="right">
          <div className="smart-string-brand"><span aria-hidden="true">Ⅲ</span> FusionSolar</div>
          <p className="smart-string-category">{category}</p>
          <h1>{title}</h1>
          <p className="smart-string-model">Model: {model}</p>
        </div>
      </section>

      <p className="smart-string-footnote smart-string-container" data-ess-reveal>
        *Based on typical configuration: single/three phase up to 12KW PV+ESS solution, measured 1 m away under typical operating conditions. Noise levels within quiet bedrooms should not exceed 30 dB.
      </p>

      <section className="smart-string-charge smart-string-container" data-ess-reveal>
        <h2>Charge and Discharge,<br />Faster than You&apos;ve Ever Expected</h2>
        <img src={getImage(1)} alt={getAlt(1, "Smart String ESS battery module")} />
        <div className="smart-string-charge-details">
          <p>Independent module-level management enables fast charge and discharge at 3.5 kW for each battery module and the maximum input and output power of 10.5 kW for each energy storage system. The upgrade is from performance to efficiency.</p>
          <div className="smart-string-metrics">
            <div><strong>3.5 <small>kW</small></strong><span>Fast charge and discharge<br />power per battery module</span></div>
            <div><strong>10.5 <small>kW</small></strong><span>Max. input and output<br />power per string</span></div>
          </div>
        </div>
      </section>

      <section className="smart-string-protection smart-string-container" data-ess-reveal>
        <h2>5-layer Protection,<br />Well-considered for All</h2>
        <div className="smart-string-protection-grid">
          {protectionLayers.map(([icon, label], index) => (
            <article key={label} style={{ "--ess-delay": `${index * 70}ms` }} data-ess-reveal>
              <span className="smart-string-icon"><ESSIcon type={icon} /></span>
              <p>{label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="smart-string-stories smart-string-container" aria-label="Smart String ESS protection features">
        {storyContent.map((story) => (
          <article className={`smart-string-story ${story.layout}`} key={story.title} data-ess-reveal>
            <img src={getImage(story.imageIndex)} alt={getAlt(story.imageIndex, story.title.replace("\n", " "))} />
            <div className="smart-string-story-copy">
              <h2>{story.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
              <p>{story.description}</p>
              {story.note && <small>{story.note}</small>}
            </div>
          </article>
        ))}
      </section>

      <section className="smart-string-monitoring smart-string-container" data-ess-reveal>
        <h2>In the Know, On the Go</h2>
        <div className="smart-string-monitoring-layout">
          <div className="smart-string-monitoring-image">
            <img src={getImage(7)} alt={getAlt(7, "FusionSolar energy management app")} />
            <p>FusionSolar app displays energy flow with a clear picture, enabling better visual perception of energy yields, storage amount, consumption rate, revenue report and plant operations.</p>
          </div>
          <div className="smart-string-monitoring-list">
            <strong>Real-time energy flow</strong>
            <span>One-stop<br />energy management</span>
            <span>SmartAssistant,<br />intelligent energy<br />management assistant</span>
            <span>Intuitive data analysis</span>
          </div>
        </div>
      </section>

      <section className="smart-string-extra smart-string-container" data-ess-reveal>
        <h2>More Features to Explore</h2>
        <div className="smart-string-extra-grid">
          {extraFeatures.map(([icon, text], index) => (
            <article key={text} style={{ "--ess-delay": `${index * 70}ms` }} data-ess-reveal>
              <span className="smart-string-icon"><ESSIcon type={icon} /></span>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="smart-string-final" data-ess-reveal>
        <div className="smart-string-final-copy smart-string-container">
          <h2>A Home that Always Shines</h2>
          <p>FusionSolar Residential delivers clean energy for homes around the world, helping families create a brighter and more sustainable future.</p>
        </div>
        <img src={getImage(8)} alt={getAlt(8, "Home powered by smart energy storage")} />
      </section>
    </main>
  );
};

export default SmartStringESS;
