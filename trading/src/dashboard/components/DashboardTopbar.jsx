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
}) => (
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
        <strong>Welcome {account?.name || account?.username || "back"}!</strong>
      </div>
    </div>

    <div className="dashboard-topbar-actions">
      <label className="dashboard-global-search">
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
        <span aria-hidden="true">⌕</span>
      </label>
      <button
        type="button"
        className="dashboard-icon-button theme-switch"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >{theme === "dark" ? "☼" : "◐"}</button>
      <div className="dashboard-account">
        <span className="account-avatar">{(account?.name || account?.username || "U").slice(0, 1).toUpperCase()}</span>
        <span className="account-name">{account?.name || account?.username}</span>
        <button type="button" className="account-action" onClick={signOut}>Sign out</button>
      </div>
    </div>
  </header>
);

export default DashboardTopbar;
