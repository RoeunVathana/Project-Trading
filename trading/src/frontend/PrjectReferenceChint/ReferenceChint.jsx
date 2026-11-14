import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { downloadReferenceDossier } from "./referenceDossier";
import AnimatedNumber from "../components/AnimatedNumber/AnimatedNumber";
import "./ReferenceChint.css";

const imageUrl = (source) => {
  if (/^https?:\/\//i.test(source)) return source;
  const assetPath = source.includes("/") ? source : `moreAccssories/${source}`;
  return `${import.meta.env.BASE_URL}${assetPath.split("/").map(encodeURIComponent).join("/")}`;
};
const handleImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = imageUrl("list (4).jpg");
};
const logoUrl = (name) => `${import.meta.env.BASE_URL}logoCusytomerCHINT/${encodeURIComponent(name)}`;
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
  "MAUSO - Logo.png",
  "Mekong Land - Logo.png",
  "MVEs Logo.JPG",
  "PATtech - Logo.png",
];

// Reference content from the supplied design. Images are cached locally so every card renders reliably.
const REFERENCE_IMAGES = Object.freeze({
  eastCondo: "moreAccssories/chint-reference/east-condo-reference.jpg",
  samanea: "moreAccssories/chint-reference/samanea-reference.jpg",
  zinus: "moreAccssories/chint-reference/zinus-reference.jpg",
  kCement: "moreAccssories/chint-reference/k-cement-reference.jpg",
  uhs: "moreAccssories/chint-reference/uhs-reference.jpg",
  westview: "moreAccssories/chint-reference/westview-reference.jpg",
  kork: "moreAccssories/chint-reference/kork-reference.jpg",
  edc: "moreAccssories/chint-reference/edc-kampot-reference.jpg",
  edcSign: "moreAccssories/chint-reference/edc-kampot-sign-reference.jpg",
  battery: "moreAccssories/chint-reference/battery-reference.jpg",
  police: "moreAccssories/chint-reference/police-reference.jpg",
  gyo: "moreAccssories/chint-reference/gyo-reference.jpg",
  mahaBoengTrea: "moreAccssories/chint-reference/maha-boeng-trea-reference.jpg",
  mekongLand: "moreAccssories/chint-reference/mekong-land-reference.jpg",
  kimSoing: "moreAccssories/chint-reference/kim-soing-reference.jpg",
  gbResidence: "moreAccssories/chint-reference/gb-residence-reference.jpg",
  bosba: "moreAccssories/chint-reference/bosba-reference.jpg",
  orienda: "moreAccssories/chint-reference/orienda-reference.jpg",
  nationalHospital: "moreAccssories/chint-reference/national-hospital-reference.jpg",
  boreyMl: "moreAccssories/chint-reference/borey-ml-reference.jpg",
});

const featuredProject = {
  id: "east-condo", title: "EAST Condo",
  location: "Sen Sok", stateCity: "Phnom Penh", region: "Cambodia", sector: "residential",
  category: "Residential Development", scale: "Residential Development", year: 2025,
  image: REFERENCE_IMAGES.eastCondo, alt: "High-rise residential condominium in Phnom Penh",
  description: "Electrical distribution reference for a Phnom Penh condominium development.",
  specs: [["Products", "MDB 3200A, SDM"], ["Key selling point", "Price, Quality"], ["External publication", "No"]],
};

/*
  {
    id: "sao-paulo", title: "São Paulo Suburban Rail", category: "Mobility", sector: "rail",
    location: "São Paulo, Brazil", region: "South America", scale: "Infrastructure", year: 2024,
    image: "list (7).jpg", alt: "Lakeside residential community illuminated at sunset",
    description: "Full modernization of signaling and power substations for the urban transit network.",
    specs: [["Voltage", "3000V DC Traction"], ["Hardware", "DC Switchgear"], ["Compliance", "ABNT Standards"]],
  },
  featuredProject,
];

*/
const projects = [
  featuredProject,
  {
    id: "samanea-wellness-resort", title: "Samanea Wellness Resort", category: "Hospitality", sector: "hospitality",
    location: "Ou Saom", stateCity: "Sihanoukville", region: "Cambodia", scale: "Hospitality", year: 2025,
    image: REFERENCE_IMAGES.samanea, alt: "Green resort landscape in Sihanoukville",
    description: "Electrical distribution reference for a wellness resort development in Ou Saom.",
    specs: [["Products", "MDB, ATS 5000A"], ["Key selling point", "Price, Quality"], ["External publication", "No"]],
  },
  {
    id: "zinus-factory", title: "ZINUS Factory", category: "Industrial Facility", sector: "industrial",
    location: "Kandal Stueng", stateCity: "Kandal", region: "Cambodia", scale: "Commercial & Industrial", year: 2025,
    image: REFERENCE_IMAGES.zinus, alt: "Industrial factory buildings in Cambodia",
    description: "Industrial power distribution reference for the ZINUS manufacturing facility.",
    specs: [["Products", "MDB 2500A"], ["Key selling point", "Price, Quality"], ["External publication", "No"]],
  },
  {
    id: "k-cement-factory", title: "K-Cement Factory", category: "Cement Manufacturing", sector: "industrial",
    location: "Kampot Province", stateCity: "Kampot Province", region: "Cambodia", scale: "Commercial & Industrial", year: 2025,
    image: REFERENCE_IMAGES.kCement, alt: "Cement factory in Kampot province",
    description: "Industrial power reference supporting cement production and reactive power compensation.",
    specs: [["Products", "MSB 5000A, Cap.Bank 1500KVAR"], ["Key selling point", "Price, Quality"], ["External publication", "No"]],
  },
  {
    id: "uhs", title: "The University of Health Sciences (UHS)", category: "Healthcare Education", sector: "healthcare",
    location: "Prek Pnov", stateCity: "Phnom Penh", region: "Cambodia", scale: "Healthcare & Education", year: 2026,
    image: REFERENCE_IMAGES.uhs, alt: "University health sciences building in Phnom Penh",
    description: "Wiring reference for the University of Health Sciences development.",
    specs: [["Products", "Wiring"], ["Key selling point", "Price, Quality"], ["External publication", "Yes"]],
  },
  {
    id: "westview-school", title: "Westview Cambodian International School", category: "Education", sector: "education",
    location: "Sen Sok", stateCity: "Phnom Penh", region: "Cambodia", scale: "Education", year: 2026,
    image: REFERENCE_IMAGES.westview, alt: "International school campus in Cambodia",
    description: "Power and capacitor-bank reference for an international school campus.",
    specs: [["Products", "ATS 1600A, Capacitor Bank 300kvar"], ["Key selling point", "Price, Quality"], ["External publication", "No"]],
  },
  {
    id: "kork-thlork-stadium", title: "Kork Thlork Stadium", category: "Sports Infrastructure", sector: "infrastructure",
    location: "Muk Kampoul", stateCity: "Kandal Province", region: "Cambodia", scale: "Infrastructure", year: 2026,
    image: REFERENCE_IMAGES.kork, alt: "Modern sports stadium and surrounding roads",
    description: "Wiring and low-voltage product reference for a new sports stadium.",
    specs: [["Products", "Wiring, LV Products"], ["Key selling point", "Price, Quality"], ["External publication", "Yes"]],
  },
  {
    id: "edc-kampot", title: "EDC Kampot", category: "Power Utility", sector: "infrastructure",
    location: "Kampot Province", stateCity: "Kampot Province", region: "Cambodia", scale: "Infrastructure", year: 2026,
    image: REFERENCE_IMAGES.edc, alt: "Electricity utility facility in Cambodia",
    description: "Utility reference for capacitor-bank equipment at EDC Kampot.",
    specs: [["Products", "Cap.Bank"], ["Key selling point", "Price, Quality"], ["External publication", "No"]],
  },
  {
    id: "edc-kampot-sign", title: "EDC Kampot", category: "Power Utility", sector: "infrastructure",
    location: "Kampot Province", stateCity: "Kampot Province", region: "Cambodia", scale: "Infrastructure", year: 2026,
    image: REFERENCE_IMAGES.edcSign, alt: "Electricity of Kampot facility sign",
    description: "Utility reference for capacitor-bank equipment at EDC Kampot.",
    specs: [["Products", "Cap.Bank"], ["Key selling point", "Price, Quality"], ["External publication", "No"]],
  },
  {
    id: "control-building-battery", title: "Control Building Battery 400MWH", category: "Energy Storage", sector: "energy",
    location: "Pursat", stateCity: "Pursat", region: "Cambodia", scale: "Energy Storage", year: 2025,
    image: REFERENCE_IMAGES.battery, alt: "Battery energy storage containers at a solar facility",
    description: "Battery storage control-building reference for a large renewable-energy installation.",
    specs: [["Products", "Socket & Switch NEW2M, Breaker MCB & MCCB"], ["Key selling point", "Price, Quality"], ["External publication", "N/A"]],
  },
  {
    id: "police-accommodation", title: "Police Accommodation Building", category: "Public Facility", sector: "infrastructure",
    location: "Bavet", stateCity: "Bavet", region: "Cambodia", scale: "Public Facility", year: 2025,
    image: REFERENCE_IMAGES.police, alt: "Institutional building in Cambodia",
    description: "Public-facility electrical reference for police accommodation in Bavet.",
    specs: [["Products", "Breaker MCB"], ["Key selling point", "Price, Quality"], ["External publication", "No"]],
  },
  {
    id: "gyo-grayon", title: "GYO GRAYON SHV PROJECT", category: "Commercial Building", sector: "infrastructure",
    location: "Sihanouk", stateCity: "Sihanouk", region: "Cambodia", scale: "Commercial & Industrial", year: 2025,
    image: REFERENCE_IMAGES.gyo, alt: "Commercial building in Sihanoukville",
    description: "Commercial-building reference for socket, switch, and breaker systems.",
    specs: [["Products", "Socket & Switch NEW2M, Breaker MCB"], ["Key selling point", "Price, Quality"], ["External publication", "N/A"]],
  },
  {
    id: "maha-boeng-trea", title: "BOREY Maha Boeng Trea", category: "Residential Development", sector: "residential",
    location: "Kandal, Cambodia", stateCity: "Kandal, Cambodia", region: "Cambodia", scale: "Residential Development", year: 2023,
    image: REFERENCE_IMAGES.mahaBoengTrea, alt: "Master-planned residential development in Cambodia",
    description: "Residential development reference for breaker MCB installations.",
    specs: [["Products", "Breaker MCB"], ["Key selling point", "Price, Quality"], ["External publication", "Yes"]],
  },
  {
    id: "borey-mekong-land", title: "Borey Mekong Land", category: "Residential Development", sector: "residential",
    location: "Chroy Chnava, Phnom Penh", stateCity: "Phnom Penh, Cambodia", region: "Cambodia", scale: "Residential Development", year: 2023,
    image: REFERENCE_IMAGES.mekongLand, alt: "Master-planned housing development in Phnom Penh",
    description: "Residential development reference for MCB and RCBO protection.",
    specs: [["Products", "MCB, RCBO"], ["Key selling point", "Price, Warrantee, Payment term"], ["External publication", "Yes"]],
  },
  {
    id: "borey-kim-soing", title: "Borey Kim Soing", category: "Residential Development", sector: "residential",
    location: "Chbar Ampov, Phnom Penh", stateCity: "Phnom Penh, Cambodia", region: "Cambodia", scale: "Residential Development", year: 2023,
    image: REFERENCE_IMAGES.kimSoing, alt: "Residential development in Phnom Penh",
    description: "Residential development reference for MCB and RCBO protection.",
    specs: [["Products", "MCB, RCBO"], ["Key selling point", "Price, Quality, Payment term"], ["External publication", "Yes"]],
  },
  {
    id: "borey-gb-residence", title: "Borey GB Residence", category: "Residential Development", sector: "residential",
    location: "Dangkor, Phnom Penh", stateCity: "Phnom Penh, Cambodia", region: "Cambodia", scale: "Residential Development", year: 2023,
    image: REFERENCE_IMAGES.gbResidence, alt: "Borey residential development in Phnom Penh",
    description: "Residential development reference for MCB and RCBO protection.",
    specs: [["Products", "MCB, RCBO"], ["Key selling point", "Price, Quality, Payment term"], ["External publication", "Yes"]],
  },
  {
    id: "borey-bosba", title: "Borey Bosba", category: "Residential Development", sector: "residential",
    location: "Dangkor, Phnom Penh", stateCity: "Phnom Penh, Cambodia", region: "Cambodia", scale: "Residential Development", year: 2023,
    image: REFERENCE_IMAGES.bosba, alt: "Borey Bosba residential development",
    description: "Residential development reference for MCB, RCBO, and NEW2M switch systems.",
    specs: [["Products", "MCB, RCBO, Switch-NEW2M"], ["Key selling point", "Price, Quality, Payment term"], ["External publication", "Yes"]],
  },
  {
    id: "orienda-hospital", title: "Orienda International Hospital", category: "Healthcare", sector: "healthcare",
    location: "Mean Chey, Phnom Penh", stateCity: "Phnom Penh, Cambodia", region: "Cambodia", scale: "Healthcare", year: 2023,
    image: REFERENCE_IMAGES.orienda, alt: "Hospital facility in Phnom Penh",
    description: "Healthcare-facility reference for control-box and MCB equipment.",
    specs: [["Products", "Control Box (MCB)"], ["Key selling point", "Price, Quality"], ["External publication", "Yes"]],
  },
  {
    id: "national-techo-santipheap", title: "National Techo-Santipheap Hospital", category: "Healthcare", sector: "healthcare",
    location: "Prek Pnov, Phnom Penh", stateCity: "Phnom Penh, Cambodia", region: "Cambodia", scale: "Healthcare", year: 2023,
    image: REFERENCE_IMAGES.nationalHospital, alt: "Hospital campus in Cambodia",
    description: "Healthcare-facility reference for NEW7G and cable systems.",
    specs: [["Products", "NEW7G, Cable"], ["Key selling point", "Price, Quality"], ["External publication", "Yes"]],
  },
  {
    id: "borey-ml", title: "Borey ML", category: "Residential Development", sector: "residential",
    location: "Ta Khmao City, Kandal", stateCity: "Kandal, Cambodia", monthYear: "April 2026", region: "Cambodia", scale: "Residential Development", year: 2026,
    image: REFERENCE_IMAGES.boreyMl, alt: "Townhouse development in Ta Khmao",
    description: "Residential development reference awaiting final publication confirmation.",
    specs: [["Products", "MCB, RCCB"], ["Key selling point", "Price, Quality, Service"], ["External publication", "Wait for confirm from owner"]],
  },
];

const sectors = [
  ["all", "All Projects"], ["residential", "Residential"], ["industrial", "Industrial"],
  ["education", "Education"], ["healthcare", "Healthcare"], ["hospitality", "Hospitality"],
  ["infrastructure", "Infrastructure"], ["energy", "Energy Storage"],
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

const ProjectFacts = ({ project }) => {
  const stateCity = project.stateCity || project.location.split(",").slice(1).join(",").trim() || project.location;
  const monthYear = project.monthYear || project.year;
  const labelMap = { "Key selling point": "Key Selling Point", "External publication": "Permission for external publication" };
  const facts = [["Project Location", project.location], ["State & City", stateCity], ["Month & Year", monthYear], ...project.specs.map(([label, value]) => [labelMap[label] || label, value])];

  return <Specs items={facts} />;
};

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
  const [sort, setSort] = useState("source");
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
  )).sort((a, b) => sort === "source" ? 0 : sort === "name" ? a.title.localeCompare(b.title) : sort === "oldest" ? a.year - b.year : b.year - a.year);
  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const remaining = filteredProjects.length - visibleProjects.length;

  return (
    <main className="chint-reference-page" aria-labelledby="chint-reference-title">
      <section className="chint-hero">
        <img className="chint-hero-image" src={imageUrl("list (4).jpg")} alt="" fetchPriority="high" onError={handleImageError} />
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
          <div className="chint-featured-media"><img src={imageUrl(featuredProject.image)} alt={featuredProject.alt} width="1280" height="720" onError={handleImageError} /><span className="chint-featured-badge">Flagship Implementation</span></div>
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
                <label className="chint-sort"><span>Sorted by:</span><select aria-label="Sort references" value={sort} onChange={(event) => { setSort(event.target.value); setVisibleCount(PAGE_SIZE); }}><option value="source">Reference Order</option><option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="name">Project Name</option></select></label>
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
                <div className="chint-card-media"><img src={imageUrl(project.image)} alt={project.alt} width="1280" height="720" loading="lazy" decoding="async" onError={handleImageError} /><span className={`chint-category chint-category--${project.sector}`}>{project.category}</span></div>
                <div className="chint-card-copy"><h3>{project.title}</h3><p className="chint-card-description">{project.description}</p><ProjectFacts project={project} /><button className="chint-text-link" type="button" onClick={() => setSelectedProject(project)} aria-label={`Read case study: ${project.title}`}>Quick Access Case Study<Icon name="chevron" /></button></div>
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
        {selectedProject && <><button className="chint-dialog-close" type="button" aria-label="Close case study" onClick={() => setSelectedProject(null)} autoFocus><Icon name="close" /></button><div className="chint-dialog-content"><img className="chint-dialog-image" src={imageUrl(selectedProject.image)} alt={selectedProject.alt} onError={handleImageError} /><p className="chint-eyebrow">{selectedProject.category} / Project Reference</p><h2 id="chint-dialog-title">{selectedProject.title}</h2><p className="chint-location"><Icon name="pin" />{selectedProject.location}</p><p>{selectedProject.description}</p><Specs items={selectedProject.specs} /><Link className="chint-button chint-button--primary" to={`/contact?project=${encodeURIComponent(selectedProject.title)}`}>Discuss a Similar Project<Icon name="arrow" /></Link></div></>}
      </dialog>
    </main>
  );
};

export default ReferenceChint;
