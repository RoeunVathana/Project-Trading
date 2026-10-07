import "./HomePage.css";
import CompliancePage from "./CompliancePage";

import ImageCover from "../../assets/Homepage/Background.png"
const HomePage = () => {
  return (
    <main className="home">
      {/* =========================================
                HERO SECTION
            ========================================= */}
      <section className="hero-section" id="home">
        <div className="hero-container">
          {/* Left */}
          <div className="hero-content">
            <div className="hero-label">
              <span></span>
              SYSTEM ARCHITECTURE // COMPLETE RANGE
            </div>

            <h1>
              INDUSTRIAL
              <span>MACHINERY</span>
              CATALOG
            </h1>

            <p>
              Deploying raw structural mass and extreme micro-precision
              components. Our catalog features high-yield forging presses,
              automated multi-axis bending units, and high-power fiber laser
              profiling systems optimized for uninterrupted heavy-industry
              deployment.
            </p>
          </div>

          {/* Right */}
          <div className="hero-machine">
            <div className="machine-image-wrapper">
              <img
                src={ImageCover}
                alt="Industrial machinery"
              />

              <div className="machine-info">
                <div>
                  <span className="status-dot"></span>
                  MODEL: EFS-FORGE-3000
                </div>

                <div className="machine-status">STATE: STANDBY</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
                MACHINE SUITES
            ========================================= */}
      <section className="machine-section" id="product">
        <div className="section-container">
          <div className="section-label">[ 01 // MACHINE SUITES ]</div>

          <h2>HEAVY PRODUCTION HARDWARE</h2>

          <div className="hardware-grid">
            <div className="hardware-card">TOLERANCE: +/- 0.001 MM</div>

            <div className="hardware-card">FORCE: UP TO 3000T</div>

            <div className="hardware-card">POWER: 20KW OPTICAL</div>

            <div className="hardware-card">STROKE: 1500MM CYCLE</div>

            <div className="hardware-card">THICKNESS: UP TO 30MM</div>

            <div className="hardware-card">LINKS: CNC MATRIX</div>
          </div>
        </div>
      </section>

      {/* =========================================
                SPECIFICATIONS
            ========================================= */}
      <section className="spec-section" id="about">
        <div className="section-container">
          <div className="section-label">
            // METRIC RESOLUTION & PERFORMANCE
          </div>

          <h2>MOTOR & DRIVETRAIN SPECS</h2>

          <div className="spec-layout">
            {/* Left */}
            <div className="spec-content">
              <h3>
                SYNCHRONOUS POWER PLANT
                <br />
                DIRECTIVES
              </h3>

              <p>
                We implement heavy copper-wound synchronous motors with liquid
                stator chilling jackets. Our structural frame assemblies exhibit
                a 35% higher torsional strength relative to industry baselines,
                drastically dampening vibration frequencies at top torque
                bounds.
              </p>

              <div className="spec-tags">
                <div className="spec-tag">
                  <span>[+] DUAL-STAGED DIRECT PRESSURE GEARBOXES</span>

                  <strong>98.4% EFFICIENCY</strong>
                </div>

                <div className="spec-tag">
                  <span>[+] ACTIVE COOLING THERMAL CONSTANTS</span>

                  <strong>LIQUID-N2 CAPABLE</strong>
                </div>

                <div className="spec-tag">
                  <span>[+] REINFORCED DEFLECTION STRUTS</span>

                  <strong>ZERO DETECTED BEND</strong>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="spec-table">
              <div className="table-header">
                <span>SYSTEM PARAMETER</span>

                <span>RATING / VALUE</span>
              </div>

              <div className="table-row">
                <span>Continuous Operating Voltage</span>

                <strong>690V AC / 3-Phase</strong>
              </div>

              <div className="table-row">
                <span>Deflection Error Rate (Full Tonnage)</span>

                <strong>0.002mm / Meter</strong>
              </div>

              <div className="table-row">
                <span>Hydraulic Fluid Temp Range</span>

                <strong>-20°C to +110°C</strong>
              </div>

              <div className="table-row">
                <span>CNC Cycle Resolution</span>

                <strong>0.1 Microseconds</strong>
              </div>

              <div className="table-row">
                <span>Acoustic Attenuation Output</span>

                <strong>&lt; 72 Decibels</strong>
              </div>

              <div className="table-row">
                <span>Total Integrated Structural Mass</span>

                <strong>142,000 Kilograms</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <CompliancePage />
      </section>
    </main>
  );
};

export default HomePage;
