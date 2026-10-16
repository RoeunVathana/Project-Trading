import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SmartEnergyController.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const HERO_BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2400&q=88";

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

const fallbackCards = [
  { title: "More Powerful", description: "Power more home appliances with a smarter and more capable energy controller.", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1400&q=85" },
  { title: "Active Safety", description: "Intelligent protection helps keep the home energy system safe and stable.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85" },
  { title: "Enhanced Protection", description: "Reliable control and protection for demanding residential energy scenarios.", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=85" },
  { title: "Whole Home Backup", description: "Keep essential appliances running when the grid is unavailable.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85" },
  { title: "Future Ready", description: "Designed to grow with storage, solar generation, and future home energy needs.", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=85" },
];

const getCategoryName = (product, categories) => product.category?.name
  || categories.find((category) => Number(category.id) === Number(product.categoryId))?.name
  || "Smart Energy Controller";

const fallbackProduct = {
  productName: "Smart Energy Controller",
  category: "Smart Energy Controller",
  modelCode: "SUN5000 Series",
  description: "Smart energy control for dependable residential solar installations.",
  image: "",
  images: [],
};

const SmartEnergyController = () => {
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
        const productId = productRow.id || id;
        const images = (Array.isArray(imageRows) ? imageRows : [])
          .filter((image) => Number(image.productId) === Number(productId))
          .sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0));
        const primaryImage = images.find((image) => image.isPrimary) || images[0];

        setProduct({
          ...productRow,
          category: getCategoryName(productRow, Array.isArray(categoryRows) ? categoryRows : []),
          image: toMediaUrl(primaryImage?.imageUrl),
          images: images.map((image) => ({ ...image, imageUrl: toMediaUrl(image.imageUrl) })),
        });
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          if (id === "smart-energy-controller") {
            setProduct(fallbackProduct);
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
  }, [id]);

  useEffect(() => {
    const elements = document.querySelectorAll(".smart-energy-page [data-energy-reveal]");
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

  if (loading) return <div className="smart-energy-state">Loading Huawei product...</div>;
  if (!product) {
    return (
      <div className="smart-energy-state">
        <h1>PRODUCT NOT FOUND</h1>
        <p>{error || "The requested Huawei product could not be found."}</p>
        <button type="button" onClick={() => navigate("/product-huawei")}>Back to Huawei products</button>
      </div>
    );
  }

  const title = product.productName || "Smart Energy Controller";
  const category = product.category || "Smart Energy Controller";
  const model = product.modelCode || "-";
  const description = product.description || product.shortDescription || `The ${title} helps provide dependable energy control for the home.`;
  const imageCards = product.images?.length
    ? product.images.map((image, index) => ({
      title: image.altText || image.alt_text || fallbackCards[index]?.title || `${title} image ${index + 1}`,
      description: image.description || fallbackCards[index]?.description || "Product image description is not available.",
      image: image.imageUrl,
    }))
    : fallbackCards;
  const storyCards = fallbackCards.map((fallbackCard, index) => imageCards[index] || fallbackCard);

  return (
    <main className="smart-energy-page">
      <section
        className="smart-energy-hero"
        data-energy-reveal
        style={{ "--smart-energy-hero-image": `url("${HERO_BACKGROUND_IMAGE}")` }}
      >
        <div className="smart-energy-hero-copy smart-energy-container">
          <div className="smart-energy-brand"><span aria-hidden="true">Ⅲ</span> FusionSolar</div>
          <p className="smart-energy-category">{category}</p>
          <h1>{title}</h1>
          <p className="smart-energy-model">Model: {model}</p>
        </div>
        <div className="smart-energy-hero-product" data-energy-reveal="left">
          {product.image ? <img src={product.image} alt={title} /> : <span>HUAWEI</span>}
        </div>
      </section>

      <section className="smart-energy-benefits smart-energy-container" aria-label="Smart Energy Controller benefits">
        {imageCards.map((card, index) => (
          <article
            className="smart-energy-benefit-card"
            key={`${card.title}-${index}`}
            tabIndex="0"
            data-energy-reveal
            style={{ "--energy-delay": `${index * 70}ms`, backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.04) 70%), url(${card.image})` }}
          >
            <div className="smart-energy-benefit-copy">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
            <span className="smart-energy-benefit-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </article>
        ))}
      </section>

      <section className="smart-energy-dark-story" data-energy-reveal>
        <div className="smart-energy-story-copy smart-energy-container">
          <h2>Run Your Home on<br />Clean Electricity</h2>
          <p>{description} The increasingly powerful energy controller keeps more home appliances active with higher self-sufficiency in green energy and lower electricity bills. Go green with fewer inverters.</p>
        </div>
      </section>

      <section className="smart-energy-reliability smart-energy-container" data-energy-reveal>
        <h2>Tried-and-Tested Reliability</h2>
        <div className="smart-energy-reliability-row">
          <div className="smart-energy-reliability-copy"><h3>IP66 Rated</h3><p>Unaffected by harsh environments, the new Smart Energy Controller can withstand dust and high-speed water jets, resistant to sand, corrosion, salt spray, and other hazards.</p></div>
          <img src={storyCards[2].image} alt={storyCards[2].title} />
        </div>
        <div className="smart-energy-reliability-row reverse">
          <img src={storyCards[1].image} alt={storyCards[1].title} />
          <div className="smart-energy-reliability-copy"><h3>Withstand Extreme Temperatures</h3><p>Tested in high and low temperature scenarios, the controller can work properly between -25 °C and 60 °C.</p></div>
        </div>
        <div className="smart-energy-reliability-row">
          <div className="smart-energy-reliability-copy"><h3>Lightning Protection</h3><p>The Smart Energy Controller has passed DC/AC lightning protection tests and can withstand lightning strikes.</p></div>
          <img src={storyCards[3].image} alt={storyCards[3].title} />
        </div>
      </section>

      <section className="smart-energy-feature-story" data-energy-reveal>
        <div className="smart-energy-container">
          <h2>Expanded Storage, Uninterrupted Energy</h2>
          <p>This Smart Energy Controller can be conveniently integrated with your storage system whenever necessary. This pairing can store daytime solar energy and provide eco-friendly power for nights and overcast days, enabling a 24/7 green life.</p>
          <img src={storyCards[4].image} alt={storyCards[4].title} />
        </div>
      </section>

      <section className="smart-energy-feature-story smart-energy-feature-story-backup" data-energy-reveal>
        <div className="smart-energy-container">
          <h2>Backup Ready at All Times</h2>
          <p>Gone are the days of sudden darkness. The whole-home backup solution powers up seamlessly when blackouts occur, ensuring an uninterrupted home electricity supply.</p>
          <img src={storyCards[0].image} alt={storyCards[0].title} />
        </div>
      </section>

      <section className="smart-energy-final-story" data-energy-reveal>
        <div className="smart-energy-final-copy smart-energy-container">
          <h2>A Home that Always Shines</h2>
          <p>FusionSolar Residential delivers clean energy for homes around the world, helping families create a brighter and more sustainable future.</p>
        </div>
      </section>
    </main>
  );
};

export default SmartEnergyController;
