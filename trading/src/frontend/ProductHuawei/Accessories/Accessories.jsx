import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Accessories.css";

const asset = (folder, fileName) => `${import.meta.env.BASE_URL}${folder}/${fileName}`;

const recommendations = [
  {
    title: "Smart PV Controller",
    model: "SUN2000-50KTL-M3",
    image: asset("iconNavbar", "sun2000-12_15_17_20_25k-mb0.png"),
    href: "/product-huawei/commercial-industrial-smart-pv-controller",
  },
  {
    title: "Smart String ESS",
    model: "LUNA2000-97/129/161/200KWH",
    image: asset("iconNavbar", "luna2000-7_14_21-s1.png"),
    href: "/product-huawei/commercial-industrial-c-and-i-hybrid-cooling-grid-forming-ess",
  },
  {
    title: "Management System",
    model: "FusionSolar Smart PV Management System",
    image: asset("coverPage", "SmartEnergyController.jpg"),
    imageClassName: "accessories-recommendation-image--management",
    href: "/product-huawei",
  },
];

const Accessories = () => {
  const location = useLocation();
  const selectedProduct = location.state?.product;
  const heroProductImage = selectedProduct?.image || asset("coverPage", "Accesseri.png");

  useEffect(() => {
    const page = document.querySelector(".accessories-page");
    if (!page) return undefined;

    const elements = page.querySelectorAll(
      "[data-accessory-reveal], [data-accessory-text-reveal]",
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="accessories-page">
      <section className="accessories-hero" data-accessory-reveal aria-labelledby="accessories-hero-title">
        <div className="accessories-hero-rays" aria-hidden="true" />
        <div className="accessories-shell accessories-hero-grid">
          <div className="accessories-hero-product" data-accessory-reveal="product">
            <span className="accessories-product-glow" aria-hidden="true" />
            <span className="accessories-product-shadow" aria-hidden="true" />
            <img
              src={heroProductImage}
              alt={selectedProduct?.name || "FusionSolar Smart Dongle 4G"}
            />
          </div>

          <div className="accessories-hero-copy" data-accessory-text-reveal="group">
            <p className="accessories-brand">FusionSolar</p>
            <h1 id="accessories-hero-title">Smart Dongle</h1>
            <p className="accessories-model">4G</p>
            <span className="accessories-accent-line" aria-hidden="true" />
            <div className="accessories-hero-features" aria-label="Smart Dongle features">
              <span>Easy Communication</span>
              <i aria-hidden="true" />
              <span>Smart O&amp;M</span>
              <i aria-hidden="true" />
              <span>IP65 Protection</span>
            </div>
          </div>
        </div>

        <div className="accessories-scroll-cue" aria-hidden="true">
          <span />
          Scroll to explore
        </div>
      </section>

      <section className="accessories-connect accessories-shell" data-accessory-reveal aria-labelledby="accessories-connect-title">
        <div className="accessories-section-heading" data-accessory-text-reveal="group">
          <p className="accessories-kicker">Simple connection, smarter service</p>
          <h2 id="accessories-connect-title">Connect Inverters and Data Service</h2>
        </div>

        <div className="accessories-connect-panel" data-accessory-text-reveal="group">
          <div className="accessories-connect-copy">
            <p>Via 4G connection, Smart Dongle supports up to 10 inverters to communicate with the solar management system through hassle-free plug and play.</p>
            <p>Once plugged in, the WLAN access point can be used for local deployment to realize intelligent power management and plant maintenance. Both FusionSolar SmartPVMS and the third-party management system can be bound to the inverters.</p>
            <p>Being dustproof and waterproof for IP65 protection, Smart Dongle is ready to defy dust and rain after outdoor installation at any moment.</p>
          </div>

          <div className="accessories-connect-side" aria-label="Smart Dongle connection highlights">
            <span className="accessories-side-orbit" aria-hidden="true" />
            <strong>10</strong>
            <span>inverters supported</span>
            <div className="accessories-side-divider" aria-hidden="true" />
            <strong>IP65</strong>
            <span>outdoor protection</span>
          </div>
        </div>
      </section>

      <section className="accessories-recommendations accessories-shell" data-accessory-reveal aria-labelledby="accessories-recommendations-title">
        <div className="accessories-section-heading accessories-section-heading--recommendations" data-accessory-text-reveal="group">
          <p className="accessories-kicker">Build a complete energy system</p>
          <h2 id="accessories-recommendations-title">Recommendations</h2>
        </div>

        <div className="accessories-recommendation-grid">
          {recommendations.map((recommendation, index) => (
            <article
              className="accessories-recommendation-card"
              key={recommendation.title}
              data-accessory-reveal="card"
              style={{ "--accessories-card-delay": `${index * 110}ms` }}
            >
              <div className="accessories-recommendation-media">
                <img
                  className={recommendation.imageClassName || ""}
                  src={recommendation.image}
                  alt=""
                  loading="lazy"
                />
              </div>
              <div className="accessories-recommendation-copy" data-accessory-text-reveal="group">
                <h3>{recommendation.title}</h3>
                <p>Model: {recommendation.model}</p>
                <a href={recommendation.href}>Learn More <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          ))}
        </div>

        <p className="accessories-footnote">Connect the right devices, keep plant data visible, and make every service visit more informed.</p>
      </section>
    </main>
  );
};

export default Accessories;
