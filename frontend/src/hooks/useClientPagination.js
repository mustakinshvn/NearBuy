import { useMemo } from 'react';

export const useClientPagination = ({ items = [], page = 1, pageSize = 10 }) => {
  const safePageSize = Math.max(1, Number.parseInt(pageSize, 10) || 10);
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));
  const activePage = Math.min(Math.max(1, page), totalPages);

  const paginatedItems = useMemo(() => {
    const start = (activePage - 1) * safePageSize;
    return items.slice(start, start + safePageSize);
  }, [activePage, items, safePageSize]);

  return {
    totalPages,
    activePage,
    paginatedItems,
    pageSize: safePageSize,
  };
};
