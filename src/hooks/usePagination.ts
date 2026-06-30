import { useMemo, useState } from "react";

const ROWS_OPTIONS = [10, 25, 50, 100] as const;

export type RowsPerPage = (typeof ROWS_OPTIONS)[number];

export function usePagination<T>(items: T[], defaultRows: RowsPerPage = 10) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(defaultRows);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return items.slice(start, start + rowsPerPage);
  }, [items, currentPage, rowsPerPage]);

  const startIndex = total === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, total);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value as RowsPerPage);
    setPage(1);
  };

  return {
    paginatedItems,
    page: currentPage,
    setPage,
    rowsPerPage,
    setRowsPerPage: handleRowsPerPageChange,
    total,
    totalPages,
    startIndex,
    endIndex,
    rowsOptions: ROWS_OPTIONS,
  };
}
