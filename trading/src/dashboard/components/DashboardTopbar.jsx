import { displayAccountName, publicFileUrl } from "../dashboardUtils";

const DashboardTopbar = ({
  account,
  activeSection,
  setActiveSection,
  search,
  setSearch,
  theme,
  toggleTheme,
  signOut,
  setSidebarOpen,
}) => {
  const accountName = displayAccountName(account, "back");

  return (
    <header className="dashboard-topbar">
    <div className="dashboard-topbar-left">
      <button
        type="button"
        className="dashboard-menu-button"
        aria-label="Open navigation"
        onClick={() => setSidebarOpen(true)}
      >☰</button>
      <div className="dashboard-welcome">
        <span>Dashboard</span>
        <strong>Welcome {accountName}!</strong>
      </div>
    </div>

    <div className="dashboard-topbar-actions">
      <form
        className="dashboard-global-search"
        onSubmit={(event) => {
          event.preventDefault();
          setActiveSection("machines");
        }}
      >
        <input
          value={search}
          onFocus={() => activeSection === "overview" && setActiveSection("machines")}
          onChange={(event) => {
            setSearch(event.target.value);
            if (activeSection === "overview") setActiveSection("machines");
          }}
          placeholder="Search inventory..."
          aria-label="Search inventory"
        />
        <button type="submit" className="dashboard-search-button" aria-label="Search inventory" title="Search inventory">⌕</button>
      </form>
      <button
        type="button"
        className="dashboard-icon-button theme-switch"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >{theme === "dark" ? "☼" : "◐"}</button>
      <div className="dashboard-account">
        {account?.profileImage ? (
          <img className="account-avatar" src={publicFileUrl(account.profileImage)} alt={`${accountName} profile`} />
        ) : (
          <span className="account-avatar">{accountName.slice(0, 1).toUpperCase()}</span>
        )}
        <span className="account-name">{accountName}</span>
        <button type="button" className="account-action" onClick={signOut}>Sign out</button>
      </div>
    </div>
  </header>
  );
};

export default DashboardTopbar;
