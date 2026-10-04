import { RESOURCE_CONFIG } from "../dashboardConfig";
import { recordTitle } from "../dashboardUtils";

const RecordDialogs = ({
  dialog,
  form,
  setForm,
  records,
  busy,
  onSave,
  onClose,
  deleteTarget,
  onCancelDelete,
  onConfirmDelete,
}) => (
  <>
    {dialog && (
      <div className="dashboard-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <section className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="record-dialog-title">
          <div className="dashboard-modal-heading">
            <div>
              <span className="dashboard-eyebrow">{dialog.record ? "EDIT RECORD" : "NEW RECORD"}</span>
              <h2 id="record-dialog-title">{dialog.record ? "Update" : "Create"} {RESOURCE_CONFIG[dialog.resource].singular}</h2>
            </div>
            <button type="button" className="modal-close" aria-label="Close dialog" onClick={onClose}>×</button>
          </div>

          <form className="dashboard-form" onSubmit={onSave}>
            <div className="dashboard-form-grid">
              {RESOURCE_CONFIG[dialog.resource].fields.map((field) => (
                <label className={`dashboard-field ${field.type === "textarea" ? "field-wide" : ""}`} key={field.name}>
                  <span>{field.label}{field.required && !dialog.record ? <b> *</b> : null}</span>
                  {field.type === "textarea" ? (
                    <textarea value={form[field.name] || ""} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} placeholder={field.placeholder} rows="3" />
                  ) : field.type === "select" ? (
                    <select value={form[field.name] || ""} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} required={field.required}>
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {field.options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                    </select>
                  ) : field.type === "relation" ? (
                    <select value={form[field.name] || ""} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} required={field.required}>
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {(records[field.resource] || []).map((item) => (
                        <option value={item.id} key={item.id}>{item.name || item.model || `Machine #${item.id}`}{field.resource === "machines" && item.name ? ` · ${item.model}` : ""}</option>
                      ))}
                    </select>
                  ) : field.type === "file" ? (
                    <span className="file-input-wrap">
                      <input
                        type="file"
                        accept={field.accept}
                        required={!dialog.record && field.requiredOnCreate}
                        onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.files?.[0] || null }))}
                      />
                      <small>{form[field.name]?.name || (dialog.record ? "Choose a replacement file (optional)" : "Choose a file")}</small>
                    </span>
                  ) : (
                    <input
                      type={field.type || "text"}
                      min={field.min}
                      value={form[field.name] ?? ""}
                      onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="dashboard-modal-footer">
              <button type="button" className="dashboard-secondary-button" onClick={onClose} disabled={busy}>Cancel</button>
              <button type="submit" className="dashboard-primary-button" disabled={busy}>
                {busy ? "Saving..." : dialog.record ? "Save changes" : `Create ${RESOURCE_CONFIG[dialog.resource].singular}`}
              </button>
            </div>
          </form>
        </section>
      </div>
    )}

    {deleteTarget && (
      <div className="dashboard-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancelDelete()}>
        <section className="dashboard-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
          <div className="confirm-warning-mark">!</div>
          <span className="dashboard-eyebrow">CONFIRM DELETE</span>
          <h2 id="delete-dialog-title">Delete this {RESOURCE_CONFIG[deleteTarget.resource].singular}?</h2>
          <p id="delete-dialog-description">“{recordTitle(deleteTarget.resource, deleteTarget.record)}” will be permanently removed. This action cannot be undone.</p>
          <div className="dashboard-modal-footer">
            <button type="button" className="dashboard-secondary-button" onClick={onCancelDelete} disabled={busy}>Cancel</button>
            <button type="button" className="dashboard-danger-button" onClick={onConfirmDelete} disabled={busy}>{busy ? "Deleting..." : "Delete permanently"}</button>
          </div>
        </section>
      </div>
    )}
  </>
);

export default RecordDialogs;
