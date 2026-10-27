import { Link } from "react-router-dom";
import "./PowerTransmissionandDistribution.css";

const heroImage = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1800&q=88";

const metrics = [
  ["11–36 kV", "Distribution switchgear system scope"],
  ["SF6-free", "RMU options by rating and technology"],
  ["Ring / radial", "Topology aligned with protection"],
  ["RTU ready", "Automation interfaces to specify"],
];

const configurations = [
  ["2L + 1T", "Two line ways + one transformer way", "Fuse-switch or breaker transformer protection?"],
  ["2L + 2T", "Two line ways + two transformer ways", "Independent transformer duty and metering?"],
  ["3L + 1T", "Additional network branch + transformer", "Protection zones and switching authority?"],
  ["Extensible RMU", "Approved future modular expansion", "Bus interface, rating and outage requirements?"],
];

const transformerRows = [
  ["Commercial buildings", "Indoor ventilation, acoustic limits and fire strategy"],
  ["Industrial processes", "Harmonic loading, overload duty and thermal sensors"],
  ["Infrastructure rooms", "Access, maintainability and service continuity"],
  ["Higher MV primary voltage", "Confirm specific available transformer rating"],
];

const protectionRows = [
  ["MV feeder", "Overcurrent / earth fault", "Network fault level and radial / ring operating modes"],
  ["Transformer primary", "Fuse or relay-based interruption", "Inrush, thermal limits and LV downstream clearing"],
  ["LV secondary", "ACB / MCCB protective functions", "Transformer damage curve and final-circuit selectivity"],
  ["Network reconfiguration", "Directional elements where needed", "Backfeed, alternative supply and updated settings"],
];

const workflow = [
  ["01", "Define the network", "Nominal voltage, open points, demand and supply responsibilities."],
  ["02", "Select the ways", "RMU functions, transformer feeders and expansion interfaces."],
  ["03", "Engineer the controls", "Protection, remote operation, cyber boundaries and event data."],
  ["04", "Validate the handover", "Equipment evidence, protection checks and switching procedures."],
];

const measurementApplications = [
  ["meter", "Precision power meters", "Track voltage, current, energy and power quality at boards and feeders. Match the meter class to the measurement purpose.", "BOARD / FEEDER / PROCESS"],
  ["data", "Energy loggers", "Capture interval profiles and equipment duty. Portable or permanent logging supports a defined study period and sampling plan.", "LOAD PROFILE / DEMAND"],
  ["cloud", "IoT monitoring", "Publish selected data through a secure gateway. Device identity, buffering and data ownership make the connection maintainable.", "GATEWAY / HISTORIAN / CLOUD"],
];

const Icon = ({ name }) => {
  const paths = {
    meter: <><path d="M4 15a8 8 0 1 1 16 0" /><path d="m12 15 3-4" /><path d="M5 19h14" /></>,
    data: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v7c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 13v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" /></>,
    cloud: <><path d="M7 18h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6 8.5 4.5 4.5 0 0 0 7 18Z" /><path d="M12 12v5m-2-2 2 2 2-2" /></>,
  };

  return <svg className="ptd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.meter}</svg>;
};

const PowerTransmissionandDistribution = () => (
  <main className="ptd-page">
    <section className="ptd-hero">
      <div className="ptd-container ptd-hero-grid">
        <div className="ptd-hero-copy">
          <p className="ptd-eyebrow">02.2 / MEDIUM-VOLTAGE NETWORKS</p>
          <h1>Distribution</h1>
          <p className="ptd-lead">11–36 kV systems that connect primary substations to local loads. Combine ring main units, correctly rated transformers and smart-grid automation around a clear feeder philosophy.</p>
          <div className="ptd-actions"><a className="ptd-button ptd-button--primary" href="#feeder-architecture">Plan a distribution network <span aria-hidden="true">→</span></a><a className="ptd-button ptd-button--quiet" href="#configurations">Selection guidance <span aria-hidden="true">→</span></a></div>
        </div>
        <figure className="ptd-hero-visual"><img src={heroImage} alt="Medium-voltage distribution switchgear in an industrial room" /><figcaption><span>Ring main unit / compact distribution switching</span><span>CONCEPT EQUIPMENT VISUAL</span></figcaption></figure>
      </div>
      <div className="ptd-container ptd-metric-strip" aria-label="Distribution system summary">{metrics.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div>
    </section>

    <section className="ptd-section ptd-section--tinted" id="feeder-architecture"><div className="ptd-container"><div className="ptd-section-heading"><p className="ptd-eyebrow">FEEDER ARCHITECTURE</p><h2>A ring path with a defined open point.</h2></div><div className="ptd-ring-card"><div className="ptd-diagram-labels"><span>ILLUSTRATIVE 11 kV RING</span><span>Normally open operation / not a switching instruction</span></div><div className="ptd-source-pill">Primary substation / 11 kV bus</div><div className="ptd-ring-diagram" aria-label="Illustrative ring feeder architecture"><span className="ptd-ring-line ptd-ring-line--left" /><span className="ptd-ring-line ptd-ring-line--top" /><span className="ptd-ring-line ptd-ring-line--right" /><span className="ptd-ring-line ptd-ring-line--bottom" /><span className="ptd-open-point" aria-label="Normally open point" /></div><div className="ptd-ring-nodes"><article><h3>RMU A / 2L + 1T</h3><p>Transformer feeder to building services</p></article><article><h3>Normally open point</h3><p>Open switch preserves radial protection zones</p></article><article><h3>RMU B / 2L + 1T</h3><p>Transformer feeder to process loads</p></article></div><p className="ptd-diagram-note">L = ring line way; T = transformer protection way. Validate all switching sequences, protection zones and backfeed conditions with the network operator.</p></div></div></section>

    <section className="ptd-section" id="configurations"><div className="ptd-container"><div className="ptd-section-heading"><p className="ptd-eyebrow">RMU CONFIGURATIONS</p><h2>Specify the ways your network needs.</h2></div><div className="ptd-table-wrap"><table className="ptd-table"><thead><tr><th>Configuration</th><th>Functional arrangement</th><th>Selection questions</th></tr></thead><tbody>{configurations.map(([configuration, arrangement, question]) => <tr key={configuration}><th scope="row">{configuration}</th><td>{arrangement}</td><td>{question}</td></tr>)}</tbody><tfoot><tr><td colSpan="3">SF6-free options may combine solid insulation, clean air and vacuum interruption. Verify the actual RMU voltage, current, fault duty and internal arc classification; do not assume every option covers 36 kV.</td></tr></tfoot></table></div></div></section>

    <section className="ptd-section ptd-section--tinted"><div className="ptd-container"><div className="ptd-section-heading"><p className="ptd-eyebrow">TRANSFORMER APPLICATIONS</p><h2>Select the transformer for its actual duty.</h2></div><div className="ptd-split-layout"><div className="ptd-split-copy"><h3>Dry-type does not mean every voltage.</h3><p>Dry-type transformers suit many indoor and fire-sensitive installations. Their own rated primary voltage, power, insulation class and thermal limits determine suitability—not the broader 11–36 kV network scope.</p><ul><li>Example application: 11 / 0.4 kV cast-resin transformer.</li><li>Confirm losses, cooling class, ventilation and ambient.</li><li>Review harmonics, inrush, impedance and enclosure access.</li></ul></div><div className="ptd-table-wrap"><table className="ptd-table ptd-table--compact"><thead><tr><th>Application</th><th>Design focus</th></tr></thead><tbody>{transformerRows.map(([application, focus]) => <tr key={application}><th scope="row">{application}</th><td>{focus}</td></tr>)}</tbody><tfoot><tr><td colSpan="2">Illustrative 11 / 0.4 kV application only. Require IEC 60076-11 evidence where applicable; no transformer is asserted to cover the full 11–36 kV range.</td></tr></tfoot></table></div></div></div></section>

    <section className="ptd-section" id="automation"><div className="ptd-container"><div className="ptd-section-heading"><p className="ptd-eyebrow">SMART-GRID AUTOMATION</p><h2>Connect switching, sensing and supervision.</h2></div><div className="ptd-automation-card"><div className="ptd-diagram-labels"><span>ILLUSTRATIVE SYSTEM ARCHITECTURE</span><span>Functional links • not an installation drawing</span></div><div className="ptd-source-pill">Utility SCADA → secure gateway / RTU</div><div className="ptd-automation-line" /><div className="ptd-automation-nodes"><article><h3>Switchgear control</h3><p>Position feedback, local / remote mode and interlocked commands.</p></article><article><h3>Feeder sensing</h3><p>Fault passage indicators, current / voltage measurements and timestamps.</p></article><article><h3>Transformer data</h3><p>Temperature, loading and alarms routed to the maintenance view.</p></article></div><p className="ptd-diagram-note">Define command authority, event buffering, time synchronization and loss-of-communications behavior. Remote switching requires approved safety and operating procedures.</p></div></div></section>

    <section className="ptd-section ptd-section--tinted"><div className="ptd-container"><div className="ptd-section-heading"><p className="ptd-eyebrow">PROTECTION GUIDANCE</p><h2>Coordinate the feeder and transformer.</h2></div><div className="ptd-table-wrap"><table className="ptd-table"><thead><tr><th>Protection area</th><th>Functions to assess</th><th>Coordination requirement</th></tr></thead><tbody>{protectionRows.map(([area, functions, requirement]) => <tr key={area}><th scope="row">{area}</th><td>{functions}</td><td>{requirement}</td></tr>)}</tbody></table></div></div></section>

    <section className="ptd-section"><div className="ptd-container"><div className="ptd-section-heading"><p className="ptd-eyebrow">DELIVERY WORKFLOW</p><h2>Move from topology to a maintainable installation.</h2></div><div className="ptd-workflow">{workflow.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>

    <section className="ptd-section ptd-section--tinted"><div className="ptd-container"><div className="ptd-section-heading"><p className="ptd-eyebrow">ENGINEERING NOTES</p><h2>Resolve the network assumptions.</h2></div><div className="ptd-faq"><article><h3>Can the ring remain closed in service?</h3><p>Only if the network and protection are designed for closed-ring operation. The example uses a normally open point to preserve a radial protection philosophy.</p></article><article><h3>Does SF6-free imply no maintenance?</h3><p>No. Operating mechanisms, insulation, terminals and monitoring still require the selected manufacturer’s inspection and maintenance procedures.</p></article><article><h3>What transformer data matters first?</h3><p>Primary / secondary voltage, kVA, impedance, load profile, ambient, cooling and installation conditions. Confirm the actual product’s insulation and type-test requirements.</p></article></div></div></section>

    <section className="ptd-cta"><div className="ptd-container ptd-cta-inner"><div><p className="ptd-eyebrow">NEXT STEP / ENGINEERING REVIEW</p><h2>Give every feeder a clear role.</h2><p>Share your network diagram, voltage, transformer duties and automation objectives for a distribution design discussion.</p></div><Link className="ptd-button ptd-button--primary" to="/contact">Request an MV network review <span aria-hidden="true">→</span></Link></div></section>

    <section className="ptd-section ptd-section--tinted"><div className="ptd-container"><div className="ptd-section-heading"><p className="ptd-eyebrow">PRODUCT APPLICATIONS</p><h2>Measure for the question you need answered.</h2></div><div className="ptd-card-grid">{measurementApplications.map(([icon, title, description, tag]) => <article className="ptd-info-card" key={title}><span className="ptd-icon-wrap"><Icon name={icon} /></span><h3>{title}</h3><p>{description}</p><span className="ptd-card-tag">{tag}</span></article>)}</div></div></section>
  </main>
);

export default PowerTransmissionandDistribution;
