import React from "react";
import "./CompliancePage.css";

const CompliancePage = () => {
  const complianceData = [
    {
      title: "ISO 9001:2015",
      subtitle: "INTERNATIONAL QUALITY MATRIX",
      description:
        "Direct manufacturing of high-load hydraulic systems, structural casting design, and precise CNC alignment controllers.",
    },
    {
      title: "CE COMPLIANT",
      subtitle: "EUROPEAN SAFETY STANDARDS",
      description:
        "Complete safety shielding, redundant hydraulic load relief locks, and automated power disconnects on envelope violation.",
    },
    {
      title: "API SPEC 4F",
      subtitle: "AMERICAN PETROLEUM INSTITUTE",
      description:
        "Certified structural steel integrity for heavy oilfield operations, continuous extreme-duty mechanical loading.",
    },
  ];

  const lifecycleData = [
    {
      number: "01",
      period: "WEEK 1-2",
      title: "SITE PREP",
      description:
        "Foundation casting verification, anchoring slot calibration, primary power hookup preparation.",
    },
    {
      number: "02",
      period: "WEEK 3-4",
      title: "COMMISSION",
      description:
        "Structural assembly lifting, heavy hydraulic fluid purging, calibration testing at no load.",
    },
    {
      number: "03",
      period: "MONTH 3-6",
      title: "PREVENTIVE",
      description:
        "Automated sensor inspection cycles, fluid viscosity testing, and direct gear alignment sweeps.",
    },
    {
      number: "04",
      period: "YEAR 5",
      title: "MAJOR OVERHAUL",
      description:
        "Planned structural replacement of seal kits, deep valve clearance scans, cylinder re-honing.",
    },
    {
      number: "05",
      period: "YEAR 10+",
      title: "LIFE EXTENSION",
      description:
        "Upgrading legacy microcontrollers, updating hydraulic pump manifolds for high-pressure capacity.",
    },
  ];

  return (
    <div className="compliance-page">
      {/* =====================================
                SECTION 01
            ===================================== */}
      <section className="compliance-section" id="distribution">
        <div className="compliance-container">
          <div className="compliance-label">
            // COMPLIANCE & VERIFIED STANDARDS
          </div>

          <h1>CERTIFIED OPERATIONAL COMPLIANCE</h1>

          <div className="compliance-grid">
            {complianceData.map((item, index) => (
              <div className="compliance-card" key={index}>
                <div className="card-top">
                  <h2>{item.title}</h2>

                  <span className="card-square"></span>
                </div>

                <h3>{item.subtitle}</h3>

                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================
                SECTION 02
            ===================================== */}
      <section className="lifecycle-section" id="reference">
        <div className="lifecycle-container">
          <div className="lifecycle-label">// LIFECYCLE DEPLOYMENT PATTERN</div>

          <h1>SYSTEM LIFECYCLE CHRONOLOGY</h1>

          <div className="lifecycle-grid">
            {lifecycleData.map((item, index) => (
              <div className="lifecycle-card" key={index}>
                <div className="lifecycle-top">
                  <span className="lifecycle-number">{item.number}</span>

                  <span className="lifecycle-period">{item.period}</span>
                </div>

                <h2>{item.title}</h2>

                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================
                SECTION 03
            ===================================== */}
      <section className="configure-section" id="contact">
        <div className="configure-container">
          <h1>
            CONFIGURE YOUR INDUSTRIAL
            <span>MACHINE</span>
          </h1>

          <p>
            Connect directly with Efsan Heavy Engineering experts. Submit your
            exact load thresholds, dimensional envelopes, and cycle demands to
            receive complete pricing specs.
          </p>

          <a href="#contact" className="configure-button" id="get-started">
            INITIATE CUSTOM STRUCTURAL CONFIGURATION
            <span>→</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default CompliancePage;
