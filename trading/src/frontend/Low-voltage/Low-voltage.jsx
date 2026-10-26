import { Link } from "react-router-dom";
import "./Low-voltage.css";

const heroImage = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=88";

const productFamilies = [
  {
    icon: "distribution",
    title: "Power distribution",
    description: "Main and sub-main switchboards with ACB or MCCB protection. Choose source topology, access and segregation before sizing the assembly.",
    tags: "MDB / SMDB / DB",
  },
  {
    icon: "control",
    title: "Motor & process control",
    description: "MCC feeders, VFD cabinets and soft starters matched to starting duty, process control and maintenance requirements.",
    tags: "MCC / VFD / PLC",
  },
  {
    icon: "protection",
    title: "Connection & protection",
    description: "Busduct links, outdoor enclosures and coordinated surge and fault protection connect the system at every tier.",
    tags: "BUSBAR / IP66 / SPD",
  },
];

const ratings = [
  ["System voltage", "0.4–0.69 kV (400–690 V)", "Supply, earthing and utilization voltage"],
  ["Main current", "Up to 6300 A, project dependent", "Ambient, diversity and temperature rise"],
  ["Short-circuit duty", "Calculate at each distribution tier", "Icw / Ipk and device breaking capacity"],
  ["Internal separation", "Form 4b when specified", "Cable terminals and access arrangement"],
  ["Assembly requirements", "IEC 61439-1 / -2 as applicable", "Design and routine verification documentation"],
];

const safetyRows = [
  ["Overload", "Thermal protection and conductor coordination"],
  ["Short circuit", "Breaking duty, withstand and discrimination"],
  ["Transient surge", "Coordinated Type 1 / Type 2 / Type 3 SPDs"],
  ["Personnel exposure", "Earthing, barriers and verified isolation"],
];

const applications = [
  {
    icon: "building",
    title: "Commercial buildings",
    description: "Separate tenant, life-safety and mechanical loads. Allow for future circuits, metering boundaries and local isolation.",
    tag: "PRIORITY / CIRCUIT CAPACITY",
  },
  {
    icon: "factory",
    title: "Industrial facilities",
    description: "Group motor loads by process area. Review motor-start voltage drop, harmonic sources and withdrawable feeder access.",
    tag: "PRIORITY / SERVICEABILITY",
  },
  {
    icon: "network",
    title: "Critical infrastructure",
    description: "Review dual supplies, transfer logic and downstream discrimination. Establish essential-load priorities with the owner.",
    tag: "PRIORITY / SOURCE STRATEGY",
  },
];

const workflow = [
  ["01", "Map the loads", "Capture installed demand, diversity, starting duty and expansion allowance."],
  ["02", "Define the sources", "Record transformer impedance, generation, earthing and operating modes."],
  ["03", "Coordinate the tiers", "Size feeders, busbars and protection for each operating case."],
  ["04", "Review the assembly", "Confirm ratings, verification evidence, access and maintainability."],
];

const Icon = ({ name }) => {
  const paths = {
    distribution: <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M9 8h6M9 12h6M9 16h2" /></>,
    control: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /><circle cx="12" cy="12" r="4" /></>,
    protection: <><path d="M12 3 19 6v5c0 4.5-3 8.1-7 10-4-1.9-7-5.5-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    building: <><path d="M5 20V7l7-4 7 4v13" /><path d="M9 20v-4h6v4M9 9h1M14 9h1M9 12h1M14 12h1" /></>,
    factory: <><path d="M3 20V9l6 3V8l6 3V5h6v15H3Z" /><path d="M7 16h1M11 16h1M16 16h1M20 9v-4M20 9h2" /></>,
    network: <><rect x="9" y="3" width="6" height="5" rx="1" /><rect x="3" y="16" width="6" height="5" rx="1" /><rect x="15" y="16" width="6" height="5" rx="1" /><path d="M12 8v4M6 16v-4h12v4" /></>,
  };

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const LowVoltage = () => (
  <main className="low-voltage-page">
    <section className="lv-hero">
      <div className="lv-container lv-hero-grid">
        <div className="lv-hero-copy">
          <p className="lv-eyebrow">01 / LOW-VOLTAGE ARCHITECTURE</p>
          <h1>Low-voltage</h1>
          <p className="lv-lead">A coordinated path from the main incomer to the final circuit. Plan distribution, motor control and protection around the demands of your installation.</p>
          <div className="lv-actions">
            <a className="lv-button lv-button--primary" href="#system-map">Plan your architecture <span aria-hidden="true">→</span></a>
            <a className="lv-button lv-button--quiet" href="#ratings">Selection guidance <span aria-hidden="true">→</span></a>
          </div>
        </div>

        <figure className="lv-hero-visual">
          <img src={heroImage} alt="Low-voltage electrical distribution switchboards in an industrial facility" />
          <figcaption><span>Main distribution lineup / low-voltage infrastructure</span><span>CONCEPT EQUIPMENT VISUAL</span></figcaption>
        </figure>
      </div>

      <div className="lv-container lv-metric-strip" aria-label="Low-voltage platform summary">
        <div><strong>400–690 V</strong><span>0.4–0.69 kV system range</span></div>
        <div><strong>Up to 6300 A</strong><span>Main busbar selection envelope</span></div>
        <div><strong>Form 4b</strong><span>Separation option to specify</span></div>
        <div><strong>3 tiers</strong><span>Main → sub → final distribution</span></div>
      </div>
    </section>

    <section className="lv-section lv-section--tinted" id="system-map">
      <div className="lv-container">
        <div className="lv-section-heading">
          <p className="lv-eyebrow">SYSTEM MAP</p>
          <h2>One architecture. Three distribution tiers.</h2>
          <p>Start with the source, assign each load to a distribution tier, then coordinate the protective devices across the complete path.</p>
        </div>

        <div className="lv-map-card">
          <div className="lv-map-card-top"><span>ILLUSTRATIVE SYSTEM ARCHITECTURE</span><span>Functional links • not an installation drawing</span></div>
          <div className="lv-source-pill">Transformer / generator <span aria-hidden="true">→</span> main switchboard</div>
          <div className="lv-tier-flow">
            <article><h3>Main distribution</h3><p>MDB + ACB incomers. Source switching, bus coupling and high-current distribution.</p></article>
            <span className="lv-flow-arrow" aria-hidden="true">→</span>
            <article><h3>Sub distribution</h3><p>MCC + sub-main boards. Group process loads and distribute power through busduct.</p></article>
            <span className="lv-flow-arrow" aria-hidden="true">→</span>
            <article><h3>Final distribution</h3><p>DB panels. Local circuits, residual-current protection, SPDs and AFDDs where required.</p></article>
          </div>
          <p className="lv-map-note">Read left to right: feeders cascade MDB → sub-main / MCC → DB. Direct final feeders may also originate at the MDB, according to the load and protection study.</p>
        </div>
      </div>
    </section>

    <section className="lv-section">
      <div className="lv-container">
        <div className="lv-section-heading">
          <p className="lv-eyebrow">PRODUCT FAMILIES</p>
          <h2>Build around the load, not just the enclosure.</h2>
        </div>
        <div className="lv-card-grid">
          {productFamilies.map((family) => (
            <article className="lv-info-card" key={family.title}>
              <span className="lv-icon"><Icon name={family.icon} /></span>
              <h3>{family.title}</h3>
              <p>{family.description}</p>
              <span className="lv-card-tag">{family.tags}</span>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="lv-section lv-section--tinted" id="ratings">
      <div className="lv-container">
        <div className="lv-section-heading">
          <p className="lv-eyebrow">SELECTION ENVELOPE</p>
          <h2>Ratings that shape the specification.</h2>
          <p>The values below describe design inputs, not a guarantee that every assembly covers every rating.</p>
        </div>
        <div className="lv-table-wrap">
          <table className="lv-table">
            <thead><tr><th>Parameter</th><th>Architecture input</th><th>What to verify</th></tr></thead>
            <tbody>{ratings.map(([parameter, input, verify]) => <tr key={parameter}><th scope="row">{parameter}</th><td>{input}</td><td>{verify}</td></tr>)}</tbody>
            <tfoot><tr><td colSpan="3">Specify actual manufacturer ratings and verification records for the proposed configuration. Form 4b alone does not establish arc-fault containment.</td></tr></tfoot>
          </table>
        </div>
      </div>
    </section>

    <section className="lv-section" id="safety">
      <div className="lv-container">
        <div className="lv-section-heading">
          <p className="lv-eyebrow">SAFETY BY DESIGN</p>
          <h2>Separate the risks. Coordinate the protection.</h2>
        </div>
        <div className="lv-safety-layout">
          <div className="lv-safety-copy">
            <h3>Continuity begins with a fault study.</h3>
            <p>Selectivity links the branch breaker, upstream protection and the available fault energy. A well-segregated board still needs a safe operating philosophy.</p>
            <ul><li>Check time-current curves and energy selectivity against manufacturer tables.</li><li>Define isolation, lockout and safe working clearances.</li><li>Assess arc-flash risk and specify tested arc containment separately.</li></ul>
          </div>
          <div className="lv-table-wrap">
            <table className="lv-table lv-table--compact"><thead><tr><th>Risk</th><th>Design response</th></tr></thead><tbody>{safetyRows.map(([risk, response]) => <tr key={risk}><th scope="row">{risk}</th><td>{response}</td></tr>)}</tbody></table>
          </div>
        </div>
      </div>
    </section>

    <section className="lv-section lv-section--tinted">
      <div className="lv-container">
        <div className="lv-section-heading">
          <p className="lv-eyebrow">APPLICATION GUIDANCE</p>
          <h2>Different loads. Different design priorities.</h2>
        </div>
        <div className="lv-card-grid">
          {applications.map((application) => <article className="lv-info-card" key={application.title}><span className="lv-icon"><Icon name={application.icon} /></span><h3>{application.title}</h3><p>{application.description}</p><span className="lv-card-tag">{application.tag}</span></article>)}
        </div>
      </div>
    </section>

    <section className="lv-section">
      <div className="lv-container">
        <div className="lv-section-heading">
          <p className="lv-eyebrow">ENGINEERING WORKFLOW</p>
          <h2>From load schedule to coordinated system.</h2>
        </div>
        <div className="lv-workflow">
          {workflow.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </div>
    </section>

    <section className="lv-section lv-section--tinted">
      <div className="lv-container">
        <div className="lv-section-heading">
          <p className="lv-eyebrow">ENGINEERING NOTES</p>
          <h2>Questions before you specify.</h2>
        </div>
        <div className="lv-faq">
          <article><h3>Does 6300 A apply to every board?</h3><p>No. It is the upper selection envelope for main distribution. The exact assembly rating depends on construction, temperature rise, ventilation and installation conditions.</p></article>
          <article><h3>When is Form 4b appropriate?</h3><p>Consider it where separation of functional units and associated terminals supports the operating and maintenance strategy. Verify the precise separation arrangement with the assembly supplier.</p></article>
          <article><h3>What should accompany an enquiry?</h3><p>A single-line diagram, load schedule, fault level, site ambient, enclosure requirement and supply operating modes give the engineering team a useful starting point.</p></article>
        </div>
      </div>
    </section>

    <section className="lv-cta">
      <div className="lv-container lv-cta-inner">
        <div><p className="lv-eyebrow">NEXT STEP / ENGINEERING REVIEW</p><h2>Give your project a clear electrical backbone.</h2><p>Share your single-line diagram and load schedule for an architecture and equipment selection discussion.</p></div>
        <Link className="lv-button lv-button--primary" to="/contact">Request architecture review <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  </main>
);

export default LowVoltage;
