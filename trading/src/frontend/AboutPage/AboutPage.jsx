import { Link } from "react-router-dom";
import "./AboutPage.css";
import AutomationImage from "../../assets/Homepage/Background.png";

const capabilities = [
  {
    number: "01",
    title: "CHINT LV & MV solutions",
    description: "Founded in 1984 and active across 140+ countries, CHINT provides circuit breakers, contactors, distribution boxes, transformers, switchgear, and protective equipment. SchneiTec and CHINT also support local electrical manufacturing in Cambodia.",
    image: "/images/about/hero-machine.jpg",
    imageAlt: "Close view of a precision cutting tool working on a metal component",
    className: "about-capability--machine",
  },
  {
    number: "02",
    title: "Huawei FusionSolar",
    description: "String inverters, energy storage systems, and smart power monitoring for residential, commercial, industrial, and utility-scale solar projects.",
    image: "/images/about/precision-workshop.jpg",
    imageAlt: "Robotic arms arranged along a factory production line",
    className: "about-capability--automation",
  },
  {
    number: "03",
    title: "Integrated project support",
    description: "Professional technical expertise, responsive customer service, and reliable after-sales support from product selection through delivery.",
    image: AutomationImage,
    imageAlt: "Robotic arms working along an automotive production line",
    className: "about-capability--planning",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Understand the requirement",
    description: "Start with the site, load profile, project goals, and long-term operating needs.",
    image: "/images/about/abstract digital representation of a machine part, 3d wireframe glowing blue, cyber physical system.png",
    imageAlt: "Close view of a cutting tool machining a metal component",
  },
  {
    number: "02",
    title: "Match the right solution",
    description: "Select the appropriate CHINT LV/MV equipment or Huawei solar and storage system for the application.",
    image: "/images/about/futuristic sleek cnc control panel with holographic interface and artificial intelligence nodes.png",
    imageAlt: "Industrial production equipment arranged across a factory floor",
  },
  {
    number: "03",
    title: "Plan the integration",
    description: "Coordinate equipment, protection, monitoring, installation, and commissioning as one connected process.",
    image: "/images/about/vintage 1980s industrial cnc machine blueprint, white lines on blue background, technical drawing.png",
    imageAlt: "Robotic arms integrated into an automotive production line",
  },
  {
    number: "04",
    title: "Support the next step",
    description: "Keep technical conversations moving through specification, delivery, and dependable after-sales service.",
    image: "/images/about/modern 5-axis cnc milling machine tool head with coolant spraying, high speed action shot.png",
    imageAlt: "Industrial production equipment arranged across a factory floor",
  },
];

const AboutPage = () => (
  <main className="about-page">
    <section className="about-hero">
      <div className="about-container about-hero-grid">
        <div className="about-hero-copy">
          <p className="about-kicker"><span /> SCHNEITEC TRADING CO., LTD.</p>
          <h1>
            Reliable electrical solutions.
            <span>Built for Cambodia.</span>
          </h1>
          <p className="about-hero-description">
            SchneiTec Trading is a leading supplier and distributor of high-quality
            electrical equipment and solar energy solutions, connecting global
            technology with the needs of Cambodia's growing market.
          </p>
          <div className="about-principles" aria-label="Our approach">
            <article>
              <span className="about-principle-index">01</span>
              <h2>LV / MV systems</h2>
              <p>Reliable equipment for industrial, commercial, and residential applications.</p>
            </article>
            <article>
              <span className="about-principle-index">02</span>
              <h2>Solar energy</h2>
              <p>FusionSolar solutions for rooftops, C&amp;I projects, and solar farms.</p>
            </article>
            <article>
              <span className="about-principle-index">03</span>
              <h2>Local support</h2>
              <p>Technical expertise, responsive service, and dependable after-sales care.</p>
            </article>
          </div>
        </div>

        <figure className="about-hero-visual">
          <img
            src="/images/about/hero-machine.jpg"
            alt="Precision cutting tool machining a metal component"
          />
          <div className="about-hero-image-frame" aria-hidden="true" />
          <figcaption className="about-hero-caption">
            <span>POWERING CAMBODIA</span>
            <strong>Every connection has a purpose.</strong>
          </figcaption>
          <div className="about-hero-stamp" aria-label="SchneiTec Trading partnerships">
            <span>STRATEGIC PARTNERS</span>
            <strong>CHINT + HUAWEI</strong>
          </div>
        </figure>
      </div>
    </section>

    <section id="factory" className="about-capabilities" aria-labelledby="about-capabilities-title">
      <div className="about-container">
        <div className="about-section-heading about-capabilities-heading">
          <div>
            <p className="about-kicker about-kicker--orange">STRATEGIC PARTNERSHIPS &amp; CORE SOLUTIONS</p>
            <h2 id="about-capabilities-title">Powering the work<br />ahead.</h2>
          </div>
          <p>
            Through strong partnerships with globally recognized manufacturers,
            we deliver quality, efficiency, and long-term value across electrical
            distribution and renewable energy projects.
          </p>
        </div>

        <div className="about-capability-grid">
          {capabilities.map((item) => (
            <article className={`about-capability ${item.className}`} key={item.number}>
              <figure>
                <img src={item.image} alt={item.imageAlt} loading="lazy" />
                <span className="about-capability-number">{item.number}</span>
                <span className="about-capability-shade" aria-hidden="true" />
              </figure>
              <div className="about-capability-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="about-process" aria-labelledby="about-process-title">
      <div className="about-container">
        <div className="about-process-heading">
          <p className="about-kicker about-kicker--orange">FROM SPECIFICATION TO SUPPORT</p>
          <h2 id="about-process-title">Reliable solutions,<br />built step by step.</h2>
          <p>Bring the project into focus, then build a practical plan around it.</p>
        </div>

        <div className="about-process-list">
          {processSteps.map((step, index) => (
            <article className={`about-process-step ${index % 2 ? "about-process-step--right" : "about-process-step--left"}`} key={step.number}>
              <div className="about-process-copy">
                <span>{step.number} <i /></span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <span className="about-process-node" aria-hidden="true" />
              <figure className="about-process-visual">
                <img src={step.image} alt={step.imageAlt} loading="lazy" />
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="about-contact">
      <div className="about-container about-contact-grid">
        <div className="about-contact-copy">
          <p className="about-kicker">LET'S TALK ABOUT YOUR PROJECT</p>
          <h2>Build a stronger<br />energy future.</h2>
          <p>
            Share your electrical or solar project requirements with SchneiTec
            Trading. Our team can help you explore a practical path forward.
          </p>
          <Link className="about-contact-link" to="/contact">
            Contact our team <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <figure className="about-contact-visual">
          <img
            src="/images/about/production-line.jpg"
            alt="Automated industrial production equipment on a factory floor"
            loading="lazy"
          />
          <figcaption><span>ENGINEERED FOR CAMBODIA</span><strong>SCHNEITEC TRADING</strong></figcaption>
        </figure>
      </div>
    </section>
  </main>
);

export default AboutPage;
