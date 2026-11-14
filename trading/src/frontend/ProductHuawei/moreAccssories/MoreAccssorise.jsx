import { useState } from "react";
import { Link } from "react-router-dom";
import "./MoreAccssorise.css";

const imageUrl = (source) => {
  if (/^https?:\/\//i.test(source)) return source;
  return `${import.meta.env.BASE_URL}moreAccssories/${source.split("/").map(encodeURIComponent).join("/")}`;
};

const handleImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = imageUrl("list (4).jpg");
};

const categories = ["All", "Residential", "Commercial & Industrial", "Utility Scale"];
const PAGE_SIZE = 9;

/*
const legacyStories = [
  { id: "thailand-retail", title: "Powering Retail with Smarter Energy in Thailand", category: "Commercial & Industrial", image: "list (1).jpg", alt: "Thailand Dohome solar and battery energy storage project" },
  { id: "smarter-storage", title: "Smarter Storage for Cleaner Operations", category: "Commercial & Industrial", image: "smart-storage-clean-operations.jpg", alt: "Thailand SCG team and their commercial energy storage project" },
  { id: "yoonsteel", title: "Where Steel Meets Smart Power", category: "Commercial & Industrial", image: "yoonsteel-energy-storage-list.jpg", alt: "Solar panels and energy storage at the Yoonsteel factory in Malaysia" },
  { id: "kuma-village", title: "Zero-Carbon Revival of Kuma Village, Japan", category: "Commercial & Industrial", image: "list (2).jpg", alt: "Kuma Village surrounded by green mountains in Japan" },
  { id: "milan-villa", title: "One Day for Every Day", category: "Residential", image: "list.jpg", alt: "Aerial view of a Milan villa with solar panels on its terracotta roof", description: "The Milan Solar Villa – fully powered by Huawei’s Residential Smart PV & ESS 'One-Fits-All' Solution, installed in just one day, brings safe, stable, and intelligent green living to every day ahead." },
  { id: "grid-forming", title: "Grid-Forming Tech Hits Milestone: Green Power Goes Commercial at Scale", category: "Utility Scale", image: "list (4).jpg", alt: "Large-scale solar arrays in a desert landscape" },
  { id: "floating-power", title: "Floating Power, Groundbreaking Impact", category: "Utility Scale", image: "list (5).jpg", alt: "Floating solar panels on the water at Batang Ai, Sarawak, Malaysia" },
  { id: "aeon-malaysia", title: "AEON Malaysia’s Commitment to Sustainability Through Solar Energy", category: "Commercial & Industrial", image: "list (6).jpg", alt: "AEON shopping mall in Malaysia with rooftop solar panels" },
  { id: "shining-community", title: "A Shining Home, A Shining Community", category: "Residential", image: "list (7).jpg", alt: "Lakeside homes in Gnesta, Sweden, at sunset" },
  { id: "green-silesia", title: "Green Silesia, Green Needs", category: "Residential", image: "residential9-item-img1.jpg", alt: "Homes and gardens in Silesia, Poland" },
  { id: "new-rooftop", title: "It's a New Rooftop for Energy", category: "Residential", image: "residential9-item-img3.png", alt: "Rooftops and farmland in Guandimiao Village, China" },
];
*/

const stories = [
  { id: "east-condo", title: "EAST Condo", category: "Residential", image: "chint-reference/east-condo-reference.jpg", alt: "High-rise EAST Condo development in Sen Sok", location: "Sen Sok, Phnom Penh", year: 2025, products: "MDB 3200A, SDM", sellingPoint: "Price, Quality", permission: "No", description: "Electrical distribution reference for a condominium development in Sen Sok, Phnom Penh." },
  { id: "samanea-wellness-resort", title: "Samanea Wellness Resort", category: "Commercial & Industrial", image: "chint-reference/samanea-reference.jpg", alt: "Samanea Wellness Resort in Ou Saom", location: "Ou Saom, Sihanoukville", year: 2025, products: "MDB, ATS 5000A", sellingPoint: "Price, Quality", permission: "No", description: "Electrical distribution reference for a wellness resort development in Ou Saom." },
  { id: "zinus-factory", title: "ZINUS Factory", category: "Commercial & Industrial", image: "chint-reference/zinus-reference.jpg", alt: "ZINUS factory in Kandal Stueng", location: "Kandal Stueng, Kandal", year: 2025, products: "MDB 2500A", sellingPoint: "Price, Quality", permission: "No", description: "Industrial power-distribution reference for the ZINUS manufacturing facility." },
  { id: "k-cement-factory", title: "K-Cement Factory", category: "Commercial & Industrial", image: "chint-reference/k-cement-reference.jpg", alt: "K-Cement Factory in Kampot Province", location: "Kampot Province", year: 2025, products: "MSB 5000A, Cap.Bank 1500KVAR", sellingPoint: "Price, Quality", permission: "No", description: "Industrial power reference supporting cement production and reactive power compensation." },
  { id: "uhs", title: "The University of Health Sciences (UHS)", category: "Commercial & Industrial", image: "chint-reference/uhs-reference.jpg", alt: "University of Health Sciences development in Phnom Penh", location: "Prek Pnov, Phnom Penh", year: 2026, products: "Wiring", sellingPoint: "Price, Quality", permission: "Yes", description: "Wiring reference for the University of Health Sciences development." },
  { id: "westview-school", title: "Westview Cambodian International School", category: "Commercial & Industrial", image: "chint-reference/westview-reference.jpg", alt: "Westview Cambodian International School campus", location: "Sen Sok, Phnom Penh", year: 2026, products: "ATS 1600A, Capacitor Bank 300kvar", sellingPoint: "Price, Quality", permission: "No", description: "Power and capacitor-bank reference for an international school campus." },
  { id: "kork-thlork-stadium", title: "Kork Thlork Stadium", category: "Commercial & Industrial", image: "chint-reference/kork-reference.jpg", alt: "Kork Thlork Stadium development", location: "Muk Kampoul, Kandal Province", year: 2026, products: "Wiring, LV Products", sellingPoint: "Price, Quality", permission: "Yes", description: "Wiring and low-voltage product reference for a new sports stadium." },
  { id: "edc-kampot", title: "EDC Kampot", category: "Utility Scale", image: "chint-reference/edc-kampot-reference.jpg", alt: "Electricity of Kampot facility sign", location: "Kampot Province", year: 2026, products: "Cap.Bank", sellingPoint: "Price, Quality", permission: "No", description: "Utility reference for capacitor-bank equipment at EDC Kampot." },
  { id: "edc-kampot-sign", title: "EDC Kampot", category: "Utility Scale", image: "chint-reference/edc-kampot-sign-reference.jpg", alt: "Electricity of Kampot facility sign", location: "Kampot Province", year: 2026, products: "Cap.Bank", sellingPoint: "Price, Quality", permission: "No", description: "Utility reference for capacitor-bank equipment at EDC Kampot." },
  { id: "control-building-battery", title: "Control Building Battery 400MWH", category: "Utility Scale", image: "chint-reference/battery-reference.jpg", alt: "Control-building battery storage containers in Pursat", location: "Pursat", year: 2025, products: "Socket & Switch NEW2M, Breaker MCB & MCCB", sellingPoint: "Price, Quality", permission: "N/A", description: "Battery storage control-building reference for a large renewable-energy installation." },
  { id: "police-accommodation", title: "Police Accommodation Building", category: "Commercial & Industrial", image: "chint-reference/police-reference.jpg", alt: "Police accommodation building in Bavet", location: "Bavet", year: 2025, products: "Breaker MCB", sellingPoint: "Price, Quality", permission: "No", description: "Public-facility electrical reference for police accommodation in Bavet." },
  { id: "gyo-grayon", title: "GYO GRAYON SHV PROJECT", category: "Commercial & Industrial", image: "chint-reference/gyo-reference.jpg", alt: "GYO GRAYON commercial building in Sihanouk", location: "Sihanouk", year: 2025, products: "Socket & Switch NEW2M, Breaker MCB", sellingPoint: "Price, Quality", permission: "N/A", description: "Commercial-building reference for socket, switch, and breaker systems." },
  { id: "maha-boeng-trea", title: "BOREY Maha Boeng Trea", category: "Residential", image: "chint-reference/maha-boeng-trea-reference.jpg", alt: "BOREY Maha Boeng Trea residential development", location: "Kandal, Cambodia", year: 2023, products: "Breaker MCB", sellingPoint: "Price, Quality", permission: "Yes", description: "Residential development reference for breaker MCB installations." },
  { id: "borey-mekong-land", title: "Borey Mekong Land", category: "Residential", image: "chint-reference/mekong-land-reference.jpg", alt: "Borey Mekong Land development", location: "Chroy Chnava, Phnom Penh", year: 2023, products: "MCB, RCBO", sellingPoint: "Price, Warrantee, Payment term", permission: "Yes", description: "Residential development reference for MCB and RCBO protection." },
  { id: "borey-kim-soing", title: "Borey Kim Soing", category: "Residential", image: "chint-reference/kim-soing-reference.jpg", alt: "Borey Kim Soing development", location: "Chbar Ampov, Phnom Penh", year: 2023, products: "MCB, RCBO", sellingPoint: "Price, Quality, Payment term", permission: "Yes", description: "Residential development reference for MCB and RCBO protection." },
  { id: "borey-gb-residence", title: "Borey GB Residence", category: "Residential", image: "chint-reference/gb-residence-reference.jpg", alt: "Borey GB Residence development", location: "Dangkor, Phnom Penh", year: 2023, products: "MCB, RCBO", sellingPoint: "Price, Quality, Payment term", permission: "Yes", description: "Residential development reference for MCB and RCBO protection." },
  { id: "borey-bosba", title: "Borey Bosba", category: "Residential", image: "chint-reference/bosba-reference.jpg", alt: "Borey Bosba development", location: "Dangkor, Phnom Penh", year: 2023, products: "MCB, RCBO, Switch-NEW2M", sellingPoint: "Price, Quality, Payment term", permission: "Yes", description: "Residential development reference for MCB, RCBO, and NEW2M switch systems." },
  { id: "orienda-hospital", title: "Orienda International Hospital", category: "Commercial & Industrial", image: "chint-reference/orienda-reference.jpg", alt: "Orienda International Hospital equipment room", location: "Meanchey, Phnom Penh", year: 2023, products: "Control Box (MCB)", sellingPoint: "Price, Quality", permission: "Yes", description: "Healthcare-facility reference for control-box and MCB equipment." },
  { id: "national-techo-santipheap", title: "National Techo-Santipheap Hospital", category: "Commercial & Industrial", image: "chint-reference/national-hospital-reference.jpg", alt: "National Techo-Santipheap Hospital campus", location: "Prek Pnov, Phnom Penh", year: 2023, products: "NEW7G, Cable", sellingPoint: "Price, Quality", permission: "Yes", description: "Healthcare-facility reference for NEW7G and cable systems." },
  { id: "borey-ml", title: "Borey ML", category: "Residential", image: "chint-reference/borey-ml-reference.jpg", alt: "Borey ML development in Ta Khmao", location: "Ta Khmao City, Kandal", year: "April 2026", products: "MCB, RCCB", sellingPoint: "Price, Quality, Service", permission: "Wait for confirm from owner", description: "Residential development reference awaiting final publication confirmation." },
];

const featuredStory = stories.find((story) => story.id === "east-condo");
const storyMeta = (story) => `${story.location} · ${story.year} · Products: ${story.products} · Permission: ${story.permission}`;

const PageArrow = ({ previous = false }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={previous ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} />
  </svg>
);

const MoreAccssorise = () => {
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const filteredStories = category === "All" ? stories : stories.filter((story) => story.category === category);
  const showFeatured = page === 1 && (category === "All" || category === "Residential");
  const displayStories = showFeatured ? filteredStories.filter((story) => story.id !== featuredStory.id) : filteredStories;
  const pageCount = Math.ceil(displayStories.length / PAGE_SIZE);
  const visibleStories = displayStories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectCategory = (nextCategory) => {
    setCategory(nextCategory);
    setPage(1);
    setPageInput("1");
  };

  const selectPage = (nextPage) => {
    if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > pageCount) return;
    setPage(nextPage);
    setPageInput(String(nextPage));
  };

  return (
    <main className="more-accessories-page" aria-labelledby="success-stories-title">
      <div className="more-accessories-shell">
        <header className="more-accessories-heading"><h1 id="success-stories-title">Success Stories</h1></header>
        <div className="more-accessories-filters" role="group" aria-label="Filter stories by category">
          {categories.map((item) => <button key={item} type="button" className={`more-accessories-filter${category === item ? " is-active" : ""}`} aria-pressed={category === item} aria-controls="success-stories-results" onClick={() => selectCategory(item)}>{item === "All" ? "ALL" : item}</button>)}
        </div>

        <div id="success-stories-results" className="more-accessories-results">
          <p className="more-accessories-sr-only" role="status" aria-atomic="true">{category}: {displayStories.length} stories. Page {page} of {pageCount}.</p>
          {showFeatured && (
            <article className="more-accessories-featured" aria-label="Featured success story">
              <img className="more-accessories-featured-image" src={imageUrl(featuredStory.image)} alt={featuredStory.alt} width="960" height="540" fetchPriority="high" onError={handleImageError} />
              <div className="more-accessories-featured-copy"><div><h2>{featuredStory.title}</h2><p className="more-accessories-description">{featuredStory.description} {storyMeta(featuredStory)}</p></div><p className="more-accessories-category">{featuredStory.category}</p></div>
            </article>
          )}
          <div className="more-accessories-grid">
            {visibleStories.map((story) => <article className="more-accessories-card" key={story.id}><div className="more-accessories-card-media"><img src={imageUrl(story.image)} alt={story.alt} width="640" height="360" loading="lazy" decoding="async" onError={handleImageError} /></div><div className="more-accessories-card-copy"><h2 title={story.title}>{story.title}</h2><p className="more-accessories-category">{story.category}</p><p className="more-accessories-category">{storyMeta(story)}</p></div></article>)}
          </div>
        </div>

        <nav className="more-accessories-pagination" aria-label="Success stories pagination">
          <button className="more-accessories-page-arrow" type="button" aria-label="Previous page" disabled={page === 1} onClick={() => selectPage(page - 1)}><PageArrow previous /></button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button className="more-accessories-page-number" key={number} type="button" aria-label={`Page ${number}`} aria-current={page === number ? "page" : undefined} onClick={() => selectPage(number)}>{number}</button>)}
          <button className="more-accessories-page-arrow" type="button" aria-label="Next page" disabled={page === pageCount} onClick={() => selectPage(page + 1)}><PageArrow /></button>
          <form className="more-accessories-page-jump" onSubmit={(event) => { event.preventDefault(); selectPage(Number(pageInput)); }}><label className="more-accessories-sr-only" htmlFor="success-stories-page">Go to page</label><input id="success-stories-page" type="number" inputMode="numeric" min="1" max={pageCount} step="1" required value={pageInput} onChange={(event) => setPageInput(event.target.value)} /><button type="submit">Go</button></form>
        </nav>
        <nav className="more-accessories-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">&gt;</span><span aria-current="page">Success Stories</span></nav>
      </div>
    </main>
  );
};

export default MoreAccssorise;
