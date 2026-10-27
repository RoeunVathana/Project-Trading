import { Link } from "react-router-dom";
import "./InstrumentsandMeters.css";

const metrics = [
  ["Sensor → data", "Traceable measurement architecture"],
  ["CT / Rogowski", "Current sensing by application"],
  ["Interval logs", "Energy and demand over time"],
  ["IoT ready", "Secure gateway integration"],
];

const chainSteps = [
  ["sense", "Sense", "CT / Rogowski coil / voltage input"],
  ["measure", "Measure", "Compatible meter or integrator"],
  ["log", "Log", "Time-stamped interval data"],
  ["connect", "Connect", "Gateway → secure IoT platform"],
];

const sensorRows = [
  ["Solid-core CT", "Permanent metering with defined ratio", "Installation access, burden and secondary safety"],
  ["Split-core CT", "Retrofit installation around existing conductors", "Core closure, ratio / phase error and input type"],
  ["Rogowski coil", "Flexible AC current sensing on large conductors", "Compatible integrator / meter; no DC measurement"],
  ["Direct current input", "Meters designed for direct connection", "Current limit, isolation and terminal requirements"],
];

const purposeRows = [
  ["Energy allocation", "Stable ratios, traceability and defined interval data"],
  ["Operational monitoring", "Measurement range, refresh rate and communication"],
  ["Power-quality study", "Bandwidth, event capture and assessment method"],
  ["Revenue billing", "Jurisdiction-approved meter and installation requirements"],
];

const intervals = [
  ["00:00", 26], ["02:00", 22], ["04:00", 18], ["06:00", 25], ["08:00", 42],
  ["10:00", 68], ["12:00", 78], ["14:00", 82], ["16:00", 76], ["18:00", 72],
  ["20:00", 48], ["22:00", 31],
];

const ioNodes = [
  ["Local records", "Timestamp, interval, units, scaling and quality flags stored with each reading."],
  ["Enterprise data", "Historian or IoT ingestion with authenticated interfaces and role-based access."],
  ["Engineering analysis", "Profiles, alarms and energy allocations built from validated records."],
];

const faqs = [
  ["Can a Rogowski coil measure DC?", "No. It senses changing current and requires a compatible integrator or instrument input. Confirm low-frequency performance and the complete sensor / meter pairing."],
  ["What should an energy logger store?", "At minimum: timestamps, units, interval definitions, scaling, quality flags and configuration. Retain the current-sensor ratios and any relevant changes during the study."],
  ["Does IoT monitoring replace revenue metering?", "Not automatically. Revenue use requires the applicable legal metrology approvals and installation requirements. Internal monitoring is a separate application."],
];

const Icon = ({ name }) => {
  const paths = {
    sense: <><path d="M5 16a7 7 0 0 1 14 0" /><path d="M8 16v2M16 16v2M12 9v7" /></>,
    measure: <><circle cx="12" cy="12" r="8" /><path d="m12 12 4-4M8 16h8" /></>,
    log: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v7c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 13v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" /></>,
    connect: <><path d="M7 18h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6 8.5 4.5 4.5 0 0 0 7 18Z" /><path d="M12 12v5m-2-2 2 2 2-2" /></>,
    meter: <><path d="M4 15a8 8 0 1 1 16 0" /><path d="m12 15 3-4M5 19h14" /></>,
    data: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v7c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 13v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" /></>,
    cloud: <><path d="M7 18h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6 8.5 4.5 4.5 0 0 0 7 18Z" /><path d="M12 12v5m-2-2 2 2 2-2" /></>,
  };

  return <svg className="iam-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.measure}</svg>;
};

const SectionHeading = ({ eyebrow, title, children }) => (
  <div className="iam-section-heading">
    <p className="iam-eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    {children}
  </div>
);

const InstrumentsandMeters = () => (
  <main className="iam-page">
    <section className="iam-hero">
      <div className="iam-container iam-hero-grid">
        <div className="iam-hero-copy">
          <p className="iam-eyebrow">03 / MEASUREMENT YOU CAN TRACE</p>
          <h1>Instruments and<br />Meters</h1>
          <p className="iam-lead">Connect precision metering, Rogowski coils and energy loggers into a complete measurement chain. Specify the accuracy, timing and data interfaces that make monitoring useful.</p>
          <div className="iam-actions">
            <a className="iam-button iam-button--primary" href="#measurement-architecture">Select a measurement chain <span aria-hidden="true">&rarr;</span></a>
            <a className="iam-button iam-button--quiet" href="#sensor-comparison">Selection guidance <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>

        <div className="iam-hero-visual" aria-label="Illustrative measurement chain visual">
          <div className="iam-visual-label">MEASUREMENT CHAIN / METER, COIL AND LOGGER</div>
          <div className="iam-visual-canvas">
            <div className="iam-visual-grid" />
            <div className="iam-visual-signal iam-visual-signal--one" />
            <div className="iam-visual-signal iam-visual-signal--two" />
            <div className="iam-visual-signal iam-visual-signal--three" />
            <div className="iam-meter-orb"><Icon name="meter" /><strong>kWh</strong><small>TRACE</small></div>
            <div className="iam-visual-chip iam-visual-chip--top">CURRENT INPUT</div>
            <div className="iam-visual-chip iam-visual-chip--bottom">INTERVAL / QUALITY / LOAD</div>
          </div>
          <p className="iam-visual-caption">CONCEPT EQUIPMENT VISUAL</p>
        </div>
      </div>

      <div className="iam-container iam-metric-strip" aria-label="Measurement system summary">
        {metrics.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}
      </div>
    </section>

    <section className="iam-section iam-section--tinted" id="measurement-architecture">
      <div className="iam-container">
        <SectionHeading eyebrow="MEASUREMENT ARCHITECTURE" title="Every link contributes to the result." />
        <div className="iam-chain-card">
          <div className="iam-card-label">ILLUSTRATIVE MEASUREMENT CHAIN</div>
          <div className="iam-chain-grid">
            {chainSteps.map(([icon, title, description], index) => (
              <div className="iam-chain-step" key={title}>
                <div className="iam-chain-icon"><Icon name={icon} /></div>
                <h3>{title}</h3>
                <p>{description}</p>
                {index < chainSteps.length - 1 && <span className="iam-chain-arrow" aria-hidden="true">&rarr;</span>}
              </div>
            ))}
          </div>
          <p className="iam-note">Accuracy is a chain property: sensor ratio / phase error, meter performance, installation and configuration all contribute. Match sensor output to the instrument input.</p>
        </div>
      </div>
    </section>

    <section className="iam-section" id="sensor-comparison">
      <div className="iam-container">
        <SectionHeading eyebrow="SENSOR COMPARISON" title="Match the sensor to the conductor and the duty." />
        <div className="iam-table-wrap">
          <table className="iam-table">
            <thead><tr><th>Sensor</th><th>Application fit</th><th>Selection constraints</th></tr></thead>
            <tbody>{sensorRows.map(([sensor, fit, constraints]) => <tr key={sensor}><th scope="row">{sensor}</th><td>{fit}</td><td>{constraints}</td></tr>)}</tbody>
            <tfoot><tr><td colSpan="3">Never open-circuit an energized conventional current-output CT secondary. Follow approved shorting, isolation and installation procedures.</td></tr></tfoot>
          </table>
        </div>
      </div>
    </section>

    <section className="iam-section iam-section--tinted">
      <div className="iam-container">
        <SectionHeading eyebrow="PRODUCT APPLICATIONS" title="Measure for the question you need answered." />
        <div className="iam-card-grid">
          {[
            ["meter", "Precision power meters", "Track voltage, current, energy and power quality at boards and feeders. Match the meter class to the measurement purpose.", "BOARD / FEEDER / PROCESS"],
            ["data", "Energy loggers", "Capture interval profiles and equipment duty. Portable or permanent logging supports a defined study period and sampling plan.", "LOAD PROFILE / DEMAND"],
            ["cloud", "IoT monitoring", "Publish selected data through a secure gateway. Device identity, buffering and data ownership make the connection maintainable.", "GATEWAY / HISTORIAN / CLOUD"],
          ].map(([icon, title, description, tag]) => (
            <article className="iam-info-card" key={title}>
              <span className="iam-icon-wrap"><Icon name={icon} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="iam-card-tag">{tag}</span>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="iam-section">
      <div className="iam-container">
        <SectionHeading eyebrow="ACCURACY & SELECTION" title="Specify the entire uncertainty path." />
        <div className="iam-split-layout">
          <div className="iam-split-copy">
            <h3>A meter class is not the whole chain.</h3>
            <p>The sensor, meter, wiring and operating range all influence the measurement. Billing, internal allocation and diagnostic logging may require different instruments.</p>
            <ul>
              <li>State the current range, ratio, burden and waveform conditions.</li>
              <li>Confirm phase relationships and voltage connection configuration.</li>
              <li>Request applicable meter accuracy and calibration documentation.</li>
            </ul>
          </div>
          <div className="iam-table-wrap">
            <table className="iam-table iam-table--compact">
              <thead><tr><th>Purpose</th><th>Selection guidance</th></tr></thead>
              <tbody>{purposeRows.map(([purpose, guidance]) => <tr key={purpose}><th scope="row">{purpose}</th><td>{guidance}</td></tr>)}</tbody>
              <tfoot><tr><td colSpan="2">Applicable references may include IEC 61557-12, IEC 62053 series or IEC 61000-4-30, depending on instrument purpose. No accuracy class is claimed for an unspecified product.</td></tr></tfoot>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section className="iam-section iam-section--tinted">
      <div className="iam-container">
        <SectionHeading eyebrow="SAMPLE MONITORING INTERFACE" title="From readings to an understandable load profile.">
          <p>A static monitoring concept populated with synthetic records. It demonstrates information structure, not a live connection or measured equipment performance.</p>
        </SectionHeading>
        <div className="iam-monitor-card">
          <div className="iam-monitor-heading"><h3>Energy workspace / facility sample</h3><span>ILLUSTRATIVE / STATIC</span></div>
          <div className="iam-kpi-grid">
            <div><span>Daily energy</span><strong>1,176 <small>kWh</small></strong></div>
            <div><span>Highest interval mean</span><strong>82 <small>kW</small></strong></div>
            <div><span>Log interval</span><strong>2 <small>hours</small></strong></div>
          </div>
          <div className="iam-table-wrap iam-monitor-table">
            <table className="iam-table">
              <thead><tr><th>Time / source</th><th>Sample record</th><th>Status</th></tr></thead>
              <tbody>
                <tr><th scope="row">14:00 / feeder F-01</th><td>Interval average 82 kW</td><td>Synthetic record</td></tr>
                <tr><th scope="row">16:00 / feeder F-01</th><td>Interval average 76 kW</td><td>Synthetic record</td></tr>
                <tr><th scope="row">18:00 / gateway G-01</th><td>Buffered records synchronized</td><td>Illustrative event</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="iam-chart-card">
          <div className="iam-chart-heading"><div><h3>Daily load shape / sample two-hour intervals</h3><span>AVERAGE ACTIVE POWER (kW) / SYNTHETIC DATA</span></div></div>
          <div className="iam-bars" aria-label="Sample average active power chart">
            {intervals.map(([time, value]) => <div className={`iam-bar-column ${time === "14:00" ? "is-peak" : ""}`} key={time}><span>{value}</span><i style={{ "--bar-height": `${Math.max(18, value * 0.82)}px` }} /><small>{time}</small></div>)}
          </div>
          <p className="iam-note">Each bar represents the mean power for a two-hour interval. Sample daily energy = &Sigma;(P &times; 2 h) = 1,176 kWh. Not a measured site profile.</p>
        </div>
      </div>
    </section>

    <section className="iam-section" id="logging-iot">
      <div className="iam-container">
        <SectionHeading eyebrow="LOGGING & IoT" title="Preserve the context as data moves." />
        <div className="iam-io-card">
          <div className="iam-diagram-labels"><span>ILLUSTRATIVE SYSTEM ARCHITECTURE</span><span>Functional links &bull; not an installation drawing</span></div>
          <div className="iam-io-source">Meters &rarr; edge logger / secure gateway</div>
          <div className="iam-io-line" />
          <div className="iam-io-nodes">{ioNodes.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
          <p className="iam-note">Use synchronized clocks, retention rules and offline buffering. Document CT ratios and meter configuration with the dataset; avoid converting missing values into false zeros.</p>
        </div>
      </div>
    </section>

    <section className="iam-section iam-section--tinted">
      <div className="iam-container">
        <SectionHeading eyebrow="ENGINEERING NOTES" title="Questions before a monitoring rollout." />
        <div className="iam-faq">{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div>
      </div>
    </section>

    <section className="iam-cta">
      <div className="iam-container iam-cta-inner">
        <div><p className="iam-eyebrow">NEXT STEP / ENGINEERING REVIEW</p><h2>Design a measurement chain, not a collection of devices.</h2><p>Share conductor dimensions, current range, measurement purpose and data needs to define the right metering package.</p></div>
        <Link className="iam-button iam-button--primary" to="/contact">Request a metering review <span aria-hidden="true">&rarr;</span></Link>
      </div>
    </section>
  </main>
);

export default InstrumentsandMeters;
