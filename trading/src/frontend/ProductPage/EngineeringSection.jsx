import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/EngineeringSection.css";

const EngineeringSection = () => {
  const navigate = useNavigate();

  return (
    <section className="engineering-section">
      {/* =========================================
                ENGINEERING CONSULTATION
            ========================================= */}

      <div className="engineering-consultation">
        <div className="engineering-consultation-content">
          <div className="engineering-label">
            <span>//</span> ENGINEERING CONSULTATION
          </div>

          <h2>
            NEED HELP CHOOSING THE RIGHT
            <br />
            CNC MACHINE?
          </h2>

          <p>
            Our application engineers are available for a direct structural and
            cycle-time review of your specific production requirements. We help
            you choose the platform that yields the highest ROI for your shop
            floor.
          </p>
        </div>

        <div className="engineering-consultation-action">
          <button
            type="button"
            className="engineering-primary-button"
            onClick={() => navigate("/contact")}
          >
            TALK TO OUR ENGINEERS
          </button>

          <span>Response within 24 business hours</span>
        </div>
      </div>

      {/* =========================================
                CUSTOM STRUCTURAL AUDIT
            ========================================= */}

      <div className="structural-audit">
        <div className="structural-audit-content">
          <h2>CUSTOM STRUCTURAL AUDIT</h2>

          <p>
            If your operational thresholds exceed standard catalog specs, our
            engineering team can provide a tailored structural configuration
            audit within 48 hours.
          </p>
        </div>

        <button
          type="button"
          className="engineering-outline-button"
          onClick={() => navigate("/contact")}
        >
          TALK TO ENGINEER
        </button>
      </div>
    </section>
  );
};

export default EngineeringSection;
