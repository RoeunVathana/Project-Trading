import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRankingSummary, normalizeRanking } from "./viewAnalytics";
import "./ViewAnalytics.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
const ENDPOINTS = { products: "/api/machines/top?limit=5", categories: "/api/categories/top?limit=5" };
const number = (value) => value.toLocaleString();
const initialState = () => ({ items: [], loading: true, error: false, updatedAt: null });

const Icon = ({ name }) => (
  <svg className="va-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "refresh" ? <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 7a7 7 0 0 1 12-2l2 3M4 16l2 3a7 7 0 0 0 12-2" /></> : <><path d="M4 20h16M7 16v-4m5 4V5m5 11V9" /><path d="M4 4v16" /></>}
  </svg>
);

const useViewAnalytics = () => {
  const [analytics, setAnalytics] = useState({ products: initialState(), categories: initialState() });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let disposed = false;
    let refreshTimer;
    let requestTimeout;
    let controller;

    const load = async () => {
      if (document.visibilityState === "hidden") {
        refreshTimer = window.setTimeout(load, 15_000);
        return;
      }
      controller = new AbortController();
      requestTimeout = window.setTimeout(() => controller.abort(), 10_000);
      setAnalytics((previous) => Object.fromEntries(Object.entries(previous).map(([kind, state]) => [kind, { ...state, loading: true }])));

      const results = await Promise.allSettled(Object.entries(ENDPOINTS).map(async ([kind, endpoint]) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok || payload.success === false || !Array.isArray(payload.data)) throw new Error("Analytics unavailable");
        return normalizeRanking(payload.data, kind);
      }));
      window.clearTimeout(requestTimeout);
      if (disposed) return;

      const updatedAt = Date.now();
      setAnalytics((previous) => Object.fromEntries(Object.keys(ENDPOINTS).map((kind, index) => {
        const result = results[index];
        return [kind, result.status === "fulfilled"
          ? { items: result.value, loading: false, error: false, updatedAt }
          : { ...previous[kind], loading: false, error: true }];
      })));
      refreshTimer = window.setTimeout(load, 15_000);
    };

    refreshTimer = window.setTimeout(load, 0);
    return () => {
      disposed = true;
      window.clearTimeout(refreshTimer);
      window.clearTimeout(requestTimeout);
      controller?.abort();
    };
  }, [refreshKey]);

  return { ...analytics, refresh: () => setRefreshKey((key) => key + 1) };
};

const StateMessage = ({ state, kind, onRetry }) => {
  if (state.loading) return <div className="va-skeleton" role="status"><span className="va-sr-only">Loading {kind} views...</span>{Array.from({ length: 5 }, (_, index) => <div key={index} />)}</div>;
  return (
    <div className="va-state" role="status">
      <Icon name="chart" />
      <h4>{state.error ? `${kind === "products" ? "Product" : "Category"} views are unavailable` : `No ${kind === "products" ? "product" : "category"} views yet`}</h4>
      <p>{state.error ? "The analytics service could not be reached. Try refreshing in a moment." : "Rankings will appear as customers open product detail pages."}</p>
      {state.error && <button className="va-retry" type="button" onClick={onRetry}>Try Again</button>}
    </div>
  );
};

const ItemName = ({ item, kind, className }) => kind === "products"
  ? <Link className={className} to={`/product/${item.id}`}>{item.name}</Link>
  : <span className={className}>{item.name}</span>;

const itemMeta = (item, kind) => kind === "products"
  ? item.categoryName
  : `${number(item.machineCount)} ${item.machineCount === 1 ? "product" : "products"} · ${item.division}`;

const RankingChart = ({ kind, state, onRetry }) => {
  const { maximum, total } = getRankingSummary(state.items);
  return (
    <article className={`va-chart-card va-chart-card--${kind}`} aria-labelledby={`va-${kind}-title`} aria-busy={state.loading}>
      <header className="va-chart-heading">
        <div><h3 id={`va-${kind}-title`}>Most-viewed {kind}</h3><p>{kind === "products" ? "Products ranked by recorded detail views" : "Combined views of all products in each active category"}</p></div>
        {state.items.length > 0 && <span className="va-total"><strong>{number(total)}</strong><small>views in top {state.items.length}</small></span>}
      </header>
      {state.error && state.items.length > 0 && <p className="va-error" role="status">Could not refresh. Showing the last successfully loaded counts.</p>}
      {state.items.length ? <>
        <ol className="va-ranking" aria-label={`${kind === "products" ? "Product" : "Category"} ranking, highest views first`}>
          {state.items.map((item, index) => <li className="va-ranking-item" key={item.id}>
            <div className="va-row-heading">
              <span className="va-rank" aria-label={`Rank ${index + 1}`}>{String(index + 1).padStart(2, "0")}</span>
              <div className="va-row-copy"><ItemName item={item} kind={kind} className="va-name" /><span className="va-row-meta">{itemMeta(item, kind)}</span></div>
              <strong className="va-count">{number(item.viewCount)}<small>{item.viewCount === 1 ? "view" : "views"}</small></strong>
            </div>
            <div className="va-track" aria-hidden="true"><span style={{ width: `${item.viewCount / maximum * 100}%` }} /></div>
          </li>)}
        </ol>
        <footer className="va-chart-footer" aria-hidden="true"><span>0</span><span>{number(maximum)} views</span></footer>
      </> : <StateMessage state={state} kind={kind} onRetry={onRetry} />}
    </article>
  );
};

const ViewAnalytics = () => {
  const { products, categories, refresh } = useViewAnalytics();
  const [leaderKind, setLeaderKind] = useState("products");
  const leaderState = leaderKind === "products" ? products : categories;
  const leaders = leaderState.items.slice(0, 4);
  const { total } = getRankingSummary(leaders);
  const loading = products.loading || categories.loading;
  const lastUpdated = Math.max(products.updatedAt || 0, categories.updatedAt || 0);
  const refreshStatus = loading ? "Updating views..." : products.error || categories.error
    ? "Some view data is unavailable"
    : `Updated ${new Date(lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <div className="view-analytics">
      <section className="distribution-section va-charts" aria-labelledby="va-title">
        <header className="va-section-heading">
          <div><p className="va-eyebrow">Customer Interest</p><h2 id="va-title">Most-viewed products &amp; categories</h2><p>Recorded product-detail views from the CHINT and factory catalog, ranked highest first.</p></div>
          <div className="va-refresh-tools"><span className="va-refresh-status">{refreshStatus}</span><button className="va-refresh" type="button" onClick={refresh} disabled={loading}><Icon name="refresh" />Refresh</button></div>
        </header>
        <div className="va-chart-grid"><RankingChart kind="products" state={products} onRetry={refresh} /><RankingChart kind="categories" state={categories} onRetry={refresh} /></div>
      </section>

      <section className="distribution-section va-leaders" aria-labelledby="va-leaders-title">
        <header className="va-section-heading">
          <div><p className="va-eyebrow">View Ranking</p><h2 id="va-leaders-title">What customers view most</h2><p>The four most-viewed {leaderKind} in the current ranking.</p></div>
          <div className="va-switch" role="group" aria-label="Choose ranking"><button className={leaderKind === "products" ? "is-active" : ""} type="button" aria-pressed={leaderKind === "products"} onClick={() => setLeaderKind("products")}>Products</button><button className={leaderKind === "categories" ? "is-active" : ""} type="button" aria-pressed={leaderKind === "categories"} onClick={() => setLeaderKind("categories")}>Categories</button></div>
        </header>
        {leaderState.error && leaders.length > 0 && <p className="va-error">Showing the last successfully loaded ranking.</p>}
        {leaders.length ? <>
          <div className={`va-leader-grid va-chart-card--${leaderKind}`}>
            {leaders.map((item, index) => {
              const share = item.viewCount / total * 100;
              return <article className="va-leader-card" key={item.id}>
                <div className="va-leader-top"><span className="va-rank">{String(index + 1).padStart(2, "0")}</span><span className="va-leader-share">{share.toFixed(1)}% of shown views</span></div>
                <h3><ItemName item={item} kind={leaderKind} /></h3><p className="va-leader-meta">{itemMeta(item, leaderKind)}</p>
                <p className="va-leader-count"><strong>{number(item.viewCount)}</strong><span>{item.viewCount === 1 ? "view" : "views"}</span></p>
                <div className="va-track" aria-hidden="true"><span style={{ width: `${share}%` }} /></div>
              </article>;
            })}
          </div>
          <p className="va-leader-note">{number(total)} views across these {leaders.length} {leaderKind}. Percentages compare the items shown. Counts refresh every 15 seconds and represent visits, not unique customers.</p>
        </> : <StateMessage state={leaderState} kind={leaderKind} onRetry={refresh} />}
      </section>
    </div>
  );
};

export default ViewAnalytics;
