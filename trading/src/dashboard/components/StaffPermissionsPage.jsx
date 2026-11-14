import { useMemo, useState } from "react";
import { PERMISSION_ACTIONS, PERMISSION_OPTIONS } from "../dashboardConfig";
import { requestApi } from "../dashboardApi";
import { displayAccountName } from "../dashboardUtils";

const normalizePermissions = (permissions) => (
  Array.isArray(permissions)
    ? permissions.map((permission) => String(permission).toLowerCase())
    : []
);

const PermissionIcon = ({ action }) => {
  const paths = {
    view: <><path d="M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5Z" /><circle cx="12" cy="12" r="2.5" /></>,
    create: <><path d="M12 5v14M5 12h14" /></>,
    update: <><path d="m4 16-.7 3.7L7 19l10.9-10.9-3-3L4 16Z" /><path d="m13.8 6.2 3 3M14.5 19H20" /></>,
    delete: <><path d="M4 7h16M10 11v5m4-5v5M9 7V4h6v3m-9 0 1 13h10l1-13" /></>,
  };

  return (
    <svg className="dashboard-permission-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[action]}
    </svg>
  );
};

const StaffPermissionsPage = ({
  users = [],
  token,
  selectedUserId,
  onSelectedUserIdChange,
  onBackToUsers,
  onSaved,
}) => {
  const staffUsers = useMemo(
    () => users.filter((user) => user.role !== "admin"),
    [users],
  );
  const selectedUser = staffUsers.find((user) => String(user.id) === String(selectedUserId))
    || staffUsers[0]
    || null;
  const selectedUserKey = String(selectedUser?.id || "");
  const [permissionDrafts, setPermissionDrafts] = useState({});
  const [statuses, setStatuses] = useState({});
  const [busy, setBusy] = useState(false);
  const permissions = permissionDrafts[selectedUserKey]
    || normalizePermissions(selectedUser?.permissions);
  const { message = "", error = "" } = statuses[selectedUserKey] || {};

  const updateStatus = (nextStatus) => {
    if (!selectedUserKey) return;
    setStatuses((current) => ({ ...current, [selectedUserKey]: nextStatus }));
  };

  const hasPermission = (resource, action) => (
    permissions.includes(`${resource}:${action}`.toLowerCase())
  );

  const togglePermission = (resource, action, checked) => {
    const permission = `${resource}:${action}`.toLowerCase();
    setPermissionDrafts((current) => {
      const existing = current[selectedUserKey] || permissions;
      return {
        ...current,
        [selectedUserKey]: checked
          ? [...new Set([...existing, permission])]
          : existing.filter((item) => item !== permission),
      };
    });
    updateStatus({ message: "", error: "" });
  };

  const resetPermissions = () => {
    setPermissionDrafts((current) => ({
      ...current,
      [selectedUserKey]: normalizePermissions(selectedUser?.permissions),
    }));
    updateStatus({ message: "", error: "" });
  };

  const savePermissions = async (event) => {
    event.preventDefault();
    if (!selectedUser) return;

    setBusy(true);
    updateStatus({ message: "", error: "" });
    try {
      const result = await requestApi(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        body: { permissions },
        token,
      });
      updateStatus({ message: "Permissions saved successfully.", error: "" });
      await onSaved?.(result.data);
    } catch (saveError) {
      updateStatus({ message: "", error: saveError.message || "Unable to save permissions." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="dashboard-page-heading permissions-page-heading">
        <div>
          <span className="dashboard-eyebrow">ACCESS CONTROL</span>
          <h1>Staff permissions</h1>
          <p>Choose which parts of the inventory workspace each staff member can manage.</p>
        </div>
        <button type="button" className="dashboard-secondary-button" onClick={onBackToUsers}>
          Back to users
        </button>
      </section>

      <section className="dashboard-panel dashboard-permissions-page">
        {!staffUsers.length ? (
          <div className="dashboard-permissions-empty">
            <span className="empty-state-mark">P</span>
            <strong>No staff accounts yet</strong>
            <p>Create a staff account first, then return here to assign access.</p>
            <button type="button" className="dashboard-primary-button" onClick={onBackToUsers}>
              Go to users
            </button>
          </div>
        ) : (
          <>
            <div className="dashboard-permissions-toolbar">
              <label className="dashboard-permissions-select">
                <span>Staff member</span>
                <select
                  value={selectedUser?.id || ""}
                  onChange={(event) => onSelectedUserIdChange(event.target.value)}
                >
                  {staffUsers.map((user) => (
                    <option value={user.id} key={user.id}>
                      {displayAccountName(user)} - {user.email}
                    </option>
                  ))}
                </select>
              </label>
              <div className="dashboard-permissions-user-meta">
                <span>EDITING ACCESS FOR</span>
                <strong>{displayAccountName(selectedUser)}</strong>
                <small>{selectedUser?.email}</small>
              </div>
            </div>

            <form className="dashboard-permissions-form" onSubmit={savePermissions}>
              <div className="dashboard-permissions-field">
                <div className="dashboard-permissions-intro">
                  <div>
                    <span className="dashboard-eyebrow">PERMISSION MATRIX</span>
                    <strong>Select the actions this staff member may perform.</strong>
                  </div>
                  <span>{permissions.length} permissions selected</span>
                </div>
                <div className="dashboard-permission-grid">
                  {PERMISSION_OPTIONS.map(({ resource, label }) => (
                    <fieldset className="dashboard-permission-group" key={resource}>
                      <legend>{label}</legend>
                      <div className="dashboard-permission-actions">
                        {PERMISSION_ACTIONS.map((action) => {
                          const permission = `${resource}:${action.value}`.toLowerCase();
                          return (
                            <label key={permission} className="dashboard-permission-option">
                              <input
                                type="checkbox"
                                aria-label={`${action.label} ${label}`}
                                checked={hasPermission(resource, action.value)}
                                onChange={(event) => togglePermission(resource, action.value, event.target.checked)}
                              />
                              <span className="dashboard-permission-icon" title={`${action.label} ${label}`}>
                                <PermissionIcon action={action.value} />
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>
                <small className="dashboard-field-hint">Administrators automatically have full access.</small>
              </div>

              {(message || error) && (
                <p className={`dashboard-permissions-message ${error ? "is-error" : ""}`} role={error ? "alert" : "status"}>
                  {error || message}
                </p>
              )}

              <div className="dashboard-permissions-actions">
                <button type="button" className="dashboard-secondary-button" onClick={resetPermissions} disabled={busy}>
                  Reset
                </button>
                <button type="submit" className="dashboard-primary-button" disabled={busy}>
                  {busy ? "Saving..." : "Save permissions"}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </>
  );
};

export default StaffPermissionsPage;
