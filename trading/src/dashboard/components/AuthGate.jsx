import { useState } from "react";
import SnttLogo from "../../assets/SNTT.png";
import { UPLOAD_LIMITS } from "../dashboardConfig";

const PasswordVisibilityIcon = ({ visible }) => (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    {visible ? (
      <>
        <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M10.73 5.08A10.74 10.74 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.75 9.75 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </>
    )}
  </svg>
);

const AuthGate = ({
  checking = false,
  accountMode,
  setAccountMode,
  accountForm,
  setAccountForm,
  submitAccount,
  busy,
  error,
  success,
  theme,
  toggleTheme,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleProfileImageChange = (event) => {
    const input = event.target;
    const file = input.files?.[0] || null;
    if (file && file.size > UPLOAD_LIMITS.image.bytes) {
      input.setCustomValidity(`Profile image must be ${UPLOAD_LIMITS.image.label} or smaller.`);
      input.value = "";
      setAccountForm((current) => ({ ...current, profileImage: null }));
      return;
    }

    input.setCustomValidity("");
    setAccountForm((current) => ({ ...current, profileImage: file }));
  };

  if (checking) {
    return (
      <main className="dashboard-auth-screen" data-theme={theme} aria-busy="true">
        <section className="dashboard-auth-loading">
          <img className="dashboard-auth-loading-logo" src={SnttLogo} alt="SNTT Power Systems" />
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
          <div className="dashboard-auth-brand">
            <img className="dashboard-auth-logo" src={SnttLogo} alt="SNTT Power Systems" />
          </div>
          <div className="dashboard-auth-aside-copy">
            <span>SECURE WORKSPACE</span>
            <h1>Inventory<br />management</h1>
            <p>Sign in to manage machines, technical resources, and your catalog.</p>
          </div>
          <div className="dashboard-auth-aside-foot">MACHINE CATALOG · ADMINISTRATION</div>
        </aside>

        <section className="dashboard-auth-form-panel">
          <div className="dashboard-auth-form-heading">
            <span className="dashboard-eyebrow">SNTT CONTROL DESK</span>
            <h2>{accountMode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p>{accountMode === "login" ? "Sign in to continue to your dashboard." : "Register to get access to the inventory workspace."}</p>
          </div>

          {error && <div className="dashboard-auth-error" role="alert">{error}</div>}
          {success && <div className="dashboard-auth-success" role="status">{success}</div>}

          <form className="dashboard-auth-form" onSubmit={submitAccount}>
            {accountMode === "register" ? (
              <>
                <label className="dashboard-field">
                  <span>Name</span>
                  <input required placeholder="Enter your name" value={accountForm.name} onChange={(event) => setAccountForm((current) => ({ ...current, name: event.target.value }))} autoComplete="username" />
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
              <div className="dashboard-password-input">
                <input id="dashboard-auth-password" type={showPassword ? "text" : "password"} required minLength="8" placeholder={accountMode === "login" ? "Enter your password" : "Create a password (8+ characters)"} value={accountForm.password} onChange={(event) => setAccountForm((current) => ({ ...current, password: event.target.value }))} autoComplete={accountMode === "login" ? "current-password" : "new-password"} />
                <button
                  type="button"
                  className={`dashboard-password-toggle ${showPassword ? "is-visible" : ""}`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  aria-controls="dashboard-auth-password"
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  <PasswordVisibilityIcon visible={showPassword} />
                </button>
              </div>
            </label>

            {accountMode === "register" && (
              <label className="dashboard-field">
                <span>Profile image <small>(optional)</small></span>
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleProfileImageChange} />
                <small>Maximum {UPLOAD_LIMITS.image.label}</small>
              </label>
            )}

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
