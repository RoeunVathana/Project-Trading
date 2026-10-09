import { RESOURCE_CONFIG, TABLE_COLUMNS } from "../dashboardConfig";
import { publicFileUrl, recordTitle } from "../dashboardUtils";

const handleFileChange = (event, field, setForm) => {
  const input = event.target;
  const file = input.files?.[0] || null;

  if (file && field.maxSize && file.size > field.maxSize) {
    input.setCustomValidity(`${field.label} must be ${field.maxSizeLabel} or smaller.`);
    input.value = "";
    setForm((current) => ({ ...current, [field.name]: null }));
    return;
  }

  input.setCustomValidity("");
  setForm((current) => ({
    ...current,
    [field.name]: file,
    ...(field.clearField ? { [field.clearField]: false } : {}),
  }));
};

const ImagePreviewDialog = ({ imageTarget, onCloseImage }) => (
  <div className="dashboard-modal-backdrop dashboard-image-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCloseImage()}>
    <section className="dashboard-image-modal" role="dialog" aria-modal="true" aria-labelledby="image-preview-title">
      <div className="dashboard-image-toolbar">
        <div>
          <span className="dashboard-eyebrow">IMAGE PREVIEW</span>
          <h2 id="image-preview-title">{imageTarget.alt}</h2>
        </div>
        <button type="button" className="modal-close" aria-label="Close image preview" onClick={onCloseImage}>×</button>
      </div>
      <div className="dashboard-image-stage">
        <img src={imageTarget.src} alt={imageTarget.alt} />
      </div>
      <div className="dashboard-image-footer">
        <button type="button" className="dashboard-secondary-button" onClick={onCloseImage}>Close image</button>
      </div>
    </section>
  </div>
);

const RecordViewDialog = ({ viewTarget, onCloseView, onImageView, renderCell }) => {
  const { resource, record } = viewTarget;
  const columns = TABLE_COLUMNS[resource] || [];
  const imageColumn = columns.find((column) => column.key === "image");
  const detailColumns = columns.filter((column) => column.key !== "image");
  const secondaryLabel = record.model || record.email || record.description || `Record #${record.id}`;

  return (
    <div className="dashboard-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCloseView()}>
      <section className={`dashboard-modal dashboard-view-modal dashboard-view-${resource}`} role="dialog" aria-modal="true" aria-labelledby="view-dialog-title">
        <div className="dashboard-view-hero">
          <div
            className={`dashboard-view-hero-art ${imageColumn ? "is-clickable" : ""}`}
            onClick={(event) => {
              const image = event.target.closest?.("img");
              if (!image) return;
              onImageView({
                src: image.currentSrc || image.src,
                alt: image.alt || recordTitle(resource, record),
              });
            }}
          >
            {imageColumn ? (
              renderCell(resource, imageColumn.key, record)
            ) : (
              <span className="dashboard-view-hero-mark">{RESOURCE_CONFIG[resource].icon}</span>
            )}
          </div>
          <div className="dashboard-view-hero-copy">
            <div className="dashboard-view-heading-line">
              <span className="dashboard-eyebrow">{RESOURCE_CONFIG[resource].title} · DETAILS</span>
              <span className="dashboard-view-id">#{record.id}</span>
            </div>
            <h2 id="view-dialog-title">{recordTitle(resource, record)}</h2>
            <p>{secondaryLabel}</p>
          </div>
          <button type="button" className="modal-close dashboard-view-close" aria-label="Close details" onClick={onCloseView}>×</button>
        </div>

        <div className="dashboard-record-grid">
          {detailColumns.map((column) => (
            <div className="dashboard-record-field" key={column.key}>
              <span>{column.label}</span>
              <div className="dashboard-record-value">{renderCell(resource, column.key, record)}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-modal-footer">
          <button type="button" className="dashboard-secondary-button" onClick={onCloseView}>Close details</button>
        </div>
      </section>
    </div>
  );
};

const RecordDialogs = ({
  dialog,
  form,
  setForm,
  records,
  busy,
  onSave,
  onClose,
  viewTarget,
  onCloseView,
  imageTarget,
  onCloseImage,
  onImageView,
  renderCell,
  deleteTarget,
  onCancelDelete,
  onConfirmDelete,
}) => (
  <>
    {imageTarget && <ImagePreviewDialog imageTarget={imageTarget} onCloseImage={onCloseImage} />}
    {viewTarget && (
      <RecordViewDialog viewTarget={viewTarget} onCloseView={onCloseView} onImageView={onImageView} renderCell={renderCell} />
    )}

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
                  <span>{field.label}{(field.required || field.requiredOnCreate) && !dialog.record ? <b> *</b> : null}</span>
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
                        onChange={(event) => handleFileChange(event, field, setForm)}
                      />
                      <small>{form[field.name]?.name || (dialog.record ? "Choose a replacement file (optional)" : "Choose a file")}</small>
                      {field.currentKey && dialog.record?.[field.currentKey] && (
                        <small className="file-current-note">
                          Current file: <a href={publicFileUrl(dialog.record[field.currentKey])} target="_blank" rel="noreferrer">Open video</a>
                        </small>
                      )}
                      {field.maxSizeLabel && <small className="file-limit-note">Maximum {field.maxSizeLabel}</small>}
                      {field.clearField && dialog.record?.[field.currentKey] && (
                        <span className="file-clear-control">
                          <input
                            type="checkbox"
                            checked={Boolean(form[field.clearField])}
                            onChange={(event) => setForm((current) => ({ ...current, [field.clearField]: event.target.checked }))}
                          />
                          Remove current video
                        </span>
                      )}
                    </span>
                  ) : (
                    <input
                      type={field.type || "text"}
                      min={field.min}
                      value={form[field.name] ?? ""}
                      onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                      required={field.required || (!dialog.record && field.requiredOnCreate)}
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
