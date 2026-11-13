import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { downloadReferenceDossier } from "./referenceDossier";
import AnimatedNumber from "../components/AnimatedNumber/AnimatedNumber";
import "./ReferenceChint.css";

const imageUrl = (name) => `${import.meta.env.BASE_URL}moreAccssories/${encodeURIComponent(name)}`;
const logoUrl = (name) => `${import.meta.env.BASE_URL}logoCHINT/${encodeURIComponent(name)}`;
const PAGE_SIZE = 6;

const customerLogos = [
  "AES logo.svg",
  "ARCHETYPE GROUP - LOGO.png",
  "ATE Logo.png",
  "DBD Engineering LOGO.png",
  "EDC - Logo.png",
  "EMC - Logo.png",
  "GREEN POWER LOGO-01-01.png",
  "KSR Logo.JPG",
  "Logo - EGE.png",
  "Logo - Master MEP.jpg",
  "Logo - Meng Brother.jpg",
  "Logo - SOMA Energy.png",
  "MAUSO - Logo.png",
  "Mekong Land - Logo.png",
  "MVEs Logo.JPG",
  "PATtech - Logo.png",
];

// Reference content from the supplied design. Photography comes from the local image library.
const featuredProject = {
  id: "al-dhafra", title: "500kV Al-Dhafra Ultra-High Voltage Grid Interconnection",
  location: "Abu Dhabi, United Arab Emirates", region: "Middle East", sector: "substation",
  category: "Substation", scale: "Utility scale", year: 2023,
  image: "list (4).jpg", alt: "Large solar arrays stretching across a desert landscape",
  description: "High-voltage grid infrastructure connecting large-scale energy generation with the wider transmission network.",
  specs: [["Primary Tech", "GIS (Gas Insulated)"], ["Transformer Capacity", "750MVA Units"], ["Protocol", "IEC 61850"], ["Reliability", "99.999% Uptime"]],
};

const projects = [
  {
    id: "copenhagen", title: "Copenhagen Metro Expansion", category: "Rail Infrastructure", sector: "rail",
    location: "Copenhagen, Denmark", region: "Europe", scale: "Infrastructure", year: 2025,
    image: "residential9-item-img1.jpg", alt: "Aerial view of a connected residential neighborhood and roads",
    description: "Low-voltage distribution and smart grid automation for the city's newest suburban extensions.",
    specs: [["Voltage", "400V / 10kV"], ["Hardware", "NGC3 Series"], ["Compliance", "IEC/EN 61439"]],
  },
  {
    id: "atacama", title: "Atacama Solar PV Park", category: "Renewables", sector: "solar",
    location: "Atacama Desert, Chile", region: "South America", scale: "Utility scale", year: 2025,
    image: "  ", alt: "Rows of photovoltaic panels at a desert solar farm",
    description: "A 250MW grid-connected solar array featuring high-efficiency inverters and step-up substations.",
    specs: [["Voltage", "1500V DC / 33kV"], ["Hardware", "ASTRO Series"], ["Compliance", "IEEE 1547"]],
  },
  {
    id: "bavaria", title: "Bavaria Automotive Gigafactory", category: "Industrial", sector: "industrial",
    location: "Bavaria, Germany", region: "Europe", scale: "Commercial & industrial", year: 2025,
    image: "yoonsteel-energy-storage-list.jpg", alt: "Industrial factory with rooftop solar panels and energy storage",
    description: "Integrated power management and PLC automation for one of Europe's largest EV production sites.",
    specs: [["Voltage", "20kV Medium Voltage"], ["Hardware", "CHINT Smartbox"], ["Compliance", "VDE/CE"]],
  },
  {
    id: "sohar", title: "Sohar Port GIS Substation", category: "Substation", sector: "substation",
    location: "Sohar, Oman", region: "Middle East", scale: "Infrastructure", year: 2024,
    image: "list (2).jpg", alt: "Solar-powered buildings and energy infrastructure in a mountain community",
    description: "220kV Gas-Insulated Substation (GIS) ensuring stable power for heavy industrial port operations.",
    specs: [["Voltage", "220kV HV"], ["Hardware", "ZF12-252 GIS"], ["Compliance", "KEMA Certified"]],
  },
  {
    id: "tokyo", title: "Tokyo Harbor BESS", category: "Energy Storage", sector: "storage",
    location: "Tokyo, Japan", region: "Asia Pacific", scale: "Utility scale", year: 2024,
    image: "smart-storage-clean-operations.jpg", alt: "Commercial battery energy storage installation and engineering team",
    description: "A containerized battery energy storage system for peak shaving and grid frequency regulation.",
    specs: [["Voltage", "6.6kV AC Interconnection"], ["Hardware", "Powerblock ESS"], ["Compliance", "JIS Compliance"]],
  },
  {
    id: "sao-paulo", title: "São Paulo Suburban Rail", category: "Mobility", sector: "rail",
    location: "São Paulo, Brazil", region: "South America", scale: "Infrastructure", year: 2024,
    image: "list (7).jpg", alt: "Lakeside residential community illuminated at sunset",
    description: "Full modernization of signaling and power substations for the urban transit network.",
    specs: [["Voltage", "3000V DC Traction"], ["Hardware", "DC Switchgear"], ["Compliance", "ABNT Standards"]],
  },
  featuredProject,
];

const sectors = [
  ["all", "All Sectors"], ["solar", "Utility & Solar PV"], ["substation", "T&D / Substations"],
  ["industrial", "Industrial Automation"], ["rail", "Smart Cities & Rail"], ["storage", "BESS Energy Storage"],
];
const regions = [...new Set(projects.map((project) => project.region))];
const scales = [...new Set(projects.map((project) => project.scale))];
const years = [...new Set(projects.map((project) => project.year))].sort((a, b) => b - a);

const Icon = ({ name }) => {
  const paths = {
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    down: <path d="m6 9 6 6 6-6" />,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5" /><path d="M5 7V3h4" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    list: <path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1" />,
    chip: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3" /></>,
    document: <><path d="M14 3H5v18h14V8l-5-5Z" /><path d="M14 3v5h5M8 12h5m-5 4h3m2 1 2 2 5-5" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return <svg className="chint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const Specs = ({ items, className = "chint-card-specs" }) => (
  <dl className={className}>{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
);

const FilterSelect = ({ label, value, options, onChange }) => (
  <label className="chint-select">
    <span className="chint-sr-only">{label}</span>
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="all">{label}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
    <Icon name="down" />
  </label>
);

const CustomerLogoSlider = () => {
  const logoTrack = [...customerLogos, ...customerLogos];

  return (
    <section className="chint-customers" aria-labelledby="chint-customers-title">
      <div className="chint-container chint-customer-heading">
        <p className="chint-customer-eyebrow">Our Customers</p>
        <h2 id="chint-customers-title">Trusted by Our Customers</h2>
        <p>Contractors, developers and engineering firms that rely on SchneiTec Trading for their projects.</p>
      </div>
      <div className="chint-logo-slider" aria-label="Customer logos">
        <div className="chint-logo-track">
          {logoTrack.map((logo, index) => (
            <div className="chint-logo-card" key={`${logo}-${index}`} aria-hidden={index >= customerLogos.length}>
              <img src={logoUrl(logo)} alt={index < customerLogos.length ? logo.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") : ""} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ReferenceChint = () => {
  const [filters, setFilters] = useState({ sector: "all", region: "all", scale: "all", year: "all" });
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedProject, setSelectedProject] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!selectedProject) return undefined;
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [selectedProject]);

  const updateFilter = (name, value) => {
    setFilters((previous) => ({ ...previous, [name]: value }));
    setVisibleCount(PAGE_SIZE);
  };

  const filteredProjects = projects.filter((project) => (
    Object.entries(filters).every(([key, value]) => value === "all" || String(project[key]) === value)
  )).sort((a, b) => sort === "name" ? a.title.localeCompare(b.title) : sort === "oldest" ? a.year - b.year : b.year - a.year);
  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const remaining = filteredProjects.length - visibleProjects.length;

  return (
    <main className="chint-reference-page" aria-labelledby="chint-reference-title">
      <section className="chint-hero">
        <img className="chint-hero-image" src={imageUrl("list (4).jpg")} alt="" fetchPriority="high" />
        <div className="chint-container chint-hero-content">
          <p className="chint-eyebrow">Global Infrastructure Excellence</p>
          <h1 id="chint-reference-title">Empowering the Global Energy<br className="chint-desktop-break" /> Transition in 140+ Countries</h1>
          <p className="chint-hero-description">From high-voltage transmission networks to hyper-scale solar ecosystems, CHINT provides the critical hardware and smart automation driving the world's net-zero future.</p>
          <div className="chint-hero-actions">
            <a className="chint-button chint-button--primary" href="#project-matrix">Explore References</a>
            <button className="chint-button chint-button--ghost" type="button" onClick={() => downloadReferenceDossier(projects)}><Icon name="download" />Download PDF Dossier</button>
          </div>
        </div>
        <div className="chint-stats">
          <div className="chint-container chint-stats-grid">
            {[[45, 0, "+ GW", "Cumulative PV Capacity"], [3200, 0, "+", "Substation References"], [140, 0, "+", "Global Markets Served"], [99.98, 2, "%", "System MTBF Rate"]].map(([value, decimals, suffix, label]) => <div key={label}><strong><AnimatedNumber value={value} decimals={decimals} suffix={suffix} /></strong><span>{label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="chint-featured chint-container" aria-labelledby="chint-featured-title">
        <div className="chint-section-heading"><h2 id="chint-featured-title">Featured Strategic Reference</h2><a className="chint-text-link" href="#project-matrix">View Project History<Icon name="arrow" /></a></div>
        <article className="chint-featured-card">
          <div className="chint-featured-media"><img src={imageUrl(featuredProject.image)} alt={featuredProject.alt} width="1280" height="720" /><span className="chint-featured-badge">Flagship Implementation</span></div>
          <div className="chint-featured-copy">
            <h3>{featuredProject.title}</h3>
            <p className="chint-location"><Icon name="pin" />{featuredProject.location}</p>
            <div className="chint-spec-matrix"><h4>Technical Specification Matrix</h4><Specs items={featuredProject.specs} className="chint-matrix-grid" /></div>
            <button className="chint-button chint-button--dark" type="button" onClick={() => setSelectedProject(featuredProject)}><Icon name="chip" />Technical Deep Dive</button>
          </div>
        </article>
      </section>

      <section className="chint-library" id="project-matrix" aria-label="Project reference library">
        <div className="chint-filter-band">
          <div className="chint-container">
            <div className="chint-sector-filters" role="group" aria-label="Filter references by sector">
              {sectors.map(([id, label]) => <button className={`chint-sector-filter${filters.sector === id ? " is-active" : ""}`} key={id} type="button" aria-pressed={filters.sector === id} aria-controls="chint-project-results" onClick={() => updateFilter("sector", id)}>{label}<span>{id === "all" ? projects.length : projects.filter((project) => project.sector === id).length}</span></button>)}
            </div>
            <div className="chint-filter-toolbar">
              <div className="chint-select-filters">
                <FilterSelect label="Select Region" options={regions} value={filters.region} onChange={(value) => updateFilter("region", value)} />
                <FilterSelect label="Project Scale" options={scales} value={filters.scale} onChange={(value) => updateFilter("scale", value)} />
                <FilterSelect label="Delivery Year" options={years} value={filters.year} onChange={(value) => updateFilter("year", value)} />
              </div>
              <div className="chint-view-tools">
                <label className="chint-sort"><span>Sorted by:</span><select aria-label="Sort references" value={sort} onChange={(event) => { setSort(event.target.value); setVisibleCount(PAGE_SIZE); }}><option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="name">Project Name</option></select></label>
                <div className="chint-view-toggle" role="group" aria-label="Project display">
                  {["grid", "list"].map((mode) => <button key={mode} type="button" className={view === mode ? "is-active" : ""} aria-label={`${mode === "grid" ? "Grid" : "List"} view`} aria-pressed={view === mode} onClick={() => setView(mode)}><Icon name={mode} /></button>)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="chint-container chint-results" id="chint-project-results">
          <p className="chint-sr-only" role="status" aria-atomic="true">Showing {visibleProjects.length} of {filteredProjects.length} references.</p>
          <div className={`chint-project-grid${view === "list" ? " is-list" : ""}`}>
            {visibleProjects.map((project) => (
              <article className="chint-project-card" key={project.id}>
                <div className="chint-card-media"><img src={imageUrl(project.image)} alt={project.alt} width="1280" height="720" loading="lazy" decoding="async" /><span className={`chint-category chint-category--${project.sector}`}>{project.category}</span></div>
                <div className="chint-card-copy"><h3>{project.title}</h3><p className="chint-card-description">{project.description}</p><Specs items={project.specs} /><button className="chint-text-link" type="button" onClick={() => setSelectedProject(project)} aria-label={`Read case study: ${project.title}`}>Quick Access Case Study<Icon name="chevron" /></button></div>
              </article>
            ))}
          </div>
          {filteredProjects.length === 0 && <div className="chint-empty"><h3>No matching references</h3><p>Try another sector, region, scale, or delivery year.</p><button className="chint-button chint-button--outline" type="button" onClick={() => { setFilters({ sector: "all", region: "all", scale: "all", year: "all" }); setVisibleCount(PAGE_SIZE); }}>Reset Filters</button></div>}
          {remaining > 0 && <div className="chint-load-more"><button className="chint-button chint-button--outline" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Load More References ({remaining.toLocaleString()} remaining)</button></div>}
        </div>
      </section>

      <CustomerLogoSlider />

      <section className="chint-hubs" aria-labelledby="chint-hubs-title">
        <div className="chint-container"><div className="chint-hubs-copy">
          <h2 id="chint-hubs-title">Regional Engineering Hubs</h2>
          <p className="chint-hubs-intro">CHINT operates 5 global R&amp;D centers and 12 regional engineering hubs. We provide local technical support, design optimization, and full-spectrum Single Line Diagram (SLD) consultation for international tenders.</p>
          <div className="chint-hub-services">
            <div className="chint-hub-service"><span className="chint-service-icon"><Icon name="chip" /></span><div><h3>Integrated Design Support</h3><p>Full hardware-software integration for SCADA and smart grid applications.</p></div></div>
            <div className="chint-hub-service"><span className="chint-service-icon"><Icon name="document" /></span><div><h3>Tender Compliance</h3><p>Pre-qualified equipment for major global utility operators and EPC contractors.</p></div></div>
          </div>
          <div className="chint-standards" aria-label="Technical standards: IEEE and KEMA"><span>◇ IEEE</span><span>KEMA</span></div>
        </div></div>
      </section>

      <dialog className="chint-dialog" ref={dialogRef} aria-labelledby="chint-dialog-title" onCancel={() => setSelectedProject(null)} onClick={(event) => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setSelectedProject(null); } }}>
        {selectedProject && <><button className="chint-dialog-close" type="button" aria-label="Close case study" onClick={() => setSelectedProject(null)} autoFocus><Icon name="close" /></button><div className="chint-dialog-content"><img className="chint-dialog-image" src={imageUrl(selectedProject.image)} alt={selectedProject.alt} /><p className="chint-eyebrow">{selectedProject.category} / Project Reference</p><h2 id="chint-dialog-title">{selectedProject.title}</h2><p className="chint-location"><Icon name="pin" />{selectedProject.location}</p><p>{selectedProject.description}</p><Specs items={selectedProject.specs} /><Link className="chint-button chint-button--primary" to={`/contact?project=${encodeURIComponent(selectedProject.title)}`}>Discuss a Similar Project<Icon name="arrow" /></Link></div></>}
      </dialog>
    </main>
  );
};

export default ReferenceChint;
