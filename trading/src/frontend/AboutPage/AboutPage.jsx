import { Link } from "react-router-dom";
import "./AboutPage.css";
import AutomationImage from "../../assets/Homepage/Background.png";

const capabilities = [
  {
    number: "01",
    title: "Precision machining",
    description: "Explore milling and turning systems built for repeatable, demanding production work.",
    image: "/images/about/hero-machine.jpg",
    imageAlt: "Close view of a precision cutting tool working on a metal component",
    className: "about-capability--machine",
  },
  {
    number: "02",
    title: "Production automation",
    description: "Connect machine capability with practical automation for a more consistent workflow.",
    image: "/images/about/precision-workshop.jpg",
    imageAlt: "Robotic arms arranged along a factory production line",
    className: "about-capability--automation",
  },
  {
    number: "03",
    title: "Connected production",
    description: "Plan machine capability and automation as one practical production workflow.",
    image: AutomationImage,
    imageAlt: "Robotic arms working along an automotive production line",
    className: "about-capability--planning",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Understand the application",
    description: "Define the material, part geometry, tolerances, and expected production volume.",
    image: "/images/about/hero-machine.jpg",
    imageAlt: "Close view of a cutting tool machining a metal component",
  },
  {
    number: "02",
    title: "Match the right system",
    description: "Compare machine types and configurations against the real work the line needs to do.",
    image: "/images/about/production-line.jpg",
    imageAlt: "Industrial production equipment arranged across a factory floor",
  },
  {
    number: "03",
    title: "Plan the integration",
    description: "Consider tooling, automation, floor space, and operator needs as one connected process.",
    image: AutomationImage,
    imageAlt: "Robotic arms integrated into an automotive production line",
  },
  {
    number: "04",
    title: "Support the next step",
    description: "Keep technical conversations moving through specification, delivery, and ongoing service.",
    image: "/images/about/precision-workshop.jpg",
    imageAlt: "Robotic arms working inside a manufacturing facility",
  },
];

const AboutPage = () => (
  <main className="about-page">
    <section className="about-hero">
      <div className="about-container about-hero-grid">
        <div className="about-hero-copy">
          <p className="about-kicker"><span /> EFSAN MACHINE INDUSTRY</p>
          <h1>
            Precision machines.
            <span>Built for production.</span>
          </h1>
          <p className="about-hero-description">
            The right machine starts with a clear understanding of the work.
            EFSAN brings industrial equipment and application thinking together
            to help production teams make their next move with confidence.
          </p>
          <div className="about-principles" aria-label="Our approach">
            <article>
              <span className="about-principle-index">01</span>
              <h2>Application first</h2>
              <p>Recommendations grounded in the parts you make.</p>
            </article>
            <article>
              <span className="about-principle-index">02</span>
              <h2>Built to perform</h2>
              <p>Machine capability aligned to the process.</p>
            </article>
            <article>
              <span className="about-principle-index">03</span>
              <h2>Support that stays</h2>
              <p>Technical guidance beyond the first decision.</p>
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
            <span>ENGINEERING FOCUS</span>
            <strong>Every detail has a job.</strong>
          </figcaption>
          <div className="about-hero-stamp" aria-label="EFSAN Machine Industry">
            <span>BUILT AROUND</span>
            <strong>YOUR PROCESS</strong>
          </div>
        </figure>
      </div>
    </section>

    <section id="factory" className="about-capabilities" aria-labelledby="about-capabilities-title">
      <div className="about-container">
        <div className="about-section-heading about-capabilities-heading">
          <div>
            <p className="about-kicker about-kicker--orange">MACHINES / AUTOMATION / APPLICATIONS</p>
            <h2 id="about-capabilities-title">Made for the work<br />ahead.</h2>
          </div>
          <p>
            From a single machine to a connected production line, we focus on
            the equipment and decisions that keep manufacturing moving.
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
          <p className="about-kicker about-kicker--orange">A CLEARER ROUTE TO PRODUCTION</p>
          <h2 id="about-process-title">Good decisions,<br />made step by step.</h2>
          <p>Bring the application into focus, then build a plan around it.</p>
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
          <p className="about-kicker">LET'S TALK ABOUT YOUR APPLICATION</p>
          <h2>Find the machine<br />that fits the work.</h2>
          <p>
            Share what you are making and what your production needs next. Our
            team can help you explore a practical path forward.
          </p>
          <Link className="about-contact-link" to="/contact">
            Talk with our team <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <figure className="about-contact-visual">
          <img
            src="/images/about/production-line.jpg"
            alt="Automated industrial production equipment on a factory floor"
            loading="lazy"
          />
          <figcaption><span>ENGINEERED FOR INDUSTRY</span><strong>EFSAN MACHINE INDUSTRY</strong></figcaption>
        </figure>
      </div>
    </section>
  </main>
);

export default AboutPage;
