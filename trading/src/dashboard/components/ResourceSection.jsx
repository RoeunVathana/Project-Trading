import { useState } from "react";
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
  onView,
  onImageView,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState(1);
  const shouldPaginate = true;
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleRecords = shouldPaginate
    ? filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredRecords;

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount));
  };

  return (
    <>
    <section className="dashboard-page-heading">
      <div>
        <span className="dashboard-eyebrow">{activeSection === "users" ? "ACCOUNT MANAGEMENT" : "CATALOG MANAGEMENT"}</span>
        <h1>{activeConfig.title}</h1>
        <p>{activeConfig.description}</p>
      </div>
      <button type="button" className="dashboard-primary-button" onClick={onCreate}>
        <span>＋</span> Add {activeConfig.singular}
      </button>
    </section>

    <section className={`dashboard-panel resource-panel resource-panel-${activeSection}`}>
      <div className="resource-toolbar">
        <div className="resource-record-count"><strong>{filteredRecords.length}</strong><span>records</span></div>
        <div className="resource-toolbar-actions">
          <button type="button" className="dashboard-refresh-button" onClick={loadData} disabled={loading} aria-label="Refresh data" title="Refresh data">↻</button>
        </div>
      </div>

      {loading && !filteredRecords.length ? (
        <div className="dashboard-table-state"><span className="dashboard-spinner" />Loading {activeConfig.title.toLowerCase()}...</div>
      ) : filteredRecords.length ? (
        <>
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>{TABLE_COLUMNS[activeSection].map((column) => <th key={column.key}>{column.label}</th>)}<th className="table-actions-heading">Actions</th></tr>
              </thead>
              <tbody>
                {visibleRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="dashboard-row-clickable"
                    tabIndex="0"
                    title={`View ${recordTitle(activeSection, record)} details`}
                    onClick={(event) => {
                      const image = event.target.closest?.("img");
                      if (image) {
                        onImageView({
                          src: image.currentSrc || image.src,
                          alt: image.alt || recordTitle(activeSection, record),
                        });
                        return;
                      }
                      if (event.target.closest("button, a, input, select, textarea")) return;
                      onView(record);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      onView(record);
                    }}
                  >
                    {TABLE_COLUMNS[activeSection].map((column) => {
                      const cellValue = renderCell(activeSection, column.key, record);
                      const isPlainValue = typeof cellValue === "string" || typeof cellValue === "number";

                      return (
                        <td key={column.key} data-label={column.label}>
                          {isPlainValue ? (
                            <span className="dashboard-cell-text" title={String(cellValue)}>{cellValue}</span>
                          ) : cellValue}
                        </td>
                      );
                    })}
                    <td data-label="Actions" className="table-actions">
                      <button type="button" className="row-action edit-action" onClick={() => onEdit(record)} aria-label={`Edit ${recordTitle(activeSection, record)}`} title="Edit">Edit</button>
                      <button type="button" className="row-action delete-action" onClick={() => onDelete(record)} aria-label={`Delete ${recordTitle(activeSection, record)}`} title="Delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {shouldPaginate && filteredRecords.length > 0 && (
            <nav className="dashboard-pagination" aria-label={`${activeConfig.title} list pagination`}>
              <button
                type="button"
                className="dashboard-pagination-button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="dashboard-pagination-pages">
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    className={`dashboard-pagination-button ${pageNumber === currentPage ? "is-active" : ""}`}
                    onClick={() => goToPage(pageNumber)}
                    aria-label={`Go to ${activeConfig.title.toLowerCase()} page ${pageNumber}`}
                    aria-current={pageNumber === currentPage ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="dashboard-pagination-button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pageCount}
              >
                Next
              </button>
              <span className="dashboard-pagination-status">Page {currentPage} of {pageCount}</span>
            </nav>
          )}
        </>
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
};

export default ResourceSection;
