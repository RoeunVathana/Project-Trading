import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getHuaweiNavbarImage } from "../productAssets";
import "./SmartPVController.css";

const imageUrl = (id, width = 1600) => (
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=86`
);

const formatCount = (value, decimals) => Number(value).toLocaleString("en-US", {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
});

const CountUpNumber = ({ value, decimals = 0, prefix = "", suffix = "" }) => {
  const numberRef = useRef(null);

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return undefined;

    const finalValue = `${prefix}${formatCount(value, decimals)}${suffix}`;
    const setFinalValue = () => {
      element.textContent = finalValue;
    };

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      setFinalValue();
      return undefined;
    }

    let frameId = null;
    let hasStarted = false;

    const animate = (timestamp, startedAt) => {
      const progress = Math.min((timestamp - startedAt) / 1600, 1);
      const easedProgress = 1 - ((1 - progress) ** 3);
      const currentValue = value * easedProgress;

      element.textContent = `${prefix}${formatCount(currentValue, decimals)}${suffix}`;

      if (progress < 1) {
        frameId = requestAnimationFrame((nextTimestamp) => animate(nextTimestamp, startedAt));
      } else {
        setFinalValue();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        hasStarted = true;
        observer.disconnect();
        frameId = requestAnimationFrame((timestamp) => animate(timestamp, timestamp));
      }
    }, { threshold: 0.25, rootMargin: "0px 0px -12% 0px" });

    observer.observe(element);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [decimals, prefix, suffix, value]);

  return (
    <span
      ref={numberRef}
      className="pv-count-number"
      aria-label={`${prefix}${formatCount(value, decimals)}${suffix}`}
    >
      {`${prefix}${formatCount(0, decimals)}${suffix}`}
    </span>
  );
};

const benefitCards = [
  {
    title: "Active Safety",
    description: "AI-powered AFCI locates faults quickly and disconnects in 0.5 seconds.",
    image: imageUrl("photo-1518770660439-4636190af475"),
    className: "pv-benefit-card--large",
  },
  {
    title: "More Energy",
    description: "Multi-peak MPPT helps every string capture more usable solar power.",
    image: imageUrl("photo-1558008258-3256797b43f3"),
  },
  {
    title: "Long-term Reliability",
    description: "Tested for cold, heat, humidity, salt mist, and demanding daily cycles.",
    image: imageUrl("photo-1500530855697-b586d89ba3ee"),
    className: "pv-benefit-card--wide",
  },
  {
    title: "Simplified O&M",
    description: "See asset health and locate faults with less time in the field.",
    image: imageUrl("photo-1497435334941-8c899ee9e8e9"),
  },
  {
    title: "Higher Efficiency",
    description: "Deliver more generation from every installation with less conversion loss.",
    image: imageUrl("photo-1473341304170-971dccb5ac1e"),
  },
  {
    title: "Industry Friendly",
    description: "A scalable controller for factories, warehouses, and large rooftops.",
    image: imageUrl("photo-1581094794329-c8112a89af12"),
  },
];

const weatherCards = [
  {
    label: { value: -25, suffix: " C" },
    title: "Freezing tolerance",
    description: "Reliable output in snow, high latitudes, and sudden temperature drops.",
    image: imageUrl("photo-1483347756197-71ef80e95f73", 1200),
  },
  {
    label: { value: 70, suffix: " C" },
    title: "Extreme heat",
    description: "Designed for tropical rooftops, deserts, and hot low-latitude sites.",
    image: imageUrl("photo-1500534623283-312aade485b7", 1200),
  },
  {
    label: { value: 66, prefix: "IP" },
    title: "Dust and salt mist",
    description: "A sealed enclosure helps protect the inverter in coastal and dusty environments.",
    image: imageUrl("photo-1517487881594-2787fef5ebf7", 1200),
  },
  {
    label: { value: 24, suffix: "/7" },
    title: "Built for uptime",
    description: "Consistent communication and low maintenance across the service life.",
    image: imageUrl("photo-1518770660439-4636190af475", 1200),
  },
];

const industries = [
  {
    name: "Commercial rooftops",
    description: "Power offices, retail centers, and warehouses with a controller built to scale across large rooftops.",
    image: imageUrl("photo-1497366811353-6870744d04b2", 1500),
    accent: "Distributed solar",
  },
  {
    name: "Industrial campuses",
    description: "Make more of existing infrastructure while keeping generation visible, predictable, and easy to maintain.",
    image: imageUrl("photo-1565793298595-6a879b1d9492", 1500),
    accent: "High-density generation",
  },
  {
    name: "Parking and transport",
    description: "Turn car parks and transport hubs into reliable clean-energy assets without compromising operations.",
    image: imageUrl("photo-1506521781263-d8422e82f27a", 1500),
    accent: "Every surface counts",
  },
];

const recommendations = [
  {
    title: "Smart String ESS",
    model: "LUNA2000-97/129/161/200KWH",
    image: "luna2000-7_14_21-s1.png",
    description: "Flexible storage for commercial and industrial energy systems.",
  },
  {
    title: "SmartLogger",
    model: "SmartLogger3000B",
    image: "sun2000-12_15_17_20_25k-mb0.png",
    description: "Centralized monitoring and control for connected sites.",
  },
  {
    title: "Smart Dongle",
    model: "Smart Dongle-4G",
    image: "ci-smartdongle-4g.png",
    description: "Simple wireless communication for fast commissioning.",
  },
];

const featureCards = [
  { value: { value: 66, prefix: "IP" }, title: "Weather protection", description: "Dustproof, waterproof, and resistant to anti-salt fog." },
  { value: "AFCI", title: "Active arc-fault protection", description: "Accurate fault location and rapid disconnection help keep sites safe." },
  { value: { value: 98.8, decimals: 1, suffix: "%" }, title: "Peak conversion efficiency", description: "More of the sun's energy becomes useful power for the site." },
  { value: "4G", title: "Flexible communication", description: "WLAN, Ethernet, and 4G modes support connected operations." },
  { value: { value: 1500, suffix: " V" }, title: "High-voltage platform", description: "A modern DC architecture keeps large systems efficient and compact." },
  { value: { value: 25, suffix: " yr" }, title: "Long service life", description: "A tested platform built for dependable long-term generation." },
];

const SmartPVController = () => {
  const location = useLocation();
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [activeRecommendation, setActiveRecommendation] = useState(0);
  const productImage = location.state?.product?.image || getHuaweiNavbarImage("smart-pv-controller");

  const currentIndustry = industries[activeIndustry];
  const currentRecommendation = recommendations[activeRecommendation];

  useEffect(() => {
    const elements = document.querySelectorAll(".smart-pv-page [data-pv-reveal]");
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
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const nextRecommendation = (direction) => {
    setActiveRecommendation((current) => (
      (current + direction + recommendations.length) % recommendations.length
    ));
  };

  const currentIndustryStyle = useMemo(() => ({ backgroundImage: `linear-gradient(90deg, rgba(4, 8, 16, .9), rgba(4, 8, 16, .26)), url(${currentIndustry.image})` }), [currentIndustry]);

  return (
    <main className="smart-pv-page">
      <section className="pv-hero" data-pv-reveal>
        <div className="pv-hero-glow" aria-hidden="true" />
        <div className="pv-container pv-hero-content">
          <div className="pv-hero-copy">
            <p className="pv-brand"><span aria-hidden="true">≡</span> FusionSolar</p>
            <p className="pv-eyebrow">Commercial &amp; industrial solar</p>
            <h1>Smart PV Controller</h1>
            <p className="pv-model">SUN2000-150K-MG0</p>
            <p className="pv-hero-description">Turn sunlight into confident production with a high-efficiency controller engineered for demanding solar sites.</p>
            <div className="pv-hero-actions">
              <a className="pv-button pv-button--primary" href="#pv-performance">Explore the platform <span aria-hidden="true">↗</span></a>
              <a className="pv-button pv-button--quiet" href="#pv-features">View key features</a>
            </div>
          </div>
          <div className="pv-product-stage" aria-label="SUN2000-150K-MG0 product image">
            <span className="pv-orbit pv-orbit--one" aria-hidden="true" />
            <span className="pv-orbit pv-orbit--two" aria-hidden="true" />
            <img src={productImage} alt="Huawei SUN2000-150K-MG0 smart PV controller" />
            <div className="pv-product-label"><span><CountUpNumber value={150} suffix=" kW" /></span><small>Grid-ready output</small></div>
          </div>
        </div>
        <div className="pv-hero-scroll" aria-hidden="true"><span /> Scroll to explore</div>
      </section>

      <section className="pv-benefits pv-container" aria-labelledby="pv-benefits-heading" data-pv-reveal>
        <div className="pv-section-intro">
          <p className="pv-kicker">Built around your site</p>
          <h2 id="pv-benefits-heading">A controller that does more with every ray of sunlight.</h2>
          <p>From active protection to precise maintenance, every part of the SUN2000-150K-MG0 is designed to raise the standard for commercial solar.</p>
        </div>
        <div className="pv-benefit-grid">
          {benefitCards.map((card, index) => (
            <article className={`pv-benefit-card ${card.className || ""}`} key={card.title} style={{ backgroundImage: `linear-gradient(180deg, rgba(1, 6, 15, .06), rgba(1, 6, 15, .94)), url(${card.image})` }}>
              <div><span className="pv-card-index"><CountUpNumber value={index + 1} prefix="0" /></span><h3>{card.title}</h3><p>{card.description}</p></div>
              <span className="pv-card-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="pv-performance" id="pv-performance" data-pv-reveal>
        <div className="pv-container pv-performance-content">
          <div className="pv-stat-block"><strong><CountUpNumber value={98.8} decimals={1} /><span>%</span></strong><small>Max. conversion efficiency*</small></div>
          <div className="pv-performance-copy"><p className="pv-kicker">A boost in production</p><h2>More usable energy, less wasted opportunity.</h2><p>The leading multi-peak MPPT algorithm and PID recovery solution help the SUN2000-150K-MG0 keep production high across changing conditions and complex sites.</p><a href="#pv-accuracy">See the performance story <span aria-hidden="true">→</span></a></div>
        </div>
      </section>

      <section className="pv-safety pv-container" data-pv-reveal>
        <div className="pv-section-heading"><p className="pv-kicker">Protection, fully covered</p><h2>Safety built into every layer.</h2></div>
        <div className="pv-safety-grid">
          <div className="pv-safety-visual"><div className="pv-electricity-line" aria-hidden="true" /><span className="pv-safety-chip">AFCI</span><p>AI-powered arc-fault protection</p></div>
          <div className="pv-safety-copy"><p className="pv-kicker">Property safety</p><h3>Find the fault. Stop the risk.</h3><p>The controller can accurately locate a fault and swiftly disconnect the circuit, helping protect people, property, and the rest of the system.</p><div className="pv-inline-stats"><div><strong><CountUpNumber value={750} suffix=" m" /></strong><span>Detection distance</span></div><div><strong><CountUpNumber value={48} suffix=" A" /></strong><span>Detection current</span></div><div><strong><CountUpNumber value={0.5} decimals={1} suffix=" s" /></strong><span>Rapid shutdown</span></div></div></div>
        </div>
      </section>

      <section className="pv-fault" data-pv-reveal>
        <div className="pv-container pv-split-layout">
          <div className="pv-split-copy"><p className="pv-kicker">Fast recovery</p><h2>Fight ground faults with ease.</h2><p>Industry-leading PV ground-fault protection enables a rapid shutdown of the on-grid system. Fault current is prevented before it can escalate, supporting safe inverter operation without a hitch.</p><div className="pv-mini-list"><span>Rapid shutdown</span><span>Precise diagnosis</span><span>Lower service risk</span></div></div>
          <div className="pv-fault-visual"><div className="pv-fault-panel"><span className="pv-fault-led" /><span className="pv-fault-wire" /><span className="pv-fault-caption">GROUND<br />FAULT<br /><b>PROTECTED</b></span></div></div>
        </div>
      </section>

      <section className="pv-connector pv-container" data-pv-reveal>
        <div className="pv-connector-copy"><p className="pv-kicker">Connector intelligence</p><h2>Stay informed about every connection.</h2><p>High-precision sensors monitor connectors around the clock. If an abnormal temperature is detected, the system triggers an alarm and shuts down automatically to prevent further failure.</p><div className="pv-connector-pills"><span>Real-time monitoring</span><span>Automatic alarm</span><span>Smart shutdown</span></div></div>
        <div className="pv-connector-visual"><div className="pv-connector-grid" aria-hidden="true" /><div className="pv-connector-terminal"><span>+</span><span>+</span><span>+</span><span>+</span><i /></div><strong>THERMAL<br />GUARD</strong></div>
      </section>

      <section className="pv-reliability" data-pv-reveal>
        <div className="pv-container">
          <div className="pv-section-heading pv-section-heading--narrow"><p className="pv-kicker">Made for the long run</p><h2>Tougher, longer service life, all-weather stability.</h2><p>More than 1,400 rigorous tests help the SUN2000-150K-MG0 stay dependable in the conditions that challenge solar installations most.</p></div>
          <div className="pv-reliability-stats"><div><strong><CountUpNumber value={25} /><span>+</span></strong><span>Years service life*</span></div><div><strong><CountUpNumber value={10} /><span>x</span></strong><span>Interference resistance*</span></div><div><strong><CountUpNumber value={99.999} decimals={3} /><span>%</span></strong><span>Availability*</span></div><div><strong><CountUpNumber value={1400} /><span>+</span></strong><span>Rigorous tests*</span></div></div>
        </div>
      </section>

      <section className="pv-weather pv-container" data-pv-reveal aria-labelledby="pv-weather-heading">
        <div className="pv-section-heading"><p className="pv-kicker">Ready for the real world</p><h2 id="pv-weather-heading">Stability in every climate.</h2></div>
        <div className="pv-weather-grid">
          {weatherCards.map((card) => <article className="pv-weather-card" key={card.title} style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.9)), url(${card.image})` }}><span><CountUpNumber {...card.label} /></span><div><h3>{card.title}</h3><p>{card.description}</p></div></article>)}
        </div>
      </section>

      <section className="pv-accuracy" id="pv-accuracy" data-pv-reveal>
        <div className="pv-container pv-accuracy-copy"><p className="pv-kicker">Accurate, ahead of the curve</p><h2>Know where the energy is. Know what needs attention.</h2><p>With fast insulation resistance testing, the SUN2000-150K-MG0 can help locate a faulty module with remarkable accuracy.</p><strong><CountUpNumber value={7} /><span>x</span></strong><small>Fault location accuracy*</small></div>
      </section>

      <section className="pv-industry pv-container" data-pv-reveal>
        <div className="pv-industry-heading"><div><p className="pv-kicker">Powering more businesses</p><h2>Built for how industry moves.</h2></div><div className="pv-carousel-controls"><button type="button" onClick={() => setActiveIndustry((current) => (current - 1 + industries.length) % industries.length)} aria-label="Previous industry">←</button><button type="button" onClick={() => setActiveIndustry((current) => (current + 1) % industries.length)} aria-label="Next industry">→</button></div></div>
        <div className="pv-industry-showcase" style={currentIndustryStyle}><div className="pv-industry-copy"><span>{currentIndustry.accent}</span><h3>{currentIndustry.name}</h3><p>{currentIndustry.description}</p><div className="pv-industry-dots">{industries.map((industry, index) => <button key={industry.name} type="button" className={index === activeIndustry ? "is-active" : ""} onClick={() => setActiveIndustry(index)} aria-label={`Show ${industry.name}`} />)}</div></div></div>
      </section>

      <section className="pv-features pv-container" id="pv-features" data-pv-reveal>
        <div className="pv-section-heading"><p className="pv-kicker">At a glance</p><h2>Product features</h2></div>
        <div className="pv-feature-grid">{featureCards.map((card) => <article className="pv-feature-card" key={card.title}><div className="pv-feature-icon">{typeof card.value === "string" ? card.value : <CountUpNumber {...card.value} />}</div><h3>{card.title}</h3><p>{card.description}</p></article>)}</div>
      </section>

      <section className="pv-recommendations pv-container" data-pv-reveal>
        <div className="pv-section-heading"><p className="pv-kicker">Complete the system</p><h2>Recommended companions.</h2></div>
        <div className="pv-recommendation-card">
          <button type="button" className="pv-recommendation-arrow" onClick={() => nextRecommendation(-1)} aria-label="Previous recommendation">←</button>
          <div className="pv-recommendation-product"><img src={`${import.meta.env.BASE_URL}iconNavbar/${currentRecommendation.image}`} alt="" /></div>
          <div className="pv-recommendation-copy"><span>HUAWEI SMART ENERGY</span><h3>{currentRecommendation.title}</h3><p>{currentRecommendation.description}</p><small>Model: {currentRecommendation.model}</small><a href="/product-huawei">Learn more <span aria-hidden="true">↗</span></a></div>
          <button type="button" className="pv-recommendation-arrow" onClick={() => nextRecommendation(1)} aria-label="Next recommendation">→</button>
        </div>
      </section>
    </main>
  );
};

export default SmartPVController;
