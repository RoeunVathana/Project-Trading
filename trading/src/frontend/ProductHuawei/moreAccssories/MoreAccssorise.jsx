import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./MoreAccssorise.css";

const imageUrl = (fileName) => (
  `${import.meta.env.BASE_URL}moreAccssories/${encodeURIComponent(fileName)}`
);

const categories = ["All", "Residential", "Commercial & Industrial", "Utility Scale"];
const PAGE_SIZE = 9;

const stories = [
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

const featuredStory = stories.find((story) => story.id === "milan-villa");

const PageArrow = ({ previous = false }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={previous ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} />
  </svg>
);

const MoreAccssorise = () => {
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const resultsRef = useRef(null);
  const filteredStories = category === "All" ? stories : stories.filter((story) => story.category === category);
  const pageCount = Math.ceil(filteredStories.length / PAGE_SIZE);
  const visibleStories = filteredStories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showFeatured = page === 1 && (category === "All" || category === "Residential");

  const selectCategory = (nextCategory) => {
    setCategory(nextCategory);
    setPage(1);
    setPageInput("1");
    if (resultsRef.current?.getBoundingClientRect().top < 0) {
      resultsRef.current.scrollIntoView({ block: "start", behavior: "instant" });
    }
  };

  const selectPage = (nextPage) => {
    if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > pageCount) return;
    setPage(nextPage);
    setPageInput(String(nextPage));
    resultsRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  };

  return (
    <main className="more-accessories-page" aria-labelledby="success-stories-title">
      <div className="more-accessories-shell">
        <header className="more-accessories-heading"><h1 id="success-stories-title">Success Stories</h1></header>
        <div className="more-accessories-filters" role="group" aria-label="Filter stories by category">
          {categories.map((item) => <button key={item} type="button" className={`more-accessories-filter${category === item ? " is-active" : ""}`} aria-pressed={category === item} aria-controls="success-stories-results" onClick={() => selectCategory(item)}>{item === "All" ? "ALL" : item}</button>)}
        </div>

        <div id="success-stories-results" className="more-accessories-results" ref={resultsRef} tabIndex={-1}>
          <p className="more-accessories-sr-only" role="status" aria-atomic="true">{category}: {filteredStories.length} stories. Page {page} of {pageCount}.</p>
          {showFeatured && (
            <article className="more-accessories-featured" aria-label="Featured success story">
              <img className="more-accessories-featured-image" src={imageUrl(featuredStory.image)} alt={featuredStory.alt} width="960" height="540" fetchPriority="high" />
              <div className="more-accessories-featured-copy"><div><h2>{featuredStory.title}</h2><p className="more-accessories-description">{featuredStory.description}</p></div><p className="more-accessories-category">{featuredStory.category}</p></div>
            </article>
          )}
          <div className="more-accessories-grid">
            {visibleStories.map((story) => <article className="more-accessories-card" key={story.id}><div className="more-accessories-card-media"><img src={imageUrl(story.image)} alt={story.alt} width="640" height="360" loading="lazy" decoding="async" /></div><div className="more-accessories-card-copy"><h2 title={story.title}>{story.title}</h2><p className="more-accessories-category">{story.category}</p></div></article>)}
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
