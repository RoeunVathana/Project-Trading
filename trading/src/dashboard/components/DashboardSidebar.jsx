import { API_BASE_URL } from "../dashboardApi";
import { NAV_ITEMS } from "../dashboardConfig";

const DashboardSidebar = ({
  activeSection,
  setCurrentSection,
  sidebarOpen,
  setSidebarOpen,
  loadIssues,
  account,
}) => (
  <>
    {sidebarOpen && (
      <button
        type="button"
        className="dashboard-scrim"
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    <aside className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="dashboard-brand">
        <div className="dashboard-brand-mark">EF</div>
        <div>
          <strong>EFSAN</strong>
          <span>CONTROL DESK</span>
        </div>
        <button
          type="button"
          className="sidebar-close"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        >×</button>
      </div>

      <div className="dashboard-profile">
        <span className="profile-avatar">{(account?.name || account?.username || "E").slice(0, 1).toUpperCase()}</span>
        <div>
          <strong>{account?.name || account?.username || "EFSAN Workspace"}</strong>
          <span>{account?.email || "Inventory management"}</span>
        </div>
      </div>

      <div className="dashboard-nav-label">MAIN MENU</div>
      <nav className="dashboard-nav" aria-label="Dashboard sections">
        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            key={item.key}
            className={activeSection === item.key ? "dashboard-nav-item active" : "dashboard-nav-item"}
            onClick={() => setCurrentSection(item.key)}
          >
            <span className="dashboard-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="dashboard-sidebar-foot">
        <span className={loadIssues.length ? "connection-dot connection-warning" : "connection-dot"} />
        <div>
          <strong>{loadIssues.length ? "API NEEDS ATTENTION" : "API CONNECTION"}</strong>
          <span>{API_BASE_URL}</span>
        </div>
      </div>
    </aside>
  </>
);

export default DashboardSidebar;
