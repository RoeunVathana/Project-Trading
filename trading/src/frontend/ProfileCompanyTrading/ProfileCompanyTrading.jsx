import { useState } from "react";
import { Link } from "react-router-dom";
import "./ProfileCompanyTrading.css";

const logoUrl = (name) => `${import.meta.env.BASE_URL}logoCHINT/${encodeURIComponent(name)}`;

const customerLogos = [
  "AES logo.svg",
  "ARCHETYPE GROUP - LOGO.png",
  "ATE Logo.png",
  "DBD Engineering LOGO.png",
  "EDC - Logo.png",
  "EMC - Logo.png",
  "GREEN POWER LOGO-01-01.png",
  "KSR Logo.JPG",
  "Logo - EGE.png",
  "Logo - Master MEP.jpg",
  "Logo - Meng Brother.jpg",
  "Logo - SOMA Energy.png",
  "MAUSO - Logo.png",
  "Mekong Land - Logo.png",
  "MVEs Logo.JPG",
  "PATtech - Logo.png",
];

const services = [
  { icon: "plug", title: "Electrical Distribution", text: "Low-voltage to main and sub power distribution" },
  { icon: "factory", title: "Industrial Control", text: "Control, automation and power quality solutions" },
  { icon: "gauge", title: "Instruments & Meters", text: "Measurement and electricity metering products" },
];

const productLines = [
  { category: "Power", icon: "plug", title: "Low-voltage", description: "Circuit breakers, contactors and protection devices for everyday power needs.", href: "/low-voltage" },
  { category: "Power", icon: "bolt", title: "Power Distribution", description: "Main, sub and final distribution equipment for safe, organised power.", href: "/power-transmission-distribution" },
  { category: "Control", icon: "factory", title: "Industrial Control", description: "Control gear and automation components for machines and production lines.", href: "/product?solution=industrial-control" },
  { category: "Power", icon: "layers", title: "Transmission & Distribution", description: "Products supporting reliable power transmission and distribution networks.", href: "/distribution" },
  { category: "Control", icon: "pulse", title: "Power Quality & Automation", description: "Solutions that improve power quality and automate energy systems.", href: "/product?solution=power-quality" },
  { category: "Measurement", icon: "gauge", title: "Instruments & Meters", description: "Measurement instruments and electricity meters for accurate monitoring.", href: "/instruments-and-meters" },
];

const Icon = ({ name }) => {
  const shapes = {
    plug: <><path d="M9 3v5M15 3v5M7 8h10v2a5 5 0 0 1-10 0V8Z" /><path d="M12 15v6" /></>,
    factory: <><path d="M4 21V8l6 3V8l6 3V5h4v16H4Z" /><path d="M8 15h1M12 15h1M16 15h1M8 18h1M12 18h1M16 18h1" /></>,
    gauge: <><path d="M4 15a8 8 0 1 1 16 0" /><path d="m12 15 3-4" /><path d="M5 19h14" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    pulse: <path d="M3 12h4l2-6 4 12 2-6h6" />,
    arrow: <><path d="M5 12h13" /><path d="m13 7 5 5-5 5" /></>,
  };

  return <svg className="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
};

const ProfileCompanyTrading = () => {
  const [category, setCategory] = useState("All Products");
  const visibleProducts = category === "All Products" ? productLines : productLines.filter((product) => product.category === category);
  const logoTrack = [...customerLogos, ...customerLogos];

  return (
    <main className="profile-company-page">
      <section className="profile-hero" aria-labelledby="profile-hero-title">
        <div className="profile-container profile-hero-grid">
          <div className="profile-hero-copy">
            <p className="profile-badge"><span /> Company Profile</p>
            <h1 id="profile-hero-title">Powering Industry<br />with <em>Reliable<br />Electrical Solutions</em></h1>
            <p className="profile-hero-description">SchneiTec Trading supplies low-voltage, power distribution and industrial control products to engineers, contractors and developers — backed by dependable service.</p>
            <div className="profile-hero-actions">
              <Link className="profile-button profile-button--primary" to="#products">Our Product Lines <Icon name="arrow" /></Link>
              <Link className="profile-button profile-button--soft" to="#customers">Meet Our Customers</Link>
            </div>
          </div>

          <aside className="profile-what-we-do" aria-labelledby="what-we-do-title">
            <h2 id="what-we-do-title">What We Do</h2>
            <p>One trusted source for electrical and industrial supply.</p>
            <div className="profile-service-list">
              {services.map((service) => (
                <article className="profile-service" key={service.title}>
                  <span className="profile-service-icon"><Icon name={service.icon} /></span>
                  <div><h3>{service.title}</h3><p>{service.text}</p></div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="profile-about" aria-labelledby="profile-about-title">
        <div className="profile-container">
          <div className="profile-section-heading">
            <p className="profile-badge">About Us</p>
            <h2 id="profile-about-title">About SchneiTec Trading</h2>
            <p>SchneiTec Trading is a distributor of electrical and industrial products, supporting engineers, contractors and developers with dependable supply, technical know-how and responsive service.</p>
          </div>
          <div className="profile-value-grid">
            <article className="profile-value-card"><span><Icon name="layers" /></span><h3>Quality You Can Trust</h3><p>Carefully selected products that meet industry standards for safety and performance.</p></article>
            <article className="profile-value-card"><span><Icon name="bolt" /></span><h3>Technical Support</h3><p>Practical guidance from product selection through to installation and after-sales.</p></article>
            <article className="profile-value-card"><span><Icon name="gauge" /></span><h3>On-Time Delivery</h3><p>Dependable supply and logistics that keep your projects on schedule.</p></article>
          </div>
          <div className="profile-stats" aria-label="Company statistics">
            <div><strong>6</strong><span>Product lines</span></div>
            <div><strong>13</strong><span>Featured customers</span></div>
            <div><strong>25</strong><span>Provinces covered</span></div>
          </div>
        </div>
      </section>

      <section className="profile-products" id="products" aria-labelledby="profile-products-title">
        <div className="profile-container">
          <div className="profile-section-heading">
            <p className="profile-badge">Product Lines</p>
            <h2 id="profile-products-title">Our Product Lines</h2>
            <p>Six product families covering power distribution, control, automation and measurement.</p>
          </div>
          <div className="profile-product-tabs" role="tablist" aria-label="Product categories">
            {["All Products", "Power", "Control", "Measurement"].map((tab) => (
              <button className={category === tab ? "is-active" : ""} key={tab} type="button" role="tab" aria-selected={category === tab} onClick={() => setCategory(tab)}>{tab}</button>
            ))}
          </div>
          <div className="profile-product-grid">
            {visibleProducts.map((product) => (
              <article className="profile-product-card" key={product.title}>
                <span className="profile-product-icon"><Icon name={product.icon} /></span>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <Link to={product.href}>Explore <Icon name="arrow" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="profile-customers" id="customers" aria-labelledby="profile-customers-title">
        <div className="profile-container profile-section-heading">
          <p className="profile-badge profile-badge--warm">Our Customers</p>
          <h2 id="profile-customers-title">Trusted by Our Customers</h2>
          <p>Contractors, developers and engineering firms who rely on SchneiTec Trading for their projects.</p>
        </div>
        <div className="profile-logo-slider" aria-label="Customer logos">
          <div className="profile-logo-track">
            {logoTrack.map((logo, index) => (
              <div className="profile-logo-card" key={`${logo}-${index}`} aria-hidden={index >= customerLogos.length}>
                <img src={logoUrl(logo)} alt={index < customerLogos.length ? logo.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") : ""} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="profile-cta" aria-labelledby="profile-cta-title">
        <div className="profile-container profile-cta-inner">
          <div><h2 id="profile-cta-title">Ready to power your next<br />project?</h2><p>Talk to the SchneiTec Trading team about products, pricing and project support.</p></div>
          <div className="profile-cta-actions"><Link className="profile-cta-button profile-cta-button--light" to="/contact">Contact Us</Link><Link className="profile-cta-button profile-cta-button--outline" to="/product">View Products</Link></div>
        </div>
      </section>
    </main>
  );
};

export default ProfileCompanyTrading;
