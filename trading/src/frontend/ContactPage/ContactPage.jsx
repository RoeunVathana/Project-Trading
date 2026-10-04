import { useState } from "react";
import "./ContactPage.css";

const inquiryTypes = [
  { id: "quotation", label: "Quotation", icon: "document" },
  { id: "feasibility", label: "Feasibility", icon: "sliders" },
  { id: "spares", label: "Spares", icon: "boxes" },
  { id: "support", label: "Support", icon: "headset" },
];

function Icon({ name, className = "" }) {
  const paths = {
    document: <><path d="M7 3.75h6l4 4v12.5H7z" /><path d="M13 3.75v4h4M9.5 12h5M9.5 15.5h5" /></>,
    sliders: <><path d="M4 7h7m4 0h5M4 17h3m4 0h9" /><circle cx="13" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
    boxes: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" /><path d="m4.4 7.7 7.6 4.4 7.6-4.4M12 12v9" /></>,
    headset: <><path d="M4 12a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-2v-6h4M4 13h4v6H6a2 2 0 0 1-2-2z" /></>,
    phone: <><path d="M7 3h10v18H7z" /><path d="M10 6h4M11 18h2" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" /><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8" /></>,
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function GlobeIllustration() {
  return (
    <svg className="contact-globe" viewBox="0 0 320 210" fill="none" aria-hidden="true">
      <circle cx="160" cy="105" r="91" className="contact-globe__ocean" />
      <path className="contact-globe__land" d="m99 39 16 4 10 13-7 12 6 9-9 9-2 15-11 7-4 18-13 4-7 16-13-5-6-18 8-16-4-15 9-13-1-16 10-14 8-17Zm80-18 20 5 8 12 20 4 8 13-11 7-14-5-13 8-12-5-5-14-11-8 10-17Zm59 52 14-4 14 9 8 16-9 13-13 1-12-11-12-3 10-21Zm-57 27 15 3 8 15-7 14 5 17-12 15-8 20-12-8-7-22 5-17-9-14 5-13 17-10Zm-44-6 10 8-6 14-13-3-3-10 12-9Z" />
      <circle cx="82" cy="104" r="4.5" className="contact-globe__pin contact-globe__pin--orange" />
      <circle cx="226" cy="77" r="4.5" className="contact-globe__pin" />
      <path d="M83 104h-4v14H59" className="contact-globe__line" />
      <path d="M226 77h24v14h22" className="contact-globe__line" />
      <path d="M160 17v176M69 105h182M91 48h138M91 162h138" className="contact-globe__grid" />
      <ellipse cx="160" cy="105" rx="42" ry="91" className="contact-globe__grid" />
      <ellipse cx="160" cy="105" rx="76" ry="91" className="contact-globe__grid" />
    </svg>
  );
}

const ContactPage = () => {
  const [inquiryType, setInquiryType] = useState("quotation");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = [
      `Inquiry type: ${inquiryType}`,
      `Name: ${formData.get("name")}`,
      `Email: ${formData.get("email")}`,
      `Machine series: ${formData.get("series") || "Not specified"}`,
      `Organization: ${formData.get("organization") || "Not specified"}`,
      "",
      `Description: ${formData.get("description")}`,
    ].join("\n");
    window.location.href = `mailto:support.us@schentec.com?subject=${encodeURIComponent("Technical inquiry")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main className="contact-page">
      <div className="contact-page__topline" />
      <div className="contact-shell">
        <header className="contact-hero">
          <div className="contact-hero__copy">
            <p className="contact-eyebrow"><span /> Technical communication</p>
            <h1>Engineering <em>Interface</em>.</h1>
            <p className="contact-hero__intro">
              Connect with our application specialists or request technical support
              for your sub-micron systems. Global response teams active across all timezones.
            </p>
          </div>

          <a className="contact-hotline" href="tel:+492891128900">
            <span className="contact-hotline__icon"><Icon name="phone" /></span>
            <span className="contact-hotline__copy">
              <span className="contact-label">Global breakdown dispatcher</span>
              <strong>+49 (0) 711<br />928 000</strong>
              <small><i /> Immediate support · 24 / 7 / 365</small>
            </span>
          </a>
        </header>

        <div className="contact-layout">
          <section className="contact-form-panel" aria-labelledby="contact-form-title">
            <div className="contact-form-panel__heading">
              <div>
                <h2 id="contact-form-title">Technical inquiry</h2>
                <p>Step 01: classification</p>
              </div>
              <div className="contact-step-indicator" aria-label="Step 1 of 3">
                <span className="is-current" /><span /><span />
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <fieldset className="contact-inquiry-types">
                <legend className="contact-label">Inquiry type</legend>
                <div className="contact-inquiry-types__grid">
                  {inquiryTypes.map((type) => (
                    <button
                      className={`contact-type-option${inquiryType === type.id ? " is-selected" : ""}`}
                      type="button"
                      key={type.id}
                      aria-pressed={inquiryType === type.id}
                      onClick={() => setInquiryType(type.id)}
                    >
                      <Icon name={type.icon} />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="contact-fields contact-fields--two">
                <label className="contact-field">
                  <span>Name</span>
                  <input name="name" type="text" placeholder="Your name" autoComplete="name" required />
                </label>
                <label className="contact-field">
                  <span>Email address</span>
                  <input name="email" type="email" placeholder="you@company.com" autoComplete="email" required />
                </label>
              </div>

              <div className="contact-fields contact-fields--two">
                <label className="contact-field">
                  <span>Machine series</span>
                  <select name="series" defaultValue="">
                    <option value="">Select series...</option>
                    <option>Precision systems</option>
                    <option>Automation systems</option>
                    <option>Measurement systems</option>
                    <option>Other / not sure</option>
                  </select>
                </label>
                <label className="contact-field">
                  <span>Organization</span>
                  <input name="organization" type="text" placeholder="Legal entity name" autoComplete="organization" />
                </label>
              </div>

              <label className="contact-field contact-field--message">
                <span>Brief description</span>
                <textarea name="description" placeholder="Outline technical requirements or system errors..." rows="3" required />
              </label>

              <button className="contact-submit" type="submit">
                Initiate protocol <Icon name="arrow" />
              </button>
              <p className="contact-form__note">Your email app will open with your inquiry ready to send.</p>
            </form>
          </section>

          <aside className="contact-sidebar" aria-label="Global support information">
            <section className="contact-network-card" aria-label="Global technical support availability">
              <span className="contact-status"><i /> Global technical live</span>
              <GlobeIllustration />
              <div className="contact-map-tag contact-map-tag--detroit">
                <strong>Detroit tech center</strong><span>Northville, MI · UTC −04:00</span>
              </div>
              <div className="contact-map-tag contact-map-tag--stuttgart">
                <strong>Stuttgart HQ</strong><span>Germany · UTC +02:00</span>
              </div>
              <div className="contact-network-stats">
                <div><span>Response time avg.</span><strong>18.4 <small>min</small></strong></div>
                <div><span>Active engineers</span><strong>142</strong></div>
              </div>
            </section>

            <div className="contact-office-list">
              <article className="contact-office">
                <span className="contact-office__icon"><Icon name="pin" /></span>
                <div>
                  <h3>European headquarters</h3>
                  <p>Industrial Drive 42, Stuttgart-Ost<br />70190 Stuttgart, Germany</p>
                  <a href="mailto:hq@schentec.com">hq@schentec.com</a>
                  <a href="tel:+49711928000">+49 711 928 000</a>
                </div>
              </article>
              <article className="contact-office">
                <span className="contact-office__icon"><Icon name="pin" /></span>
                <div>
                  <h3>North American tech center</h3>
                  <p>800 Engineering Way, Northville<br />Detroit, MI 48167, USA</p>
                  <a href="mailto:support.us@schentec.com">support.us@schentec.com</a>
                  <a href="tel:+13135550920">+1 313 555 0920</a>
                </div>
              </article>
            </div>

            <section className="contact-training-card">
              <div className="contact-training-card__copy">
                <h2>Documentation &amp; training</h2>
                <p>Access technical manuals, firmware updates, and the SchenTec Academy portal for operator certification.</p>
                <a href="/resources" className="contact-training-link">Explore academy membership <Icon name="arrow" /></a>
              </div>
              <Icon className="contact-training-card__icon" name="book" />
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
