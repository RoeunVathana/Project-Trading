import { useState } from "react";
import { API_BASE_URL } from "../dashboardApi";
import { displayAccountName, publicFileUrl } from "../dashboardUtils";
import { NAV_ITEMS } from "../dashboardConfig";
import SnttLogo from "../../assets/SNTT.png";

const DashboardSidebar = ({
  activeSection,
  setCurrentSection,
  sidebarOpen,
  setSidebarOpen,
  loadIssues,
  account,
}) => {
  const [machinesOpen, setMachinesOpen] = useState(activeSection !== "overview");
  const accountName = displayAccountName(account, "EFSAN Workspace");

  return (
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
        <img className="dashboard-brand-logo" src={SnttLogo} alt="SNTT Power Systems" />
        <button
          type="button"
          className="sidebar-close"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        >×</button>
      </div>

      <div className="dashboard-profile">
        {account?.profileImage ? (
          <img className="profile-avatar" src={publicFileUrl(account.profileImage)} alt={`${accountName} profile`} />
        ) : (
          <span className="profile-avatar">{accountName.slice(0, 1).toUpperCase()}</span>
        )}
        <div>
          <strong>{accountName}</strong>
          <span>{account?.email || "Inventory management"}</span>
        </div>
      </div>

      <div className="dashboard-nav-label">MAIN MENU</div>
      <nav className="dashboard-nav" aria-label="Dashboard sections">
        {NAV_ITEMS.map((item) => {
          const childActive = item.children?.some((child) => child.key === activeSection);
          const itemActive = activeSection === item.key || childActive;

          return (
            <div
              className={`dashboard-nav-group ${item.children ? "has-submenu" : ""} ${machinesOpen || childActive ? "is-open" : ""}`}
              key={item.key}
            >
              <button
                type="button"
                className={`dashboard-nav-item ${itemActive ? "active" : ""} ${item.children ? "has-children" : ""}`}
                onClick={() => {
                  if (item.children) {
                    setMachinesOpen((isOpen) => !isOpen);
                    if (!itemActive) setCurrentSection(item.key, { closeSidebar: false });
                    return;
                  }
                  setCurrentSection(item.key);
                }}
                aria-expanded={item.children ? machinesOpen : undefined}
              >
                <span className="dashboard-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>

              {item.children && (
                <div className="dashboard-nav-submenu">
                  {item.children.map((child) => (
                    <button
                      type="button"
                      key={child.key}
                      className={`dashboard-nav-subitem ${activeSection === child.key ? "active" : ""}`}
                      onClick={() => setCurrentSection(child.key)}
                    >
                      <span className="dashboard-nav-submark">{child.icon}</span>
                      <span>{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
};

export default DashboardSidebar;
