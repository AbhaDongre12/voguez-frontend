interface AdminTablePaginationProps {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  rowsOptions: readonly number[];
  startIndex: number;
  endIndex: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export default function AdminTablePagination({
  page,
  totalPages,
  rowsPerPage,
  rowsOptions,
  startIndex,
  endIndex,
  total,
  onPageChange,
  onRowsPerPageChange,
}: AdminTablePaginationProps) {
  return (
    <div className="admin-pagination">
      <div className="admin-pagination__info">
        {total === 0
          ? "Showing 0 entries"
          : `Showing ${startIndex}–${endIndex} of ${total} entries`}
      </div>
      <div className="admin-pagination__controls">
        <label className="admin-pagination__rows">
          Rows per page
          <select
            className="admin-pagination__select"
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {rowsOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        <div className="admin-pagination__nav">
          <button
            type="button"
            className="btn-outline btn-sm admin-pagination__btn"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            Prev
          </button>
          <span className="admin-pagination__page">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="btn-outline btn-sm admin-pagination__btn"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
