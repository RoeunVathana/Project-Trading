import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import AnimatedNumber from "../components/AnimatedNumber/AnimatedNumber";
import "./NewHome.css";

const heroSlides = [
  {
    label: "LATEST NEWS",
    title: "CHINT First 1000kV/1000MVA UHV-AC Transformer Passed All Type & Routine Tests in One Attempt",
    description: "Powering reliable infrastructure with smarter, safer and more efficient electrical solutions.",
    image: "/Chint/499478832_1208686280604421_1108528605282731678_n.jpg",
    video: "/video/Comfirm.mp4",
  },
  {
    label: "SMART ENERGY",
    title: "Building a More Connected and Sustainable Energy Future",
    description: "Discover integrated solutions for homes, businesses, utilities and the industries that keep communities moving.",
    image: "/SmartEnergy/home.jpg",
    video: "/video/optimized_video_showroom.mp4",
  },
  {
    label: "PRODUCT SPOTLIGHT",
    title: "Reliable Power Distribution for Every Critical Application",
    description: "From low-voltage protection to intelligent monitoring, our solutions help keep power working when it matters most.",
    image: "/Chint/499703606_1208686037271112_6262228968733182399_n.jpg",
    video: "/video/Comfirm.mp4",
  },
];

const productCards = [
  {
    title: "Low Voltage",
    description: "Safe, efficient, and reliable power distribution and control",
    image: "/Chint/499703606_1208686037271112_6262228968733182399_n.jpg",
    className: "new-home-product-card--large",
    to: "/low-voltage",
  },
  {
    title: "Power Transmission and Distribution",
    description: "High-efficiency, stable and safe",
    image: "/Chint/499478832_1208686280604421_1108528605282731678_n.jpg",
    to: "/power-transmission-distribution",
  },
  {
    title: "Instruments & Meters",
    description: "Accurate monitoring",
    image: "/Chint/499609078_1208686097271106_3286366401056160675_n.jpg",
    to: "/instruments-and-meters",
  },
  {
    title: "Low Voltage Switchgear and Software",
    description: "Comprehensive product lines",
    image: "/Chint/499497920_1208686240604425_9104345428579701883_n.jpg",
    to: "/product?division=trd&collection=chint",
  },
  {
    title: "EV Charging",
    description: "Fast and efficient",
    image: "/SmartEnergy/home.jpg",
    to: "/product-huawei/residential-solution",
  },
];

const industries = [
  {
    title: "Power Utility",
    description: "Providing innovative solutions for efficient power generation, transmission, and distribution",
    image: "/Chint/499478832_1208686280604421_1108528605282731678_n.jpg",
    className: "industry-card--featured",
    tags: ["Distribution Grid", "Transmission Grid"],
  },
  { title: "Buildings", image: "/SmartEnergy/home.jpg" },
  { title: "OEM", image: "/Chint/499703606_1208686037271112_6262228968733182399_n.jpg" },
  { title: "Telecom & Data Center", image: "/Chint/499609078_1208686097271106_3286366401056160675_n.jpg" },
  { title: "New Energy", image: "/smartPV/kv-pc.jpg" },
  { title: "Industry", image: "/Chint/499580702_1208685807271135_7337196093940743597_n.jpg" },
];

const updates = [
  {
    date: "NOVEMBER 9, 2026",
    title: "CHINT Electrics’ Q3 2026 Report",
    image: "/Chint/499703606_1208686037271112_6262228968733182399_n.jpg",
  },
  {
    date: "NOVEMBER 4, 2026",
    title: "September Highlights — Cool Season 2026",
    image: "/Chint/499580702_1208685807271135_7337196093940743597_n.jpg",
  },
  {
    date: "OCTOBER 30, 2026",
    title: "Global Young Innovators Gather at the 2026 CHINT Cup Youth Innovation Competition Finals",
    image: "/smartPV/sec-3-pc.png",
  },
  {
    date: "OCTOBER 27, 2026",
    title: "Integrated Solar Solutions for Enhanced Grid Compliance",
    image: "/smartPV/sec-4-2-pc.jpg",
  },
];

const Arrow = ({ direction = "right" }) => (
  <span aria-hidden="true" className={`new-home-arrow new-home-arrow--${direction}`}>
    {direction === "left" ? "←" : "→"}
  </span>
);

const SectionHeading = ({ eyebrow, title, light = false }) => (
  <div className={`new-home-heading${light ? " new-home-heading--light" : ""}`}>
    {eyebrow && <span className="new-home-heading__eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    <span className="new-home-heading__rule" aria-hidden="true" />
  </div>
);

const ProductCard = ({ title, description, image, className = "", to }) => (
  <Link className={`new-home-product-card ${className}`} to={to}>
    <img src={image} alt="" loading="lazy" decoding="async" />
    <span className="new-home-card-shade" aria-hidden="true" />
    <span className="new-home-product-card__content">
      <strong>{title}</strong>
      <small>{description}</small>
      <span className="new-home-card-link">View Now <Arrow /></span>
    </span>
  </Link>
);

const IndustryCard = ({ title, description, image, className = "", tags = [] }) => (
  <article className={`new-home-industry-card ${className}`}>
    <img src={image} alt="" loading="lazy" decoding="async" />
    <span className="new-home-card-shade" aria-hidden="true" />
    <div className="new-home-industry-card__content">
      <span className="new-home-industry-card__plus" aria-hidden="true">+</span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {tags.length > 0 && (
        <div className="new-home-industry-card__tags">
          {tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      )}
    </div>
  </article>
);

const QuickIcon = ({ type }) => {
  if (type === "download") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" /></svg>;
  }

  if (type === "contact") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l3 3v15H7z" /><path d="M15 3v4h4M10 12h5m-5 4h5" /></svg>;
};

const NewHome = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { theme } = useTheme();

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  const slide = heroSlides[activeSlide];

  return (
    <main className="new-home" data-theme={theme}>
      <section className="new-home-hero" aria-labelledby="new-home-hero-title">
        <div className="new-home-hero__background" key={slide.image} style={{ backgroundImage: `url("${slide.image}")` }} />
        <video
          className="new-home-hero__video"
          key={slide.video}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={slide.image}
          aria-hidden="true"
          onEnded={() => setActiveSlide((current) => (current + 1) % heroSlides.length)}
        >
          <source src={slide.video} type="video/mp4" />
        </video>
        <div className="new-home-hero__overlay" aria-hidden="true" />
        <div className="new-home-container new-home-hero__inner">
          <div className="new-home-hero__copy" key={slide.label}>
            <span className="new-home-hero__label">{slide.label}</span>
            <h1 id="new-home-hero-title">{slide.title}</h1>
            <p>{slide.description}</p>
            <Link className="new-home-button new-home-button--primary" to="/resources">
              Learn More <Arrow />
            </Link>
          </div>
          <div className="new-home-hero__controls">
            <div className="new-home-hero__dots" aria-label="Hero slides">
              {heroSlides.map((item, index) => (
                <button
                  type="button"
                  key={item.label}
                  className={index === activeSlide ? "is-active" : ""}
                  aria-label={`Show slide ${index + 1}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
            <div className="new-home-hero__arrows">
              <button type="button" aria-label="Previous slide" onClick={() => moveSlide(-1)}><Arrow direction="left" /></button>
              <button type="button" aria-label="Next slide" onClick={() => moveSlide(1)}><Arrow /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="new-home-intro">
        <div className="new-home-container new-home-intro__inner">
          <SectionHeading title="Global Leading Smart Energy Solutions Provider" />
          <p>Electrical and smart-energy solutions for power utilities, industry, buildings, data centers and renewable energy.</p>
          <Link className="new-home-button new-home-button--outline" to="/about">Learn More <Arrow /></Link>
        </div>
      </section>

      <section className="new-home-products">
        <div className="new-home-container">
          <SectionHeading title="Explore Our Products" />
          <div className="new-home-product-grid">
            {productCards.map((card) => <ProductCard key={card.title} {...card} />)}
          </div>
        </div>
      </section>

      <section className="new-home-industries">
        <div className="new-home-container">
          <SectionHeading title="CHINT Industry Solutions" />
          <div className="new-home-industry-grid">
            {industries.map((card) => <IndustryCard key={card.title} {...card} />)}
          </div>
        </div>
      </section>

      <section className="new-home-stats">
        <div className="new-home-container new-home-stats__layout">
          <div className="new-home-stats__copy">
            <span className="new-home-stats__eyebrow">Global Footprint</span>
            <h2>Connecting the world to empower regions</h2>
            <p>At the heart of our global strategy is a deep commitment to delivering tailored solutions for your individual market needs. By merging international best practices with regional insights, we build a strong, sustainable, and world-class enterprise that grows with the communities we serve.</p>
            <Link className="new-home-button new-home-button--outline" to="/about">Explore our locations <Arrow /></Link>
            <div className="new-home-stats__grid">
              <div><strong><AnimatedNumber value={140} suffix="+" /></strong><span>Countries and regions</span></div>
              <div><strong><AnimatedNumber value={40} suffix="+" /></strong><span>Regional offices</span></div>
              <div><strong><AnimatedNumber value={2300} suffix="+" /></strong><span>Global distributors</span></div>
              <div><strong><AnimatedNumber value={70} suffix="%+" /></strong><span>Talent localization across borders</span></div>
            </div>
          </div>
          <div className="new-home-stats__visual" aria-hidden="true">
            <div className="new-home-globe">
              <div className="new-home-globe__sphere">
                <span className="new-home-globe__land new-home-globe__land--one" />
                <span className="new-home-globe__land new-home-globe__land--two" />
                <span className="new-home-globe__land new-home-globe__land--three" />
              </div>
              {Array.from({ length: 9 }, (_, index) => <span className={`new-home-globe__marker new-home-globe__marker--${index + 1}`} key={index}><i /></span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="new-home-updates">
        <div className="new-home-container">
          <div className="new-home-section-topline">
            <h2>Latest Updates</h2>
            <div className="new-home-section-links"><a className="is-active" href="#latest-updates">News</a><a href="#latest-updates">Blog</a><Link to="/resources">View more <Arrow /></Link></div>
          </div>
          <div className="new-home-updates__grid" id="latest-updates">
            {updates.map((update) => (
              <Link className="new-home-update-card" to="/resources" key={update.title}>
                <img src={update.image} alt="" loading="lazy" decoding="async" />
                <small>{update.date}</small>
                <h3>{update.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="new-home-quick-access">
        <div className="new-home-container">
          <SectionHeading title="Quick Access" />
          <div className="new-home-quick-grid">
            {[
              ["Blog", "Find expert perspectives on the trends and technologies driving your business.", "blog", "/resources"],
              ["Download Center", "Download new and previously released documents including product documents, solutions, cases and corporate reports.", "download", "/resources"],
              ["Contact Us", "Reach out to us to receive more information, technical support, assistance with complaints and more.", "contact", "/contact"],
            ].map(([title, description, icon, to]) => (
              <Link className="new-home-quick-card" to={to} key={title}>
                <span className="new-home-quick-card__icon"><QuickIcon type={icon} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="new-home-card-link">{title === "Contact Us" ? "Get Support" : "View Now"} <Arrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="new-home-sustainability">
        <div className="new-home-sustainability__background" aria-hidden="true" />
        <div className="new-home-container new-home-sustainability__inner">
          <h2>CHINT Sustainability</h2>
          <p>CHINT believes green solutions and decarbonization are key to driving sustainable development. Our ESG approach integrates economic growth with environmental responsibility and social impact, aligning with global goals for a sustainable future.</p>
          <Link className="new-home-button new-home-button--primary" to="/about">Learn more <Arrow /></Link>
        </div>
      </section>
    </main>
  );
};

export default NewHome;
