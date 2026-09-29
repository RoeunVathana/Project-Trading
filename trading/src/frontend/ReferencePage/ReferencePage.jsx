import { useState } from "react";
import "./ReferencePage.css";
const projects = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80",
    title: "High-Pressure Pumping Station",
    location: "Chaom Choun, Phnom Penh",
    sector: "Company",
    region: "Phnom Penh",
    year: "2024",
    status: "",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
    title: "Subsea Extraction System",
    location: "Stueng Mean Chey, Phnom Penh",
    sector: "Shop",
    region: "Phnom Penh",
    year: "2025",
    status: "ACTIVE",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
    title: "Hydroelectric Turbine Grid",
    location: "Khan 7 Makara, Phnom Penh",
    sector: "Home",
    region: "Phnom Penh",
    year: "2026",
    status: "COMPLETE",
  },
];

const ReferencePage = () => {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [region, setRegion] = useState("All");
  const [year, setYear] = useState("All");

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    industry: "All",
    region: "All",
    year: "All",
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      search,
      industry,
      region,
      year,
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setIndustry("All");
    setRegion("All");
    setYear("All");

    setAppliedFilters({
      search: "",
      industry: "All",
      region: "All",
      year: "All",
    });
  };

  const filteredProjects = projects.filter((project) => {
    const searchText = appliedFilters.search.toLowerCase();

    const searchMatch =
      project.title.toLowerCase().includes(searchText) ||
      project.location.toLowerCase().includes(searchText);

    const industryMatch =
      appliedFilters.industry === "All" ||
      project.sector === appliedFilters.industry;

    const regionMatch =
      appliedFilters.region === "All" ||
      project.region === appliedFilters.region;

    const yearMatch =
      appliedFilters.year === "All" || project.year === appliedFilters.year;

    return searchMatch && industryMatch && regionMatch && yearMatch;
  });

  return (
    <>
      <section className="reference-page">
        {/* ================= HERO ================= */}

        <div className="reference-hero">
          <div className="reference-hero-content">
            <span className="reference-badge">
              <span>●</span>
              2024 REFERENCE UPDATE
            </span>

            <h1>
              GLOBAL PROJECT
              <br />
              PORTFOLIO
            </h1>

            <p>
              A comprehensive record of our engineering excellence and
              industrial solutions delivered across the globe.
            </p>
          </div>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="reference-content">
          {/* ================= FILTER ================= */}

          <div className="reference-filter">
            <div className="reference-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search projects by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleApplyFilters();
                  }
                }}
              />
            </div>

            <div className="reference-selects">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="All">Industry: All</option>

                <option value="Company">Company</option>

                <option value="Shop">Shop</option>

                <option value="Home">Home</option>
              </select>

              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="All">Region: All</option>

                <option value="Phnom Penh">Phnom Penh</option>
              </select>

              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="All">Year: All</option>

                <option value="2026">Year: 2026</option>

                <option value="2025">Year: 2025</option>

                <option value="2024">Year: 2024</option>
              </select>

              <button
                type="button"
                className="reference-filter-btn"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* ================= FILTER RESULT ================= */}

          {(appliedFilters.search ||
            appliedFilters.industry !== "All" ||
            appliedFilters.region !== "All" ||
            appliedFilters.year !== "All") && (
            <div className="filter-result">
              <span>
                {filteredProjects.length} project
                {filteredProjects.length !== 1 ? "s" : ""} found
              </span>

              <button type="button" onClick={handleResetFilters}>
                Reset Filters
              </button>
            </div>
          )}

          {/* ================= PROJECT GRID ================= */}

          <div className="reference-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <article className="reference-card" key={project.id}>
                  <div className="reference-image">
                    <img src={project.image} alt={project.title} />

                    {project.status && (
                      <span
                        className={`project-status ${
                          project.status === "ACTIVE" ? "active" : "complete"
                        }`}
                      >
                        {project.status}
                      </span>
                    )}
                  </div>

                  <div className="reference-card-body">
                    <h3>{project.title}</h3>

                    <p className="project-location">{project.location}</p>

                    <div className="project-divider" />

                    <span className="project-label">SECTOR</span>

                    <p className="project-sector">{project.sector}</p>

                    <div className="project-divider" />

                    <button type="button" className="case-study-btn">
                      View Case Study
                      <span>→</span>
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="no-projects">
                <h3>NO PROJECTS FOUND</h3>

                <p>Try changing your search or filter options.</p>

                <button type="button" onClick={handleResetFilters}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= STATISTICS ================= */}

        <section className="reference-stats">
          <div className="reference-stat">
            <strong>500+</strong>

            <h3>PROJECTS DELIVERED</h3>

            <p>
              Proven track record in heavy industrial engineering across
              multiple sectors.
            </p>
          </div>

          <div className="reference-stat">
            <strong>45</strong>

            <h3>COUNTRIES REACHED</h3>

            <p>
              Our global footprint ensures localized expertise with
              international standards.
            </p>
          </div>

          <div className="reference-stat">
            <strong>25+</strong>

            <h3>YEARS OF EXPERTISE</h3>

            <p>
              Two decades of refining mechanical precision and operational
              safety.
            </p>
          </div>
        </section>
      </section>
    </>
  );
};

export default ReferencePage;
