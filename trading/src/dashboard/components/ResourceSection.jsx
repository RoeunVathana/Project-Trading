import { TABLE_COLUMNS } from "../dashboardConfig";

const ResourceSection = ({
  activeSection,
  activeConfig,
  filteredRecords,
  loading,
  search,
  loadData,
  renderCell,
  recordTitle,
  onCreate,
  onEdit,
  onDelete,
}) => (
  <>
    <section className="dashboard-page-heading">
      <div>
        <span className="dashboard-eyebrow">CATALOG MANAGEMENT</span>
        <h1>{activeConfig.title}</h1>
        <p>{activeConfig.description}</p>
      </div>
      <button type="button" className="dashboard-primary-button" onClick={onCreate}>
        <span>＋</span> Add {activeConfig.singular}
      </button>
    </section>

    <section className="dashboard-panel resource-panel">
      <div className="resource-toolbar">
        <div className="resource-record-count"><strong>{filteredRecords.length}</strong><span>records</span></div>
        <div className="resource-toolbar-actions">
          <button type="button" className="dashboard-refresh-button" onClick={loadData} disabled={loading} aria-label="Refresh data" title="Refresh data">↻</button>
        </div>
      </div>

      {loading && !filteredRecords.length ? (
        <div className="dashboard-table-state"><span className="dashboard-spinner" />Loading {activeConfig.title.toLowerCase()}...</div>
      ) : filteredRecords.length ? (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>{TABLE_COLUMNS[activeSection].map((column) => <th key={column.key}>{column.label}</th>)}<th className="table-actions-heading">Actions</th></tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  {TABLE_COLUMNS[activeSection].map((column) => (
                    <td key={column.key} data-label={column.label}>{renderCell(activeSection, column.key, record)}</td>
                  ))}
                  <td data-label="Actions" className="table-actions">
                    <button type="button" className="row-action edit-action" onClick={() => onEdit(record)} aria-label={`Edit ${recordTitle(activeSection, record)}`} title="Edit">Edit</button>
                    <button type="button" className="row-action delete-action" onClick={() => onDelete(record)} aria-label={`Delete ${recordTitle(activeSection, record)}`} title="Delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="dashboard-table-state empty-state">
          <span className="empty-state-mark">{activeConfig.icon}</span>
          <strong>{search ? "No matching records" : `No ${activeConfig.title.toLowerCase()} yet`}</strong>
          <p>{search ? "Try another search term." : `Create your first ${activeConfig.singular} to get started.`}</p>
          {!search && <button type="button" className="dashboard-primary-button" onClick={onCreate}>＋ Add {activeConfig.singular}</button>}
        </div>
      )}
    </section>
  </>
);

export default ResourceSection;
