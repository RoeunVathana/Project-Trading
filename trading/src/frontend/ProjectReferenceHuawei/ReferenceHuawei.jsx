import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { huaweiReferences } from "./huaweiReferences";
import { downloadHuaweiLedger } from "./exportHuaweiLedger";
import "./ReferenceHuawei.css";

const imageUrl = (name) => `${import.meta.env.BASE_URL}moreAccssories/${encodeURIComponent(name)}`;
const logoUrl = (name) => `${import.meta.env.BASE_URL}logoCHINT/${encodeURIComponent(name)}`;
const emptyFilters = { search: "", voltage: "", sector: "", region: "" };
const sectors = [...new Set(huaweiReferences.map((project) => project.sector))];
const regions = [...new Set(huaweiReferences.map((project) => project.region))];
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

const Icon = ({ name }) => {
  const shapes = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
    down: <path d="m8 10 4 4 4-4" />,
    previous: <path d="m14 6-6 6 6 6" />,
    next: <path d="m10 6 6 6-6 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    download: <><path d="M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5" /></>,
    sliders: <><path d="M4 6h5m4 0h7M4 12h10m4 0h2M4 18h3m4 0h9" /><path d="M9 3v6m5 0v6m-7 0v6" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  };
  return <svg className="hr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
};

const Specifications = ({ project }) => (
  <dl className="hr-specs">
    {project.specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
  </dl>
);

const Status = ({ value }) => <span className={`hr-status hr-status--${value.toLowerCase()}`}>{value}</span>;

const FilterSelect = ({ label, value, options, onChange }) => (
  <label className="hr-select">
    <span className="hr-sr-only">{label}</span>
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{label}</option>
      {options.map(([key, text]) => <option value={key} key={key}>{text}</option>)}
    </select>
    <Icon name="down" />
  </label>
);

const CustomerLogoSlider = () => {
  const logoTrack = [...customerLogos, ...customerLogos];

  return (
    <section className="hr-customers" aria-labelledby="hr-customers-title">
      <div className="hr-container hr-customer-heading">
        <p className="hr-customer-eyebrow">Our Customers</p>
        <h2 id="hr-customers-title">Trusted by Our Customers</h2>
        <p>Contractors, developers and engineering firms that rely on SchneiTec Trading for their projects.</p>
      </div>
      <div className="hr-logo-slider" aria-label="Customer logos">
        <div className="hr-logo-track">
          {logoTrack.map((logo, index) => (
            <div className="hr-logo-card" key={`${logo}-${index}`} aria-hidden={index >= customerLogos.length}>
              <img src={logoUrl(logo)} alt={index < customerLogos.length ? logo.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") : ""} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ReferenceHuawei = () => {
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [compact, setCompact] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
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

  const setFilter = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1);
  };
  const clearFilters = () => { setFilters(emptyFilters); setPage(1); };
  const query = filters.search.trim().toLocaleLowerCase();
  const filteredProjects = huaweiReferences.filter((project) => (
    (!query || [project.id, project.title, project.country, project.region, project.sector, ...project.specs.flat()].join(" ").toLocaleLowerCase().includes(query))
    && (!filters.voltage || project.maxVoltage >= Number(filters.voltage))
    && (!filters.sector || project.sector === filters.sector)
    && (!filters.region || project.region === filters.region)
  ));
  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const visibleProjects = filteredProjects.slice((page - 1) * pageSize, page * pageSize);
  const firstResult = filteredProjects.length ? (page - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(page * pageSize, filteredProjects.length);
  const activeFilters = [
    ["sector", filters.sector && `Sector: ${filters.sector}`],
    ["voltage", filters.voltage && `Voltage: ${filters.voltage}kV+`],
    ["region", filters.region && `Geography: ${filters.region}`],
    ["search", query && `Search: ${filters.search.trim()}`],
  ].filter(([, label]) => label);

  const selectPage = (number) => {
    if (number < 1 || number > pageCount) return;
    setPage(number);
    resultsRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    resultsRef.current?.focus({ preventScroll: true });
  };
  const exportProject = (project) => downloadHuaweiLedger([project], `Huawei-${project.id}-specifications.xlsx`);

  return (
    <main className="huawei-reference-page" aria-labelledby="huawei-reference-title">
      <h1 className="hr-sr-only" id="huawei-reference-title">Huawei Global Project References</h1>
      <section className="hr-overview" aria-label="Global project overview">
        <div className="hr-container hr-overview-inner">
          <dl className="hr-metrics">
            <div><dt>Registered Projects</dt><dd>3,284 <small>+142 YTD</small></dd></div>
            <div><dt>Grid Capacity</dt><dd>78.4 GW</dd></div>
            <div><dt>Global Reach</dt><dd>140+ Countries</dd></div>
            <div><dt>Substations (UHV)</dt><dd>1,840+</dd></div>
          </dl>
          <div className="hr-overview-actions">
            <button className="hr-button hr-button--primary" type="button" disabled={!filteredProjects.length} onClick={() => downloadHuaweiLedger(filteredProjects)}>Export Ledger (.XLSX)</button>
            <button className="hr-button hr-button--light" type="button" onClick={() => { searchRef.current?.scrollIntoView({ block: "center" }); searchRef.current?.focus({ preventScroll: true }); }}>Filter View</button>
          </div>
        </div>
      </section>

      <section className="hr-filters" id="huawei-reference-filters" aria-label="Filter project references">
        <div className="hr-container">
          <div className="hr-filter-row">
            <label className="hr-search">
              <Icon name="search" /><span className="hr-sr-only">Search projects</span>
              <input ref={searchRef} type="search" aria-label="Search projects" placeholder="Search by Project Name, ID, or Specification..." value={filters.search} onChange={(event) => setFilter("search", event.target.value)} />
              {filters.search && <button className="hr-search-clear" type="button" aria-label="Clear search" onClick={() => { setFilter("search", ""); searchRef.current?.focus(); }}><Icon name="close" /></button>}
            </label>
            <div className="hr-filter-selects">
              <FilterSelect label="Voltage Rating" value={filters.voltage} options={[110, 220, 500, 1000].map((value) => [String(value), `${value}kV+`])} onChange={(value) => setFilter("voltage", value)} />
              <FilterSelect label="Industry Sector" value={filters.sector} options={sectors.map((value) => [value, value])} onChange={(value) => setFilter("sector", value)} />
              <FilterSelect label="Geography" value={filters.region} options={regions.map((value) => [value, value])} onChange={(value) => setFilter("region", value)} />
            </div>
            <div className="hr-view-switch" role="group" aria-label="Project display">
              <button className={!compact ? "is-active" : ""} type="button" aria-label="Detailed view" aria-pressed={!compact} onClick={() => setCompact(false)}><Icon name="sliders" /></button>
              <button className={compact ? "is-active" : ""} type="button" aria-label="Compact view" aria-pressed={compact} onClick={() => setCompact(true)}><Icon name="grid" /></button>
            </div>
          </div>
          <div className="hr-active-filters">
            <span className="hr-filter-caption">Active Filters:</span>
            {activeFilters.length ? <>{activeFilters.map(([key, label]) => <button className="hr-filter-chip" type="button" key={key} aria-label={`Remove ${label} filter`} onClick={() => setFilter(key, "")}><span>{label}</span><Icon name="close" /></button>)}<button className="hr-clear-all" type="button" onClick={clearFilters}>Clear All</button></> : <span className="hr-filter-hint">All projects</span>}
          </div>
        </div>
      </section>

      <div className="hr-container hr-results" id="project-matrix" ref={resultsRef} tabIndex={-1}>
        <p className="hr-sr-only" role="status" aria-atomic="true">Showing {firstResult}–{lastResult} of {filteredProjects.length} projects. Page {page} of {pageCount}.</p>
        <div className={`hr-project-grid${compact ? " is-compact" : ""}`}>
          {visibleProjects.map((project, index) => (
            <article className="hr-project-card" key={project.id}>
              <div className="hr-card-media">
                <img src={imageUrl(project.image)} alt={project.alt} width="1280" height="720" style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined} loading={index < 3 ? "eager" : "lazy"} decoding="async" />
                <span className="hr-project-id">Project ID: {project.id}</span>
              </div>
              <div className="hr-card-body">
                <div className="hr-card-meta"><p className="hr-country">{project.country}</p><Status value={project.status} /></div>
                <h2 className="hr-project-title">{project.title}</h2>
                <Specifications project={project} />
                <div className="hr-card-actions">
                  <button className="hr-button hr-button--primary" type="button" aria-label={`View full specs: ${project.title}`} onClick={() => setSelectedProject(project)}>View Full Specs</button>
                  <button className="hr-download" type="button" aria-label={`Download specifications: ${project.title}`} onClick={() => exportProject(project)}><Icon name="download" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!visibleProjects.length && <div className="hr-empty"><h2>No matching projects</h2><p>Try a different project name or adjust your filters.</p><button className="hr-button hr-button--primary" type="button" onClick={clearFilters}>Clear All Filters</button></div>}
        <nav className="hr-pagination" aria-label="Project pagination">
          <p className="hr-result-count">Showing {firstResult}–{lastResult} of {filteredProjects.length} projects</p>
          <div className="hr-page-buttons">
            <button className="hr-page-button" type="button" aria-label="Previous page" disabled={page === 1} onClick={() => selectPage(page - 1)}><Icon name="previous" /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button className={`hr-page-button${page === number ? " is-active" : ""}`} type="button" key={number} aria-label={`Page ${number}`} aria-current={page === number ? "page" : undefined} onClick={() => selectPage(number)}>{number}</button>)}
            <button className="hr-page-button" type="button" aria-label="Next page" disabled={page === pageCount} onClick={() => selectPage(page + 1)}><Icon name="next" /></button>
          </div>
          <label className="hr-page-size"><span className="hr-sr-only">Projects per page</span><select aria-label="Projects per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}>{[9, 6, 3].map((size) => <option key={size} value={size}>{size} per page</option>)}</select></label>
        </nav>
      </div>

      <CustomerLogoSlider />

      <dialog className="hr-dialog" ref={dialogRef} aria-labelledby="hr-dialog-title" onCancel={() => setSelectedProject(null)} onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setSelectedProject(null);
      }}>
        {selectedProject && <>
          <button className="hr-dialog-close" type="button" autoFocus aria-label="Close project specifications" onClick={() => setSelectedProject(null)}><Icon name="close" /></button>
          <img className="hr-dialog-image" src={imageUrl(selectedProject.image)} alt={selectedProject.alt} />
          <div className="hr-dialog-body">
            <p className="hr-country">{selectedProject.country} · {selectedProject.sector}</p>
            <h2 id="hr-dialog-title">{selectedProject.title}</h2>
            <p className="hr-dialog-id">Project ID: {selectedProject.id}</p>
            <Status value={selectedProject.status} />
            <Specifications project={selectedProject} />
            <div className="hr-dialog-actions"><button className="hr-button hr-button--primary" type="button" onClick={() => exportProject(selectedProject)}><Icon name="download" />Download Specifications</button><Link className="hr-button hr-button--outline" to={`/contact?project=${encodeURIComponent(selectedProject.title)}`}>Discuss This Project</Link></div>
          </div>
        </>}
      </dialog>
    </main>
  );
};

export default ReferenceHuawei;
