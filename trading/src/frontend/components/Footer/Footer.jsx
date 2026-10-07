import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-company">
        <NavLink to="/" className="footer-logo">
          SNTT Power Systems
        </NavLink>

        <p className="footer-description">
          Product supply, smart-energy solutions, and manufacturing capability
          for reliable power projects.
        </p>
      </div>

      <div className="footer-column">
        <h3>PRODUCT RANGE</h3>
        <NavLink to="/product?division=trd&collection=chint">Product CHINT</NavLink>
        <NavLink to="/product?division=trd&collection=huawei">Product HUAWEI</NavLink>
        <NavLink to="/product?division=man&collection=factory">Factory</NavLink>
      </div>

      <div className="footer-column">
        <h3>EXPLORE</h3>
        <NavLink to="/distribution">Distribution Partner</NavLink>
        <NavLink to="/reference">Project Reference</NavLink>
        <NavLink to="/resources">Resources</NavLink>
      </div>

      <div className="footer-column">
        <h3>COMPANY</h3>
        <NavLink to="/about">About Us</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/get-started">Get Started</NavLink>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© 2026 SNTT POWER SYSTEMS. ALL RIGHTS RESERVED.</p>
      <p>TRD / MAN / POWER SYSTEMS</p>
    </div>
  </footer>
);

export default Footer;
