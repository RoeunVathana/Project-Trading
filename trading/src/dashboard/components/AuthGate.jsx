const AuthGate = ({
  checking = false,
  accountMode,
  setAccountMode,
  accountForm,
  setAccountForm,
  submitAccount,
  busy,
  error,
  theme,
  toggleTheme,
}) => {
  if (checking) {
    return (
      <main className="dashboard-auth-screen" data-theme={theme} aria-busy="true">
        <section className="dashboard-auth-loading">
          <span className="dashboard-brand-mark">EF</span>
          <span className="dashboard-spinner" />
          <strong>Checking your account...</strong>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-auth-screen" data-theme={theme}>
      <button type="button" className="dashboard-auth-theme" onClick={toggleTheme}>
        Switch to {theme === "dark" ? "light" : "dark"} mode
      </button>
      <section className="dashboard-auth-card">
        <aside className="dashboard-auth-aside">
          <div className="dashboard-auth-brand"><span>EF</span><strong>EFSAN</strong></div>
          <div className="dashboard-auth-aside-copy">
            <span>SECURE WORKSPACE</span>
            <h1>Inventory<br />management</h1>
            <p>Sign in to manage machines, technical resources, and your catalog.</p>
          </div>
          <div className="dashboard-auth-aside-foot">MACHINE CATALOG · ADMINISTRATION</div>
        </aside>

        <section className="dashboard-auth-form-panel">
          <div className="dashboard-auth-form-heading">
            <span className="dashboard-eyebrow">EFSAN CONTROL DESK</span>
            <h2>{accountMode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p>{accountMode === "login" ? "Sign in to continue to your dashboard." : "Register to get access to the inventory workspace."}</p>
          </div>

          {error && <div className="dashboard-auth-error" role="alert">{error}</div>}

          <form className="dashboard-auth-form" onSubmit={submitAccount}>
            {accountMode === "register" ? (
              <>
                <label className="dashboard-field">
                  <span>Name</span>
                  <input required placeholder="Enter your name" value={accountForm.name} onChange={(event) => setAccountForm((current) => ({ ...current, name: event.target.value }))} autoComplete="username" />
                </label>
                <label className="dashboard-field">
                  <span>Profile image <small>(optional)</small></span>
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => setAccountForm((current) => ({ ...current, profileImage: event.target.files?.[0] || null }))} />
                </label>
                <label className="dashboard-field">
                  <span>Email</span>
                  <input type="email" required placeholder="name@example.com" value={accountForm.email} onChange={(event) => setAccountForm((current) => ({ ...current, email: event.target.value }))} autoComplete="email" />
                </label>
              </>
            ) : (
              <label className="dashboard-field">
                <span>Name or email</span>
                <input required placeholder="Enter your name or email" value={accountForm.identifier} onChange={(event) => setAccountForm((current) => ({ ...current, identifier: event.target.value }))} autoComplete="username" />
              </label>
            )}
            <label className="dashboard-field">
              <span>Password</span>
              <input type="password" required minLength="8" placeholder={accountMode === "login" ? "Enter your password" : "Create a password (8+ characters)"} value={accountForm.password} onChange={(event) => setAccountForm((current) => ({ ...current, password: event.target.value }))} autoComplete={accountMode === "login" ? "current-password" : "new-password"} />
            </label>

            <button type="submit" className="dashboard-primary-button dashboard-auth-submit" disabled={busy}>
              {busy ? "Please wait..." : accountMode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="dashboard-auth-mode-switch">
            {accountMode === "login" ? "New to EFSAN?" : "Already have an account?"}
            <button type="button" onClick={() => {
              setAccountMode((mode) => mode === "login" ? "register" : "login");
            }}>
              {accountMode === "login" ? "Create an account" : "Sign in"}
            </button>
          </div>
          <a className="dashboard-auth-back" href="/">Return to website</a>
        </section>
      </section>
    </main>
  );
};

export default AuthGate;
