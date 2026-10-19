import { NavLink } from "react-router-dom";
import SnttLogo from "../../../assets/SNTT.png";
import "./Footer.css";

const productLinks = [
  ["Low-voltage", "/product?division=trd&collection=chint&solution=low-voltage"],
  ["Power Transmission and Distribution", "/product?division=trd&collection=chint&solution=power-transmission-distribution"],
  ["Low-voltage Switchgear and Software", "/product?division=trd&collection=chint"],
  ["Instruments and Meters", "/product?division=trd&collection=chint&solution=instruments-meters"],
  ["EV Charging", "/product?division=trd&collection=chint"],
];

const solutionLinks = [
  "Transmission Grid",
  "Distribution Grid",
  "Generator Equipment",
  "Modern Logistics Equipment",
  "Pumps and Vacuum Equipment",
  "Food and Beverage",
  "Mining Machinery",
  "HVAC",
  "Elevator",
  "Data Center",
  "Residential PV & ESS",
  "Utility PV & ESS",
  "Commercial and Industry PV",
  "Oil & Gas",
  "Metallurgical",
  "Rail Transportation",
  "Buildings",
].map((label) => [label, "/product?division=trd&collection=chint"]);

const aboutLinks = [
  ["CHINT Global", "/about"],
  ["Blog", "/resources"],
  ["News", "/resources"],
  ["Careers", "/get-started"],
  ["Locate Us", "/distribution"],
  ["Contact Us", "/contact"],
  ["Privacy Policy", "/contact#privacy-policy"],
];

const serviceLinks = [
  ["Products", "/product"],
  ["Solutions", "/product"],
  ["Project Reference", "/reference"],
  ["Corporate Reports", "/resources"],
];

const FooterColumn = ({ title, links }) => (
  <div className="footer-column">
    <h3>{title}</h3>
    <nav aria-label={title}>
      {links.map(([label, to]) => (
        <NavLink to={to} key={`${label}-${to}`}>
          {label}
        </NavLink>
      ))}
    </nav>
  </div>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <FooterColumn title="Products" links={productLinks} />
      <FooterColumn title="Solutions" links={solutionLinks} />
      <FooterColumn title="About Us" links={aboutLinks} />
      <FooterColumn title="Services" links={serviceLinks} />

      <aside className="footer-contact-panel" aria-label="CHINT contact information">
        <div className="footer-brand-mark">
          <img src={SnttLogo} alt="SNTT Power Systems" />
        </div>

        <div className="footer-contact-grid">
          <div className="footer-contact-item">
            <span>Phone</span>
            <a href="tel:+6563293110">+65 6329 3110</a>
          </div>
          <div className="footer-contact-item">
            <span>Mailbox</span>
            <a href="mailto:sales.apac@chint.com">sales.apac@chint.com</a>
          </div>
          <div className="footer-contact-item">
            <span>Technical Support</span>
            <a href="mailto:sg.service@chint.com">sg.service@chint.com</a>
          </div>
        </div>

        <div className="footer-socials">
          <h3>Follow us</h3>
          <div className="footer-social-links">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
          </div>
        </div>
      </aside>
    </div>

    <div className="footer-bottom">
      <p>© 2026 CHINT POWER SYSTEMS. ALL RIGHTS RESERVED.</p>
      <p>SchneiTec Trading / Manufacturing / POWER SYSTEMS</p>
    </div>
  </footer>
);

export default Footer;
