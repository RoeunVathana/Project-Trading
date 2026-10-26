import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getHuaweiNavbarImage } from "../productAssets";
import "./IHybridCoolingGridFormingESS.css";

const baseUrl = import.meta.env.BASE_URL;
const localAsset = (fileName) => `${baseUrl}coverPage/${fileName}`;
const remoteImage = (id, width = 1600) => (
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=86`
);

const coverImage = localAsset("C&IHybridCooling.png");

const highlights = [
  {
    title: "C2C Dual-link Safety",
    description: "Full protection from cell to consumption scenarios",
    image: coverImage,
    className: "hybrid-highlight--featured",
  },
  {
    title: "Lower LCOS",
    description: "More usable energy, simplified installation and O&M",
    image: remoteImage("photo-1518770660439-4636190af475"),
  },
  {
    title: "Thermal Router",
    description: "Lower energy consumption, longer lifespan, and higher reliability",
    image: remoteImage("photo-1581094794329-c8112a89af12"),
  },
  {
    title: "One-Fits-All",
    description: "One management fits all lifecycle, C&I scenarios",
    image: remoteImage("photo-1551288049-bebda4e38f71"),
  },
];

const electricalSlides = [
  {
    title: "Dual cell detecting",
    description: "Detection of 13+ fault types and cloud-based risk warning.",
    image: remoteImage("photo-1518770660439-4636190af475"),
  },
  {
    title: "Six-side pack insulation",
    description: "Patented reinforced insulation materials protect battery packs and internal cells from demanding environments.",
    image: remoteImage("photo-1581092160562-40aa08e78837"),
  },
  {
    title: "Five-level system protection",
    description: "Full-range overcurrent protection covers AC/DC blind spots and supports rapid shutdown.",
    image: localAsset("SmartEnergyController.jpg"),
  },
  {
    title: "24-hour consumption assurance",
    description: "Real-time triple RCD protection helps prevent personnel injury and protects internal components.",
    image: localAsset("C&IHybridCooling.png"),
  },
];

const thermalSlides = [
  {
    title: "Cell heat insulation and cooling",
    description: "Inter-cell heat insulation and rapid liquid cooling help prevent thermal diffusion between cells.",
    image: remoteImage("photo-1509391366360-2e959784a276"),
  },
  {
    title: "Pack positive pressure oxygen barrier",
    description: "IP65 protection helps prevent oxygen from entering the battery pack and limits fire risks inside the pack.",
    image: remoteImage("photo-1497435334941-8c899ee9e8e9"),
  },
  {
    title: "System directional gas exhaust",
    description: "Combustible gases are exhausted through a directional duct to prevent combustion and explosion inside the cabinet.",
    image: remoteImage("photo-1473341304170-971dccb5ac1e"),
  },
  {
    title: "Consumption top explosion vent",
    description: "Hourly fire resistance and a top explosion vent design add another layer of personal safety.",
    image: localAsset("SmartGuard.png"),
  },
];

const coolingModes = [
  {
    title: "High temperature",
    mode: "Active liquid cooling mode",
    description: "The liquid-cooled unit runs actively with low-temperature coolant to quickly cool the cells. The air-cooled module runs in parallel medium-temperature coolant to cool the PCS.",
    image: remoteImage("photo-1518770660439-4636190af475", 1900),
  },
  {
    title: "Room temperature",
    mode: "Natural air cooling mode",
    description: "Only the air-cooled module runs. Medium-temperature coolant cools the cells and PCS with lower power consumption.",
    image: remoteImage("photo-1497435334941-8c899ee9e8e9", 1900),
  },
  {
    title: "Low temperature",
    mode: "Waste heat utilization mode",
    description: "Recycling PCS waste heat warms cold cells while keeping power consumption extremely low.",
    image: localAsset("C&IHybridCooling.png"),
  },
];

const recommendationCards = [
  {
    title: "Smart String Inverter",
    model: "SUN2000-150K-MG0",
    image: localAsset("SmartPVController.jpg"),
  },
  {
    title: "Smart String Inverter",
    model: "SUN5000 Series Solution",
    image: localAsset("SmartEnergyController.jpg"),
  },
  {
    title: "Smart String ESS",
    model: "LUNA2000-215 Series",
    image: getHuaweiNavbarImage("hybrid-cooling-grid-forming-ess"),
  },
];

const IHybridCoolingGridFormingESS = () => {
  const location = useLocation();
  const [activeElectrical, setActiveElectrical] = useState(0);
  const [activeThermal, setActiveThermal] = useState(0);
  const [activeCoolingMode, setActiveCoolingMode] = useState(0);
  const [activeRecommendation, setActiveRecommendation] = useState(0);
  const [mediaOpen, setMediaOpen] = useState(false);

  const activeElectricalSlide = electricalSlides[activeElectrical];
  const activeThermalSlide = thermalSlides[activeThermal];
  const activeMode = coolingModes[activeCoolingMode];
  const activeRecommendationCard = recommendationCards[activeRecommendation];
  const selectedProductImage = location.state?.product?.image || coverImage;
  const visibleRecommendations = [
    activeRecommendationCard,
    recommendationCards[(activeRecommendation + 1) % recommendationCards.length],
  ];

  useEffect(() => {
    const page = document.querySelector(".hybrid-ess-page");
    if (!page) return undefined;

    const elements = page.querySelectorAll("[data-ess-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
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
  }, []);

  useEffect(() => {
    document.body.style.overflow = mediaOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mediaOpen]);

  const heroStyle = useMemo(() => ({ backgroundImage: `linear-gradient(90deg, rgba(2, 4, 11, .9), rgba(2, 4, 11, .4) 58%, rgba(2, 4, 11, .12)), url("${selectedProductImage}")` }), [selectedProductImage]);

  const moveRecommendation = (direction) => {
    setActiveRecommendation((current) => (current + direction + recommendationCards.length) % recommendationCards.length);
  };

  return (
    <main className="hybrid-ess-page">
      <section className="hybrid-ess-hero" style={heroStyle} data-ess-reveal>
        <div className="hybrid-ess-container hybrid-ess-hero-content">
          <div className="hybrid-ess-hero-copy">
            <p className="hybrid-ess-brand"><span aria-hidden="true">≡</span> FusionSolar</p>
            <p className="hybrid-ess-eyebrow">Commercial &amp; industrial energy storage</p>
            <h1>C&amp;I Hybrid Cooling<br />Grid Forming ESS</h1>
            <p className="hybrid-ess-model">Model: LUNA2000-241 Series</p>
            <span className="hybrid-ess-accent-line" aria-hidden="true" />
            <a className="hybrid-ess-primary-button" href="#hybrid-highlights">Explore the system <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <span className="hybrid-ess-hero-scroll" aria-hidden="true">Scroll to explore ↓</span>
      </section>

      <section className="hybrid-ess-media-section hybrid-ess-container" data-ess-reveal>
        <div className="hybrid-ess-media-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(1, 4, 10, .12), rgba(1, 4, 10, .86)), url("${selectedProductImage}")` }}>
          <button className="hybrid-ess-play" type="button" onClick={() => setMediaOpen(true)} aria-label="Open LUNA2000 product preview"><span aria-hidden="true">▶</span></button>
          <p>Hybrid cooling, grid forming, and intelligent energy orchestration in one system.</p>
        </div>
      </section>

      <section className="hybrid-ess-highlights hybrid-ess-container" id="hybrid-highlights" data-ess-reveal>
        <div className="hybrid-ess-section-heading hybrid-ess-section-heading--center"><p className="hybrid-ess-kicker">One system, more possibilities</p><h2>Unlock on-demand energy,<br />keep all-time safety.</h2></div>
        <div className="hybrid-ess-highlight-grid">
          {highlights.map((card, index) => (
            <article className={`hybrid-ess-highlight ${card.className || ""}`} key={card.title} style={{ backgroundImage: `linear-gradient(180deg, rgba(3, 7, 16, .04), rgba(3, 7, 16, .92)), url("${card.image}")` }}>
              <div><span>0{index + 1}</span><h3>{card.title}</h3><p>{card.description}</p></div><button type="button" aria-label={`Learn about ${card.title}`}>⌄</button>
            </article>
          ))}
        </div>
      </section>

      <section className="hybrid-ess-intro" data-ess-reveal>
        <div className="hybrid-ess-container hybrid-ess-section-heading hybrid-ess-section-heading--center"><p className="hybrid-ess-kicker">Safety without compromise</p><h2>Inherently safe,<br />all-time safety.</h2><p>Huawei's C2C Dual-link Safety architecture connects electrical and thermal protection from cell to pack, system, and consumption. The result is a new benchmark for C&amp;I ESS safety.</p></div>
      </section>

      <section className="hybrid-ess-tab-section" data-ess-reveal>
        <div className="hybrid-ess-container">
          <div className="hybrid-ess-section-heading hybrid-ess-section-heading--center"><p className="hybrid-ess-kicker">Electrical-link safety</p><h2>C2C electrical-link safety:<br />short circuit prevention and isolation.</h2><p>Protection is rigorously guaranteed at every level, preventing short circuits before they become system events.</p></div>
          <div className="hybrid-ess-tab-layout">
            <div className="hybrid-ess-tab-image" style={{ backgroundImage: `linear-gradient(180deg, rgba(3, 7, 16, .05), rgba(3, 7, 16, .36)), url("${activeElectricalSlide.image}")` }}><div className="hybrid-ess-image-caption">{activeElectricalSlide.description}</div></div>
            <div className="hybrid-ess-tab-list" role="tablist" aria-label="Electrical safety features">
              {electricalSlides.map((slide, index) => <button type="button" role="tab" aria-selected={index === activeElectrical} className={index === activeElectrical ? "is-active" : ""} key={slide.title} onClick={() => setActiveElectrical(index)}><span>{slide.title}</span><i aria-hidden="true" /></button>)}
            </div>
          </div>
        </div>
      </section>

      <section className="hybrid-ess-tab-section hybrid-ess-tab-section--thermal" data-ess-reveal>
        <div className="hybrid-ess-container">
          <div className="hybrid-ess-section-heading hybrid-ess-section-heading--center"><p className="hybrid-ess-kicker">Heat-link safety</p><h2>C2C heat-link safety:<br />thermal runaway suppression and protection.</h2><p>An active protection system provides full protection at all levels to ensure the safety of assets, property, and people.</p></div>
          <div className="hybrid-ess-tab-layout hybrid-ess-tab-layout--reverse">
            <div className="hybrid-ess-tab-list" role="tablist" aria-label="Thermal safety features">
              {thermalSlides.map((slide, index) => <button type="button" role="tab" aria-selected={index === activeThermal} className={index === activeThermal ? "is-active" : ""} key={slide.title} onClick={() => setActiveThermal(index)}><span>{slide.title}</span><i aria-hidden="true" /></button>)}
            </div>
            <div className="hybrid-ess-tab-image" style={{ backgroundImage: `linear-gradient(180deg, rgba(3, 7, 16, .05), rgba(3, 7, 16, .36)), url("${activeThermalSlide.image}")` }}><div className="hybrid-ess-image-caption">{activeThermalSlide.description}</div></div>
          </div>
        </div>
      </section>

      <section className="hybrid-ess-stat-section" data-ess-reveal><div className="hybrid-ess-container hybrid-ess-section-heading hybrid-ess-section-heading--center"><p className="hybrid-ess-kicker">Pro in thermal control</p><h2>Smart cooling that works with the conditions.</h2><p>LUNA2000-241 Series uses an intelligent hybrid cooling architecture to optimize temperature, cut energy use, and keep storage working longer.</p><div className="hybrid-ess-stat"><strong>91.3<span>%</span></strong><small>Higher system efficiency<br />@ 25 C</small></div></div></section>

      <section className="hybrid-ess-cooling-section" data-ess-reveal>
        <div className="hybrid-ess-container">
          <div className="hybrid-ess-section-heading hybrid-ess-section-heading--center"><p className="hybrid-ess-kicker">Thermal Router</p><h2>Intelligent switching between multiple modes.</h2><p>The Thermal Router adapts regulation and multi-mode switching to ambient temperature conditions, with up to 30% reduction in energy consumption.</p></div>
          <div className="hybrid-ess-cooling-visual" style={{ backgroundImage: `linear-gradient(90deg, rgba(3, 7, 16, .18), rgba(3, 7, 16, .05)), url("${activeMode.image}")` }} />
          <div className="hybrid-ess-mode-grid">{coolingModes.map((mode, index) => <button type="button" className={index === activeCoolingMode ? "is-active" : ""} key={mode.title} onClick={() => setActiveCoolingMode(index)}><span>{mode.title}</span><strong>{mode.mode}</strong><p>{mode.description}</p></button>)}</div>
        </div>
      </section>

      <section className="hybrid-ess-split-section" data-ess-reveal>
        <div className="hybrid-ess-container hybrid-ess-split-grid"><div className="hybrid-ess-split-copy"><p className="hybrid-ess-kicker">Durability by design</p><h2>Longer performance life,<br />more reliable operation.</h2><p>Achieve efficient thermal management through optimized heat dissipation, ultra-low flow resistance, and dual-loop convection cooling for cells. The system is designed for dependable daily charge and discharge cycles.</p></div><div className="hybrid-ess-split-image" style={{ backgroundImage: `url("${localAsset("C&IHybridCooling.png")}")` }} /></div>
      </section>

      <section className="hybrid-ess-split-section hybrid-ess-split-section--energy" data-ess-reveal><div className="hybrid-ess-container hybrid-ess-split-grid hybrid-ess-split-grid--reverse"><div className="hybrid-ess-split-image" style={{ backgroundImage: `url("${remoteImage("photo-1518770660439-4636190af475")}")` }} /><div className="hybrid-ess-split-copy"><p className="hybrid-ess-kicker">More usable energy</p><h2>More energy,<br />less compromise.</h2><p>Each battery pack has a built-in energy optimizer with an efficient bidirectional balancing topology to improve system efficiency and deliver real-time active balancing without charge and discharge restrictions.</p><div className="hybrid-ess-inline-stat"><strong>2<span>%</span></strong><small>Increase in life-cycle discharge</small></div></div></div></section>

      <section className="hybrid-ess-install" data-ess-reveal><div className="hybrid-ess-container hybrid-ess-section-heading hybrid-ess-section-heading--center"><p className="hybrid-ess-kicker">Installation efficiency</p><h2>Install easier, cost lower.</h2><p>Organize cabinets with a space-saving three-sided layout, cutting front-to-back spacing to 30 cm. The integrated design enables a swift, cost-effective setup without extra wiring or trench digging.</p><div className="hybrid-ess-install-visual"><img src={coverImage} alt="LUNA2000 cabinet installation" /><span>30 cm</span></div></div></section>

      <section className="hybrid-ess-management" data-ess-reveal><div className="hybrid-ess-container hybrid-ess-section-heading hybrid-ess-section-heading--center"><p className="hybrid-ess-kicker">Smart lifecycle management</p><h2>One management fits all lifecycle,<br />efficient design and operation.</h2><p>Smart design, smart scheduling, and smart O&amp;M combine into one platform for precise benefit analysis and fast online health diagnosis.</p><div className="hybrid-ess-management-visual"><div className="hybrid-ess-dashboard"><span>Plant KPIs</span><b>28.31 MW</b><div className="hybrid-ess-chart"><i /><i /><i /><i /><i /><i /></div></div><div className="hybrid-ess-management-orbit"><span>Grid</span><span>Load</span><span>PV</span><span>Charger</span></div></div></div></section>

      <section className="hybrid-ess-recommendations hybrid-ess-container" data-ess-reveal>
        <div className="hybrid-ess-section-heading hybrid-ess-section-heading--center"><p className="hybrid-ess-kicker">Complete the system</p><h2>Recommendations</h2></div>
        <div className="hybrid-ess-recommendation-grid">{visibleRecommendations.map((card) => <article className="hybrid-ess-recommendation-card" key={card.model}><img src={card.image} alt="" /><h3>{card.title}</h3><p>{card.model}</p><a href="/product-huawei">Learn More</a></article>)}</div>
        <div className="hybrid-ess-recommendation-controls"><button type="button" onClick={() => moveRecommendation(-1)} aria-label="Previous recommendation">←</button><span>{activeRecommendation + 1} / {recommendationCards.length}</span><button type="button" onClick={() => moveRecommendation(1)} aria-label="Next recommendation">→</button></div>
        <div className="hybrid-ess-selected-recommendation"><img src={activeRecommendationCard.image} alt="" /><div><span>Recommended companion</span><h3>{activeRecommendationCard.title}</h3><p>{activeRecommendationCard.model}</p></div></div>
      </section>

      {mediaOpen && <div className="hybrid-ess-modal" role="dialog" aria-modal="true" aria-label="Product preview" onClick={() => setMediaOpen(false)}><div className="hybrid-ess-modal-card" onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => setMediaOpen(false)} aria-label="Close preview">×</button><img src={selectedProductImage} alt="LUNA2000-241 Series hybrid cooling grid forming ESS" /><h2>LUNA2000-241 Series</h2><p>Hybrid cooling, grid forming, and high-density energy storage for commercial and industrial sites.</p></div></div>}
    </main>
  );
};

export default IHybridCoolingGridFormingESS;
