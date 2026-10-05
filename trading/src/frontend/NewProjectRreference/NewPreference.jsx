import "./NewRreference.css";

const DownloadIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 14v3h12v-3" />
  </svg>
);

const Chart = () => (
  <div
    className="np-chart"
    role="img"
    aria-label="Chart comparing standard control with Active Dynamic Tool Suppression. The active suppression profile remains stable throughout the machining cycle."
  >
    <div className="np-chart-legend" aria-hidden="true">
      <span>
        <i className="np-legend-standard" />
        Standard Control
      </span>
      <span>
        <i className="np-legend-active" />
        Active ADTS
      </span>
    </div>
    <svg
      className="np-chart-svg"
      viewBox="0 0 720 220"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className="np-chart-grid">
        <path d="M42 22H706M42 88H706M42 154H706M42 208H706" />
        <path d="M42 22V208M175 22V208M308 22V208M441 22V208M574 22V208M706 22V208" />
      </g>
      <g className="np-chart-axis-labels">
        <text x="10" y="27">
          15
        </text>
        <text x="10" y="93">
          10
        </text>
        <text x="16" y="159">
          5
        </text>
        <text x="38" y="218">
          0
        </text>
        <text x="169" y="218">
          20
        </text>
        <text x="302" y="218">
          40
        </text>
        <text x="435" y="218">
          60
        </text>
        <text x="568" y="218">
          80
        </text>
        <text x="695" y="218">
          100
        </text>
      </g>
      <path
        className="np-chart-standard"
        d="M42 196 109 176 175 138 242 56 308 112 375 24 441 92 508 164 574 176 640 190 706 201"
      />
      <path
        className="np-chart-fill"
        d="M42 203 109 197 175 193 242 188 308 194 375 186 441 194 508 197 574 199 640 201 706 204V208H42Z"
      />
      <path
        className="np-chart-adts"
        d="M42 203 109 197 175 193 242 188 308 194 375 186 441 194 508 197 574 199 640 201 706 204"
      />
    </svg>
  </div>
);

const projects = [
  {
    industry: "EV & AUTOMOTIVE",
    title: "Lightweight Battery Housing",
    achievement: "±0.005mm Positional Tolerance",
    detail:
      "Mass production optimization for 6000-series aluminum structural components.",
    image: "/images/about/production-line.jpg",
    alt: "Automated production line inside an advanced factory",
    icon: "⌑",
  },
  {
    industry: "MEDICAL DEVICE",
    title: "Bone Plate Micro-Milling",
    achievement: "Burr-free Sub-micron Finish",
    detail:
      "High-speed milling of complex geometries in biocompatible titanium alloys.",
    image: "/images/about/precision-workshop.jpg",
    alt: "Precision machining equipment in a clean workshop",
    icon: "⌁",
  },
  {
    industry: "NUCLEAR ENERGY",
    title: "Heavy Valve Body Machining",
    achievement: "99.9% Rework-free Processing",
    detail:
      "Precision boring and threading of critical flow-control components for energy infrastructure.",
    image: "/images/about/hero-machine.jpg",
    alt: "Close view of heavy industrial machinery",
    icon: "⚙",
  },
  {
    industry: "SPACE TECH",
    title: "Topology-Optimized Brackets",
    achievement: "35% Weight Reduction achieved",
    detail:
      "Complex lattice-structured components for next-gen LEO satellite arrays.",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=85",
    alt: "Satellite orbiting above the Earth",
    icon: "◉",
  },
];

const NewPreference = () => (
  <main className="new-reference-page">
    <section className="np-overview" aria-labelledby="np-title">
      <div className="np-overview-grid">
        <div className="np-overview-copy">
          <span className="np-eyebrow np-eyebrow-green">
            <span aria-hidden="true">✦</span> AEROSPACE ENGINEERING REFERENCE
          </span>
          <h1 id="np-title">
            Turbine Impeller
            <br />
            <span>5-Axis Optimization.</span>
          </h1>
          <p className="np-intro">
            A deep-dive into the complex machining of Inconel 718 aerospace
            impellers. By implementing{" "}
            <strong>Active Dynamic Tool Suppression (ADTS)</strong>, we solved
            resonance issues that previously limited feed rates.
          </p>

          <div className="np-metrics" aria-label="Project results">
            <div className="np-metric np-metric-green">
              <strong>42%</strong>
              <span>CYCLE TIME REDUCTION</span>
            </div>
            <div className="np-metric np-metric-orange">
              <strong>Rz 1.2</strong>
              <span>SURFACE FINISH (µM)</span>
            </div>
          </div>

          <div className="np-performance">
            <h2 className="np-section-kicker">TECHNICAL PERFORMANCE DATA</h2>
            <div className="np-chart-card">
              <div className="np-chart-title">Resonance Mitigation Profile</div>
              <Chart />
            </div>
          </div>
        </div>

        <figure className="np-machine-frame">
          <div className="np-machine-image">
            <img
              src="/images/about/hero-machine.jpg"
              alt="CNC machine tool working on a precision metal component"
            />
            <div className="np-telemetry">
              <div className="np-telemetry-heading">
                <span>REAL-TIME TELEMETRY FEED</span>
                <i>
                  <b />
                  <b />
                </i>
              </div>
              <div className="np-telemetry-row">
                <span>Spindle Load</span>
                <strong>
                  82% <em>(Optimized)</em>
                </strong>
              </div>
              <div className="np-meter">
                <i style={{ width: "82%" }} />
              </div>
              <div className="np-telemetry-row">
                <span>Heat Dispersion</span>
                <strong>
                  94% <em>Nominal</em>
                </strong>
              </div>
              <div className="np-meter">
                <i style={{ width: "94%" }} />
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>

    <section
      className="np-projects"
      id="project-matrix"
      aria-labelledby="np-projects-title"
    >
      <div className="np-section-heading">
        <div>
          <span className="np-eyebrow np-eyebrow-orange">
            INDUSTRY DEPLOYMENT
          </span>
          <h2 id="np-projects-title">Project Reference Matrix</h2>
        </div>
        <div className="np-status-legend" aria-label="Project status key">
          <span>
            <i className="np-status-active" />
            ACTIVE
          </span>
          <span>
            <i className="np-status-archived" />
            ARCHIVED
          </span>
        </div>
      </div>

      <div className="np-project-grid">
        {projects.map((project) => (
          <article className="np-project-card" key={project.title}>
            <div className="np-project-image">
              <img src={project.image} alt={project.alt} loading="lazy" />
            </div>
            <div className="np-project-body">
              <div className="np-project-category">
                <span>{project.industry}</span>
                <span aria-hidden="true">{project.icon}</span>
              </div>
              <h3>{project.title}</h3>
              <div className="np-project-divider" />
              <span className="np-project-label">KEY ACHIEVEMENT</span>
              <p className="np-achievement">{project.achievement}</p>
              <p className="np-project-detail">{project.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="np-resource-wrap" aria-labelledby="np-resource-title">
      <div className="np-resource-panel">
        <div className="np-resource-copy">
          <span className="np-eyebrow np-eyebrow-orange">
            <i aria-hidden="true" /> TECHNICAL RESOURCE CENTER
          </span>
          <h2 id="np-resource-title">
            Advanced Vibration Suppression
            <br className="np-desktop-break" /> in 5-Axis Machining
          </h2>
          <p>
            Download our peer-reviewed technical whitepaper detailing the
            physics of active damping and its impact on spindle longevity and
            surface integrity. Includes complete benchmark datasets from the
            Stuttgart Testing Grounds.
          </p>
          <div className="np-resource-actions">
            <a className="np-download-button" href="/resources">
              EXPLORE TECHNICAL RESOURCES <DownloadIcon />
            </a>
            <span className="np-file-specs">
              <small>FILE SPECS</small>PDF / 14.2 MB / 42 PAGES
            </span>
          </div>
        </div>
        <div className="np-paper" aria-label="White paper cover preview">
          <div className="np-paper-inner">
            <span className="np-paper-mark" />
            <strong>
              WHITE
              <br />
              PAPER
            </strong>
            <small>
              SCIENTIFIC ENGINEERING
              <br />
              DIVISION 2024
            </small>
            <span className="np-paper-emblem" aria-hidden="true">
              ✥
            </span>
            <em>CONFIDENTIAL</em>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default NewPreference;
