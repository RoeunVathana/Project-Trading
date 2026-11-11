import { Link } from "react-router-dom";
import "./ProfileCompanyMufacturing.css";

const capabilities = [
  { number: "01", title: "Electrical Enclosures", text: "Custom-built cabinets, panels and protective housings designed for safe equipment integration." },
  { number: "02", title: "Power Distribution Assemblies", text: "Low-voltage distribution assemblies engineered for organised, reliable power delivery." },
  { number: "03", title: "Metal Fabrication", text: "Precision cutting, forming and assembly for components and project-specific requirements." },
  { number: "04", title: "Industrial Control Systems", text: "Control panels and integrated assemblies that support efficient machine and process operation." },
];

const processSteps = [
  { number: "01", title: "Discover", text: "Understand application, specifications and operating conditions." },
  { number: "02", title: "Engineer", text: "Confirm drawings, materials and production requirements." },
  { number: "03", title: "Manufacture", text: "Fabricate and assemble with controlled processes." },
  { number: "04", title: "Verify", text: "Inspect, test and prepare products for delivery." },
];

const industries = ["Energy & Utilities", "Building & Infrastructure", "Industrial Facilities", "Engineering & EPC"];

const ProfileCompanyMufacturing = () => (
  <main className="profile-manufacturing-page">
    <section className="manufacturing-hero" aria-labelledby="manufacturing-hero-title">
      <div className="manufacturing-container manufacturing-hero-grid">
        <div className="manufacturing-hero-copy">
          <p className="manufacturing-badge"><span /> Company Profile</p>
          <h1 id="manufacturing-hero-title">Built to Manufacture.<br />Engineered to Perform.</h1>
          <p className="manufacturing-lead">A modern manufacturing partner delivering precision-built electrical, industrial and engineered solutions — from concept and fabrication to quality-tested delivery.</p>
          <div className="manufacturing-actions">
            <Link className="manufacturing-button manufacturing-button--primary" to="#capabilities">Explore Capabilities</Link>
            <Link className="manufacturing-text-link" to="#process">Discover Our Process <span aria-hidden="true">→</span></Link>
          </div>
          <p className="manufacturing-meta">ENGINEERING-LED MANUFACTURING&nbsp; • &nbsp;CAMBODIA</p>
        </div>
        <figure className="manufacturing-hero-visual">
          <img src="/images/about/production-line.jpg" alt="Automated industrial manufacturing production line" />
          <figcaption>PRECISION&nbsp; / &nbsp;PROCESS&nbsp; / &nbsp;PERFORMANCE</figcaption>
        </figure>
      </div>
    </section>

    <section className="manufacturing-who" aria-labelledby="manufacturing-who-title">
      <div className="manufacturing-container manufacturing-who-grid">
        <div className="manufacturing-copy">
          <p className="manufacturing-badge">Who We Are</p>
          <h2 id="manufacturing-who-title">Manufacturing built around reliability and precision.</h2>
          <p>SchneiTec Manufacturing brings together engineering expertise, disciplined production and dependable quality control. We turn technical requirements into practical products and assemblies that support infrastructure, industry and everyday operations.</p>
          <p>From material selection to final inspection, every stage is guided by clear specifications, skilled teams and a commitment to consistent performance.</p>
        </div>
        <article className="manufacturing-mindset-card">
          <strong>01</strong>
          <h3>One integrated production mindset</h3>
          <dl>
            <div><dt>Engineering</dt><dd>Design-led thinking from the first brief</dd></div>
            <div><dt>Production</dt><dd>Repeatable processes and skilled execution</dd></div>
            <div><dt>Quality</dt><dd>Inspection at every critical stage</dd></div>
          </dl>
        </article>
      </div>
    </section>

    <section className="manufacturing-capabilities" id="capabilities" aria-labelledby="manufacturing-capabilities-title">
      <div className="manufacturing-container">
        <p className="manufacturing-badge">What We Make</p>
        <h2 id="manufacturing-capabilities-title">Capabilities for demanding industrial environments.</h2>
        <p className="manufacturing-section-intro">A connected range of manufacturing services designed to move projects from specification to dependable finished output.</p>
        <div className="manufacturing-capability-grid">
          {capabilities.map((item) => <article className="manufacturing-capability-card" key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="manufacturing-process" id="process" aria-labelledby="manufacturing-process-title">
      <div className="manufacturing-container">
        <p className="manufacturing-badge">How We Work</p>
        <h2 id="manufacturing-process-title">A clear process. Consistent results.</h2>
        <p className="manufacturing-section-intro">Every project follows a structured workflow that keeps requirements, production and quality aligned.</p>
        <div className="manufacturing-process-grid">
          {processSteps.map((step, index) => <article className="manufacturing-process-card" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p>{index < processSteps.length - 1 && <b aria-hidden="true">→</b>}</article>)}
        </div>
      </div>
    </section>

    <section className="manufacturing-quality" aria-labelledby="manufacturing-quality-title">
      <div className="manufacturing-container manufacturing-quality-grid">
        <div><p className="manufacturing-badge">Quality Commitment</p><h2 id="manufacturing-quality-title">Quality is built into every stage.</h2><p>We apply clear work instructions, material checks and documented inspections to help ensure each product meets its agreed requirements before it leaves the facility.</p></div>
        <div className="manufacturing-quality-list">
          <div><strong>Material Control</strong><p>Incoming material checks and traceability.</p></div>
          <div><strong>In-Process Checks</strong><p>Critical dimensions and assembly checkpoints.</p></div>
          <div><strong>Final Inspection</strong><p>Visual, functional and specification review.</p></div>
        </div>
      </div>
    </section>

    <section className="manufacturing-industries" aria-labelledby="manufacturing-industries-title">
      <div className="manufacturing-container">
        <p className="manufacturing-badge">Where We Work</p>
        <h2 id="manufacturing-industries-title">Made for the systems that keep business and communities moving.</h2>
        <div className="manufacturing-industry-grid">{industries.map((industry) => <article key={industry}><span>{industry}</span></article>)}</div>
      </div>
    </section>

    <section className="manufacturing-cta" aria-labelledby="manufacturing-cta-title">
      <div className="manufacturing-container manufacturing-cta-inner"><div><h2 id="manufacturing-cta-title">Have a manufacturing project in mind?</h2><p>Talk with our team about specifications, production options and project requirements.</p></div><Link className="manufacturing-button manufacturing-button--light" to="/contact">Talk to Our Team</Link></div>
    </section>
  </main>
);

export default ProfileCompanyMufacturing;
