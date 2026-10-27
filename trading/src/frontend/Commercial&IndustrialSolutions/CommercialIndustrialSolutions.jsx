import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./CommercialIndustrialSolutions.jsx.css";

const remoteImage = (id, width = 1800) => (
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=86`
);

const heroImage = remoteImage("photo-1508514177221-188b1cf16e9d", 2200);

const intelligenceModes = {
  day: { label: "Daytime Mode", metric: "84.5", metricLabel: "GENERATION", detail: "Solar generation is covering 100% of load. Charging batteries at 50 kW." },
  night: { label: "Night Mode", metric: "42.8", metricLabel: "DISCHARGE", detail: "Stored energy is supporting the facility while the solar array rests." },
  power: { label: "Power Cut", metric: "12.6", metricLabel: "BACKUP", detail: "Critical loads stay online through a coordinated backup response." },
};

const solutionModes = {
  solar: {
    label: "C&I Solar",
    eyebrow: "COMMERCIAL SOLAR",
    title: "Optimize Your Unused Roof Space",
    image: remoteImage("photo-1508514177221-188b1cf16e9d"),
    points: [["Advanced MPPT Tracking", "Maximize yield even in shaded industrial environments."], ["Module-Level Monitoring", "Real-time visibility into every panel's performance."], ["Lightweight Design", "Optimized for easy installation on commercial roofs."]],
  },
  storage: {
    label: "Storage",
    eyebrow: "ENERGY STORAGE",
    title: "Store More. Operate with Confidence.",
    image: remoteImage("photo-1592833159155-c62df1b65634"),
    points: [["Flexible Dispatch", "Shift energy to the hours your facility needs it most."], ["Thermal Management", "Keep storage assets stable across changing conditions."], ["Scalable Architecture", "Start with the capacity you need and expand with demand."]],
  },
  microgrid: {
    label: "Microgrid",
    eyebrow: "MICROGRID CONTROL",
    title: "Coordinate Every Source and Load",
    image: remoteImage("photo-1473341304170-971dccb5ac1e"),
    points: [["Unified Energy Flow", "Coordinate PV, storage, grid and critical loads in one view."], ["Resilient Operation", "Move smoothly between grid-connected and backup modes."], ["Clear Decisions", "Turn live site data into a practical operating plan."]],
  },
  ev: {
    label: "EV Charging",
    eyebrow: "FLEET ELECTRIFICATION",
    title: "Charge Fleets without Guesswork",
    image: remoteImage("photo-1593941707882-a5bba14938c7"),
    points: [["Demand-Aware Charging", "Schedule charging around production and site capacity."], ["Reliable Availability", "Keep vehicles ready while protecting the facility load."], ["Built to Grow", "Add charging capacity as your fleet transitions to electric."]],
  },
};

const products = [
  { title: "Smart Inverters", detail: "Next-generation DC-AC conversion with 99% efficiency.", model: "Series X-100", image: `${import.meta.env.BASE_URL}coverPage/SmartPVController.jpg` },
  { title: "Battery Modules", detail: "Liquid-cooled LFP batteries for ultra-long life.", model: "PowerRack C1", image: `${import.meta.env.BASE_URL}coverPage/C&IHybridCooling.png` },
  { title: "PV Panels", detail: "Bifacial technology for double-sided generation.", model: "Titan 700W", image: remoteImage("photo-1509391366360-2e959784a276", 900) },
  { title: "Ultra Chargers", detail: "Rapid DC charging for corporate fleets.", model: "EV-Max 150", image: remoteImage("photo-1593941707882-a5bba14938c7", 900) },
];

const performanceModes = {
  roi: { label: "ROI Analysis", quote: "Our intelligent energy management system typically shortens the payback period by 15–20% through smart arbitrage and demand response integration.", bars: [18, 29, 44, 76], caption: "Cumulative Return on Investment" },
  savings: { label: "Energy Savings", quote: "Balance onsite generation with storage and reduce wasted solar energy during the hours when production is highest.", bars: [24, 41, 61, 84], caption: "Annual Energy Cost Reduction" },
  scale: { label: "Scalability", quote: "Begin with the core system and add capacity as operations, fleet demand, and electrification targets grow.", bars: [22, 38, 57, 88], caption: "Expansion Readiness" },
};

const stories = [
  { sector: "HEAVY INDUSTRY", title: "Global Steel Mill", image: remoteImage("photo-1565610222536-ef125c59da2e", 1000), primary: 2.4, primaryDecimals: 1, primarySuffix: "MW", primaryLabel: "Capacity", secondary: 35, secondarySuffix: "%", secondaryLabel: "Savings" },
  { sector: "EDUCATION", title: "Pacific University", image: remoteImage("photo-1564981797816-1043664bf78d", 1000), primary: 800, primarySuffix: "kW", primaryLabel: "Capacity", secondary: 12, secondarySuffix: "mo", secondaryLabel: "ROI" },
  { sector: "MANUFACTURING", title: "Eco-Food Processors", image: remoteImage("photo-1581094794329-c8112a89af12", 1000), primary: 1.5, primaryDecimals: 1, primarySuffix: "MW", primaryLabel: "Capacity", secondary: 420, secondarySuffix: "t", secondaryLabel: "CO₂ Saved" },
];

const audiences = [
  { title: "For Business Owners", description: "Decarbonize your operations and lock in energy security for decades to come.", image: remoteImage("photo-1556761175-b413da4baf72", 1200), action: "Learn More", href: "/get-started" },
  { title: "For Installers", description: "Fast-track your projects with simplified wiring and automated commissioning tools.", image: remoteImage("photo-1509391366360-2e959784a276", 1200), action: "Installer Portal", href: "/contact" },
];

const FeatureIcon = ({ name }) => {
  const paths = {
    solar: <><path d="M4 16h16" /><path d="M6 13.5 8 5h8l2 8.5" /><path d="M9 13.5V17m6-3.5V17" /><path d="M12 5v8.5" /><path d="M7 9.5h10" /><path d="M12 17v3" /></>,
    battery: <><rect x="4" y="7" width="15" height="10" rx="2" /><path d="M19 10h2v4h-2M8 10v4m4-4v4" /></>,
    factory: <><path d="M4 20V9l6 3V8l6 3V6l4 2v12z" /><path d="M8 16h.01m4 0h.01m4 0h.01" /></>,
    shield: <><path d="m12 3 7 3v5c0 4.4-2.9 8.1-7 10-4.1-1.9-7-5.6-7-10V6z" /><path d="m9 12 2 2 4-4" /></>,
    puzzle: <><path d="M9 4h3a2 2 0 1 1 4 0v2h2a2 2 0 0 1 2 2v3h-2a2 2 0 1 0 0 4h2v2a2 2 0 0 1-2 2h-5v-2a2 2 0 1 0-4 0v2H7a2 2 0 0 1-2-2v-3h2a2 2 0 1 0 0-4H5V8a2 2 0 0 1 2-2h2z" /></>,
    chip: <><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M9 1v4m6-4v4m-6 14v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4M10 10h4v4h-4z" /></>,
    cloud: <><path d="M7 18h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6 8.5 4.5 4.5 0 0 0 7 18Z" /><path d="M12 12v5m-2-2 2 2 2-2" /></>,
    wrench: <><path d="M14.7 6.3a4 4 0 0 0-5.1 5.1L4 17a2.1 2.1 0 1 0 3 3l5.6-5.6a4 4 0 0 0 5.1-5.1l-2.4 2.4-2.1-2.1z" /></>,
  };

  return <svg className="ci-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.solar}</svg>;
};

const CountUpNumber = ({ value, decimals = 0 }) => {
  const numberRef = useRef(null);
  const hasEntered = useRef(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return undefined;

    const target = Number(value);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;
    let observer;

    const animate = () => {
      hasEntered.current = true;
      if (reducedMotion) {
        setDisplayValue(target);
        return;
      }

      const start = window.performance.now();
      const duration = 950;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        setDisplayValue(target * (1 - ((1 - progress) ** 3)));
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    };

    if (hasEntered.current || reducedMotion || !("IntersectionObserver" in window)) {
      animate();
    } else {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        animate();
        observer.disconnect();
      }, { threshold: 0.2 });
      observer.observe(element);
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [value]);

  return <span ref={numberRef}>{displayValue.toFixed(decimals)}</span>;
};

const CommercialIndustrialSolutions = () => {
  const pageRef = useRef(null);
  const [intelligenceMode, setIntelligenceMode] = useState("day");
  const [solutionMode, setSolutionMode] = useState("solar");
  const [performanceMode, setPerformanceMode] = useState("roi");
  const intelligence = intelligenceModes[intelligenceMode];
  const solution = solutionModes[solutionMode];
  const performance = performanceModes[performanceMode];

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    const revealElements = page.querySelectorAll("[data-ci-reveal]");
    const countElements = page.querySelectorAll("[data-ci-count]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const formatCount = (value, element) => {
      const decimals = Number(element.dataset.ciDecimals || 0);
      element.textContent = `${element.dataset.ciPrefix || ""}${value.toFixed(decimals)}${element.dataset.ciSuffix || ""}`;
    };
    const finishCount = (element) => formatCount(Number(element.dataset.ciCount), element);
    const animateCount = (element) => {
      if (element.dataset.ciAnimated === "true") return;
      element.dataset.ciAnimated = "true";
      if (reducedMotion) {
        finishCount(element);
        return;
      }

      const start = window.performance.now();
      const duration = 1450;
      const target = Number(element.dataset.ciCount);
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        formatCount(target * (1 - ((1 - progress) ** 3)), element);
        if (progress < 1) element.dataset.ciFrame = String(window.requestAnimationFrame(tick));
      };
      element.dataset.ciFrame = String(window.requestAnimationFrame(tick));
    };

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      countElements.forEach(finishCount);
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          if (entry.target.matches("[data-ci-count]")) animateCount(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

      revealElements.forEach((element) => observer.observe(element));
      countElements.forEach((element) => observer.observe(element));
      return () => {
        observer.disconnect();
        countElements.forEach((element) => {
          if (element.dataset.ciFrame) window.cancelAnimationFrame(Number(element.dataset.ciFrame));
        });
      };
    }

    return undefined;
  }, []);

  return (
    <main className="ci-page" ref={pageRef}>
      <section className="ci-hero" style={{ backgroundImage: `url("${heroImage}")` }} data-ci-reveal>
        <div className="ci-hero-overlay" aria-hidden="true" />
        <div className="ci-container ci-hero-content">
          <div className="ci-hero-copy">
            <p className="ci-eyebrow"><span /> Pioneering sustainable industry</p>
            <h1>Commercial &amp;<br />Industrial<br /><em>One-fits-All</em> Solution</h1>
            <p className="ci-hero-lead">Empowering enterprises with intelligent solar and storage technology. Accelerate your transition to net-zero while significantly reducing operational energy costs.</p>
            <div className="ci-hero-actions"><a className="ci-button ci-button--red" href="#ci-solutions">Explore Our Solutions <span aria-hidden="true">→</span></a><a className="ci-video-link" href="#ci-intelligence"><span className="ci-play" aria-hidden="true">▶</span> Watch Video</a></div>
          </div>
        </div>
        <nav className="ci-hero-steps" aria-label="Page sections"><a href="#ci-intelligence"><small>01</small><span>Energy Flow</span></a><a href="#ci-products"><small>02</small><span>Hardware</span></a><a href="#ci-performance"><small>03</small><span>Core Values</span></a><a href="#ci-stories"><small>04</small><span>Case Studies</span></a></nav>
      </section>

      <section className="ci-section ci-intelligence" id="ci-intelligence" data-ci-reveal><div className="ci-container"><div className="ci-section-heading ci-section-heading--center"><p className="ci-kicker">LIVE SITE CONTROL</p><h2>Real-Time Intelligence</h2><div className="ci-pills" role="tablist" aria-label="Energy operating modes">{Object.entries(intelligenceModes).map(([key, mode]) => <button key={key} type="button" role="tab" aria-selected={intelligenceMode === key} className={intelligenceMode === key ? "is-active" : ""} onClick={() => setIntelligenceMode(key)}>{mode.label}</button>)}</div></div><div className="ci-flow" aria-label={`${intelligence.label} energy flow`}><div className="ci-flow-node"><span className="ci-flow-icon"><FeatureIcon name="solar" /></span><strong>Solar Array</strong></div><span className="ci-flow-line" aria-hidden="true" /><div className="ci-flow-node"><span className="ci-flow-icon"><FeatureIcon name="battery" /></span><strong>Energy Storage</strong></div><span className="ci-flow-line" aria-hidden="true" /><div className="ci-flow-node"><span className="ci-flow-icon"><FeatureIcon name="factory" /></span><strong>Factory Load</strong></div></div><div className="ci-alert-bar"><span className="ci-alert-icon">i</span><div><strong>Peak Performance Detected</strong><p>{intelligence.detail}</p></div><strong className="ci-alert-metric"><CountUpNumber key={intelligenceMode} value={intelligence.metric} decimals={1} /> kW<small>{intelligence.metricLabel}</small></strong></div></div></section>

      <section className="ci-section ci-solutions" id="ci-solutions" data-ci-reveal><div className="ci-container"><div className="ci-section-heading ci-solutions-heading"><div><p className="ci-kicker">ENERGY ARCHITECTURE</p><h2>Integrated Solutions</h2><p>Tailored energy architectures for every commercial requirement.</p></div><div className="ci-tabs" role="tablist" aria-label="Integrated solutions">{Object.entries(solutionModes).map(([key, mode]) => <button type="button" role="tab" aria-selected={solutionMode === key} className={solutionMode === key ? "is-active" : ""} key={key} onClick={() => setSolutionMode(key)}>{mode.label}</button>)}</div></div><div className="ci-solution-grid"><article className="ci-solution-copy"><p className="ci-kicker">{solution.eyebrow}</p><h3>{solution.title}</h3><ul>{solution.points.map(([title, description]) => <li key={title}><span aria-hidden="true">✓</span><p><strong>{title}:</strong> {description}</p></li>)}</ul><a href="#ci-products" className="ci-text-link">Technical Specifications <span aria-hidden="true">→</span></a></article><img className="ci-solution-image" src={solution.image} alt={`${solution.label} installation`} /></div></div></section>

      <section className="ci-section ci-products" id="ci-products" data-ci-reveal><div className="ci-container"><div className="ci-section-heading ci-section-heading--center"><p className="ci-kicker">HARDWARE ECOSYSTEM</p><h2>Premium Components</h2></div><div className="ci-product-grid">{products.map((product) => <article className="ci-product-card" key={product.title}><div className="ci-product-image"><img src={product.image} alt={product.title} /></div><h3>{product.title}</h3><p>{product.detail}</p><strong>{product.model}</strong></article>)}</div><div className="ci-centered-action"><Link className="ci-button ci-button--outline" to="/product-huawei">View All Products <span aria-hidden="true">→</span></Link></div></div></section>

      <section className="ci-section ci-performance" id="ci-performance" data-ci-reveal><div className="ci-container"><div className="ci-performance-intro"><div><p className="ci-kicker">BUILT FOR PERFORMANCE</p><h2>Built for Performance</h2><h3><span className="ci-performance-icon"><FeatureIcon name="shield" /></span> Proactive Safety</h3><p>Our AI-driven active AFCI technology detects and extinguishes arcs in milliseconds, ensuring total protection for your infrastructure and personnel.</p></div><div className="ci-performance-image" style={{ backgroundImage: `url("${remoteImage("photo-1518770660439-4636190af475", 1400)}")` }}><div className="ci-failure-badge"><strong><span data-ci-count="0.01" data-ci-decimals="2">0.00</span>%</strong><small>Failure Rate Globally</small></div></div></div><div className="ci-stat-row"><div><strong><span data-ci-count="25">0</span>+</strong><small>YEARS RELIABILITY</small></div><div><strong><span data-ci-count="100">0</span>%</strong><small>QUALITY CHECK</small></div></div><div className="ci-profitability"><div className="ci-profitability-heading"><h3>Higher Profitability</h3><div className="ci-tabs ci-tabs--dark" role="tablist" aria-label="Performance views">{Object.entries(performanceModes).map(([key, mode]) => <button type="button" role="tab" aria-selected={performanceMode === key} className={performanceMode === key ? "is-active" : ""} key={key} onClick={() => setPerformanceMode(key)}>{mode.label}</button>)}</div></div><div className="ci-profitability-content"><div className="ci-chart"><div className="ci-chart-bars">{performance.bars.map((height, index) => <span style={{ height: `${height}%` }} key={`${performanceMode}-${index}`} />)}</div><div className="ci-chart-labels"><span>Year 1</span><span>Year 3</span><span>Year 5</span><span>Year 7</span></div><strong>{performance.caption}</strong></div><blockquote>“{performance.quote}”</blockquote></div></div><div className="ci-edge"><h3>The One-Fits-All Edge</h3><div className="ci-edge-grid">{[["puzzle", "Universal Design", "Compatible with all major global grid standards."], ["chip", "Smart Sync", "Automatic hardware recognition and pairing."], ["cloud", "OTA Updates", "Continuous performance upgrades over-the-air."], ["shield", "Cyber Secure", "Encrypted data flows with local storage backup."], ["wrench", "Easy Service", "Plug-and-play modules for zero-downtime repair."]].map(([icon, title, description]) => <article key={title}><FeatureIcon name={icon} /><h4>{title}</h4><p>{description}</p></article>)}</div></div></div></section>

      <section className="ci-section ci-audiences" data-ci-reveal><div className="ci-container ci-audience-grid">{audiences.map((audience) => <article className="ci-audience-card" style={{ backgroundImage: `linear-gradient(90deg, rgba(3, 10, 24, .88), rgba(3, 10, 24, .2)), url("${audience.image}")` }} key={audience.title}><div><h3>{audience.title}</h3><p>{audience.description}</p><Link to={audience.href} className="ci-button ci-button--white">{audience.action} <span aria-hidden="true">→</span></Link></div></article>)}</div></section>

      <section className="ci-section ci-stories" id="ci-stories" data-ci-reveal><div className="ci-container"><div className="ci-section-heading ci-section-heading--center"><p className="ci-kicker">PROVEN IN THE FIELD</p><h2>Success Stories</h2></div><div className="ci-story-grid">{stories.map((story) => <article className="ci-story-card" key={story.title}><img src={story.image} alt={story.title} /><div className="ci-story-body"><p className="ci-story-sector">{story.sector}</p><h3>{story.title}</h3><div className="ci-story-stats"><span><strong><span data-ci-count={story.primary} data-ci-decimals={story.primaryDecimals || 0}>0</span>{story.primarySuffix}</strong><small>{story.primaryLabel}</small></span><span><strong><span data-ci-count={story.secondary} data-ci-decimals={story.secondaryDecimals || 0}>0</span>{story.secondarySuffix}</strong><small>{story.secondaryLabel}</small></span></div><a href="#ci-contact">Case Details <span aria-hidden="true">→</span></a></div></article>)}</div></div></section>

      <section className="ci-contact" id="ci-contact" data-ci-reveal><div className="ci-container ci-contact-inner"><p className="ci-kicker">START YOUR ENERGY TRANSITION</p><h2>Ready to Power Your Business?</h2><p>Connect with our energy experts today for a free custom<br className="ci-desktop-break" /> ROI analysis of your facility.</p><div className="ci-contact-actions"><Link className="ci-button ci-button--dark" to="/get-started">Get a Quote <span aria-hidden="true">→</span></Link><Link className="ci-button ci-button--transparent" to="/contact">Talk to Sales <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
};

export default CommercialIndustrialSolutions;
