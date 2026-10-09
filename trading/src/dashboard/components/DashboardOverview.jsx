import { CATEGORY_COLORS, RESOURCE_CONFIG, RESOURCE_KEYS } from "../dashboardConfig";

const DashboardOverview = ({
  records,
  loading,
  categoryStats,
  topCategoryStats,
  categoryTotal,
  categoryDonutBackground,
  largestCategoryViewCount,
  openCreate,
  setCurrentSection,
}) => (
  <>
    <section className="dashboard-page-heading overview-heading">
      <div>
        <span className="dashboard-eyebrow">EFSAN MACHINE / INVENTORY</span>
        <h1>Inventory Management</h1>
        <p>A clear view of your machines, categories, and technical resources.</p>
      </div>
      <button type="button" className="dashboard-primary-button" onClick={() => openCreate("machines")}>
        <span>＋</span> Add machine
      </button>
    </section>

    <section className="dashboard-metrics" aria-label="Catalog totals">
      {[
        ["Total machines", records.machines.length, "M", "Catalog inventory"],
        ["Categories", records.categories.length, "C", "Machine groups"],
        ["Gallery images", records.gallery.length, "G", "Visual resources"],
        ["PDF documents", records.pdfs.length, "P", "Technical library"],
      ].map(([label, value, icon, caption]) => (
        <article className="dashboard-metric-card" key={label}>
          <div className="metric-card-top"><span>{label}</span><b>{icon}</b></div>
          <strong>{loading ? "—" : value}</strong>
          <small>{caption}</small>
        </article>
      ))}
    </section>

    <section className="dashboard-overview-insights">
      <article className="dashboard-panel category-distribution-panel">
        <div className="dashboard-panel-heading">
          <div><span className="panel-kicker">CATALOG MIX</span><h2>Machines by category</h2></div>
          <span className="insight-period">All inventory</span>
        </div>
        <div className="category-distribution-content">
          <div className="category-donut" style={{ background: categoryDonutBackground }}>
            <div><strong>{categoryTotal}</strong><span>machines</span></div>
          </div>
          <div className="category-legend">
            {categoryStats.length ? categoryStats.slice(0, 5).map((category, index) => (
              <div className="category-legend-row" key={category.id}>
                <i style={{ background: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }} />
                <span>{category.name}</span>
                <strong>{category.machineCount}</strong>
              </div>
            )) : <p className="dashboard-insight-empty">Add categories to see the inventory breakdown.</p>}
          </div>
        </div>
      </article>

      <article className="dashboard-panel category-ranking-panel">
        <div className="dashboard-panel-heading">
            <div><span className="panel-kicker">CUSTOMER INTEREST</span><h2>Most viewed categories</h2></div>
          <button type="button" className="text-button" onClick={() => setCurrentSection("categories")}>View all <span>→</span></button>
        </div>
        <div className="category-bars">
          {topCategoryStats.length ? topCategoryStats.slice(0, 5).map((category, index) => (
            <div className="category-bar-row" key={category.id}>
              <div className="category-bar-label"><span>{category.name}</span><strong>{category.viewCount} views</strong></div>
              <div className="category-bar-track">
                <span style={{
                  width: `${Math.max(category.viewCount ? 8 : 0, category.viewCount / largestCategoryViewCount * 100)}%`,
                  background: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                }} />
              </div>
            </div>
          )) : <p className="dashboard-insight-empty">Customer views will appear here when products are explored.</p>}
        </div>
      </article>
    </section>

    <section className="dashboard-overview-grid">
      <article className="dashboard-panel overview-machine-panel">
        <div className="dashboard-panel-heading">
          <div><span className="panel-kicker">INVENTORY</span><h2>Recently added machines</h2></div>
          <button type="button" className="text-button" onClick={() => setCurrentSection("machines")}>View all <span>→</span></button>
        </div>
        {records.machines.length ? (
          <div className="recent-machine-list">
            {[...records.machines].sort((left, right) => Number(right.id) - Number(left.id)).slice(0, 5).map((machine) => (
              <div className="recent-machine-row" key={machine.id}>
                <div className="recent-machine-icon">{machine.name?.slice(0, 1).toUpperCase() || "M"}</div>
                <div className="recent-machine-info"><strong>{machine.name}</strong><span>{machine.model} · {machine.category?.name || "Uncategorized"}</span></div>
                <span className="recent-machine-id">#{String(machine.id).padStart(3, "0")}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-mini"><span>NO INVENTORY YET</span><p>Add your first machine to populate the catalog.</p></div>
        )}
      </article>

      <article className="dashboard-panel quick-actions-panel">
        <div className="dashboard-panel-heading">
          <div><span className="panel-kicker">SHORTCUTS</span><h2>Quick actions</h2></div>
        </div>
        <div className="quick-actions-list">
          {RESOURCE_KEYS.map((key) => (
            <button type="button" key={key} onClick={() => openCreate(key)}>
              <span className="quick-action-mark">{RESOURCE_CONFIG[key].icon}</span>
              <span>Add {RESOURCE_CONFIG[key].singular}</span>
              <b>＋</b>
            </button>
          ))}
        </div>
      </article>
    </section>
  </>
);

export default DashboardOverview;
