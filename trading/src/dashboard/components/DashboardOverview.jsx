import { useMemo, useState } from "react";
import { CATEGORY_COLORS, RESOURCE_CONFIG } from "../dashboardConfig";

const CHINT_RESOURCES = ["machines", "categories", "gallery", "specs", "pdfs"];
const HUAWEI_RESOURCES = ["huawei", "huaweiCategories", "huaweiImages", "huaweiPdfs"];

const getHuaweiCategoryIds = (product) => {
  if (Array.isArray(product?.categoryIds) && product.categoryIds.length) return product.categoryIds;
  if (typeof product?.categoryIds === "string" && product.categoryIds.trim()) {
    return product.categoryIds.split(",").map((value) => value.trim()).filter(Boolean);
  }
  if (product?.category?.id) return [product.category.id];
  return product?.categoryId ? [product.categoryId] : [];
};

const makeDonutBackground = (items, total) => {
  if (!total) return "conic-gradient(var(--theme-surface-3) 0deg 360deg)";
  let start = 0;
  const segments = items
    .filter((item) => item.value > 0)
    .map((item, index) => {
      const end = start + (item.value / total) * 360;
      const segment = `${CATEGORY_COLORS[index % CATEGORY_COLORS.length]} ${start}deg ${end}deg`;
      start = end;
      return segment;
    });
  return `conic-gradient(${segments.join(", ")})`;
};

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
  canCreateResource,
}) => {
  const [catalog, setCatalog] = useState("chint");
  const isHuawei = catalog === "huawei";

  const huaweiCategoryStats = useMemo(() => records.huaweiCategories
    .map((category) => ({
      ...category,
      value: records.huawei.filter((product) => getHuaweiCategoryIds(product)
        .some((categoryId) => String(categoryId) === String(category.id))).length,
    }))
    .sort((left, right) => right.value - left.value || Number(left.displayOrder || 0) - Number(right.displayOrder || 0)),
  [records.huawei, records.huaweiCategories]);

  const huaweiCategoryTotal = huaweiCategoryStats.reduce((total, category) => total + category.value, 0);
  const huaweiDonutBackground = makeDonutBackground(huaweiCategoryStats, huaweiCategoryTotal);
  const activeCategoryStats = isHuawei
    ? huaweiCategoryStats
    : categoryStats.map((category) => ({ ...category, value: category.machineCount }));
  const activeCategoryTotal = isHuawei ? records.huawei.length : categoryTotal;
  const activeDonutBackground = isHuawei ? huaweiDonutBackground : categoryDonutBackground;
  const activeTopCategories = isHuawei ? huaweiCategoryStats : topCategoryStats;
  const activeLargestCategoryValue = isHuawei
    ? Math.max(1, ...huaweiCategoryStats.map((category) => category.value))
    : largestCategoryViewCount;
  const resourceKeys = isHuawei ? HUAWEI_RESOURCES : CHINT_RESOURCES;
  const primaryResource = isHuawei ? "huawei" : "machines";
  const categoryResource = isHuawei ? "huaweiCategories" : "categories";
  const brandLabel = isHuawei ? "HUAWEI" : "CHINT";
  const recordsForRecent = isHuawei ? records.huawei : records.machines;
  const hasCreateAction = resourceKeys.some((key) => canCreateResource(key));

  return (
    <>
      <section className="dashboard-page-heading overview-heading">
        <div>
          <span className="dashboard-eyebrow">EFSAN {brandLabel} / {isHuawei ? "PRODUCT" : "INVENTORY"}</span>
          <h1>{isHuawei ? "Huawei Product Management" : "Chint Inventory Management"}</h1>
          <p>{isHuawei ? "Manage Huawei products, categories, gallery images, and technical PDFs." : "Manage Chint machines, categories, and technical resources."}</p>
        </div>
        <div className="dashboard-catalog-switcher" aria-label="Product catalog">
          <button type="button" className={!isHuawei ? "is-active" : ""} onClick={() => setCatalog("chint")}>CHINT</button>
          <button type="button" className={isHuawei ? "is-active" : ""} onClick={() => setCatalog("huawei")}>HUAWEI</button>
        </div>
        {canCreateResource(primaryResource) && (
          <button type="button" className="dashboard-primary-button" onClick={() => openCreate(primaryResource)}>
          <span>ï¼‹</span> Add {isHuawei ? "product" : "machine"}
          </button>
        )}
      </section>

      <section className="dashboard-metrics" aria-label={`${brandLabel} catalog totals`}>
        {(isHuawei
          ? [
              ["Total products", records.huawei.length, "H", "Huawei catalog"],
              ["Categories", records.huaweiCategories.length, "C", "Product groups"],
              ["Gallery images", records.huaweiImages.length, "G", "Product media"],
              ["PDF documents", records.huaweiPdfs.length, "P", "Technical library"],
            ]
          : [
              ["Total machines", records.machines.length, "M", "Chint inventory"],
              ["Categories", records.categories.length, "C", "Machine groups"],
              ["Gallery images", records.gallery.length, "G", "Visual resources"],
              ["PDF documents", records.pdfs.length, "P", "Technical library"],
            ]
        ).map(([label, value, icon, caption]) => (
          <article className="dashboard-metric-card" key={label}>
            <div className="metric-card-top"><span>{label}</span><b>{icon}</b></div>
            <strong>{loading ? "â€”" : value}</strong>
            <small>{caption}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-overview-insights">
        <article className="dashboard-panel category-distribution-panel">
          <div className="dashboard-panel-heading">
            <div><span className="panel-kicker">{brandLabel} CATALOG MIX</span><h2>{isHuawei ? "Products by category" : "Machines by category"}</h2></div>
            <span className="insight-period">{isHuawei ? "Published catalog" : "All inventory"}</span>
          </div>
          <div className="category-distribution-content">
            <div className="category-donut" style={{ background: activeDonutBackground }}>
              <div><strong>{activeCategoryTotal}</strong><span>{isHuawei ? "products" : "machines"}</span></div>
            </div>
            <div className="category-legend">
              {activeCategoryStats.length ? activeCategoryStats.slice(0, 5).map((category, index) => (
                <div className="category-legend-row" key={category.id}>
                  <i style={{ background: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }} />
                  <span>{category.name}</span>
                  <strong>{category.value}</strong>
                </div>
              )) : <p className="dashboard-insight-empty">Add {isHuawei ? "Huawei products and categories" : "machines and categories"} to see the catalog mix.</p>}
            </div>
          </div>
        </article>

        <article className="dashboard-panel category-ranking-panel">
          <div className="dashboard-panel-heading">
            <div><span className="panel-kicker">{brandLabel} CATALOG</span><h2>{isHuawei ? "Products by category" : "Most viewed categories"}</h2></div>
            <button type="button" className="text-button" onClick={() => setCurrentSection(categoryResource)}>View all <span>â†’</span></button>
          </div>
          <div className="category-bars">
            {activeTopCategories.length ? activeTopCategories.slice(0, 5).map((category, index) => {
              const value = isHuawei ? category.value : category.viewCount;
              return (
                <div className="category-bar-row" key={category.id}>
                  <div className="category-bar-label"><span>{category.name}</span><strong>{value} {isHuawei ? "products" : "views"}</strong></div>
                  <div className="category-bar-track">
                    <span style={{
                      width: `${Math.max(value ? 8 : 0, value / activeLargestCategoryValue * 100)}%`,
                      background: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                    }} />
                  </div>
                </div>
              );
            }) : <p className="dashboard-insight-empty">No {brandLabel.toLowerCase()} category data yet.</p>}
          </div>
        </article>
      </section>

      <section className="dashboard-overview-grid">
        <article className="dashboard-panel overview-machine-panel">
          <div className="dashboard-panel-heading">
            <div><span className="panel-kicker">{brandLabel} CATALOG</span><h2>Recently added {isHuawei ? "products" : "machines"}</h2></div>
            <button type="button" className="text-button" onClick={() => setCurrentSection(primaryResource)}>View all <span>â†’</span></button>
          </div>
          {recordsForRecent.length ? (
            <div className="recent-machine-list">
              {[...recordsForRecent].sort((left, right) => Number(right.id) - Number(left.id)).slice(0, 5).map((record) => {
                const title = isHuawei ? (record.productName || record.name || record.modelCode) : record.name;
                const model = isHuawei ? (record.modelCode || record.model) : record.model;
                const category = isHuawei ? (record.category?.name || record.categoryName || "Uncategorized") : (record.category?.name || "Uncategorized");
                return (
                  <div className="recent-machine-row" key={record.id}>
                    <div className="recent-machine-icon">{isHuawei ? "H" : title?.slice(0, 1).toUpperCase() || "M"}</div>
                    <div className="recent-machine-info"><strong>{title}</strong><span>{model} Â· {category}</span></div>
                    <span className="recent-machine-id">#{String(record.id).padStart(3, "0")}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty-mini"><span>NO {brandLabel} RECORDS YET</span><p>Add your first {isHuawei ? "Huawei product" : "Chint machine"} to populate the catalog.</p></div>
          )}
        </article>

        <article className="dashboard-panel quick-actions-panel">
          <div className="dashboard-panel-heading">
            <div><span className="panel-kicker">{brandLabel} SHORTCUTS</span><h2>Quick actions</h2></div>
          </div>
          <div className="quick-actions-list">
            {resourceKeys.filter((key) => canCreateResource(key)).map((key) => (
              <button type="button" key={key} onClick={() => openCreate(key)}>
                <span className="quick-action-mark">{RESOURCE_CONFIG[key].icon}</span>
                <span>Add {RESOURCE_CONFIG[key].singular}</span>
                <b>ï¼‹</b>
              </button>
            ))}
            {!hasCreateAction && <p className="dashboard-insight-empty">Ask an administrator to assign create permission for this catalog.</p>}
          </div>
        </article>
      </section>
    </>
  );
};

export default DashboardOverview;
