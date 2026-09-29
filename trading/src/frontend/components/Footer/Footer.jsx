import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="footer-container">
        {/* Company */}
        <div className="footer-company">
          <NavLink to="/" className="footer-logo">
            <span className="footer-logo-icon">✿</span>

            <span>Efsan Machine</span>
          </NavLink>

          <p className="footer-description">
            Heavy industrial engineering and plant solutions optimized for raw
            operational integrity under continuous severe performance
            guidelines.
          </p>
        </div>

        {/* Machinery */}
        <div className="footer-column">
          <h3>MACHINERY</h3>

          <NavLink to="/product">CNC Milling</NavLink>

          <NavLink to="/product">Hydraulic Presses</NavLink>

          <NavLink to="/product">Automated Press Brakes</NavLink>
        </div>

        {/* Capabilities */}
        <div className="footer-column">
          <h3>CAPABILITIES</h3>

          <NavLink to="/capabilities/5-axis">5-Axis Machining</NavLink>

          <NavLink to="/capabilities/robotic">Robotic Assembly</NavLink>

          <NavLink to="/capabilities/foundry">Heavy Foundry Casting</NavLink>
        </div>

        {/* Resources */}
        <div className="footer-column">
          <h3>RESOURCES</h3>

          <NavLink to="/resources/spec-sheets">Technical Spec Sheets</NavLink>

          <NavLink to="/resources/case-studies">Case Studies</NavLink>

          <NavLink to="/resources/maintenance">Maintenance Guides</NavLink>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 EFSAN MACHINE INDUSTRY. ALL RIGHTS RESERVED.</p>

        <p>[ COORD: 34.0522° N, 118.2437° W ]</p>
      </div>
    </footer>
  );
};

export default Footer;
