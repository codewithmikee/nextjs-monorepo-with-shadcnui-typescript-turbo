/**
 * @author Mikiyas Birhanu And AI
 * @description Pagination hook for handling pagination state
 */
import { useState, useCallback, useMemo } from 'react';
import { PaginationOptions, PaginationResult } from '../types';

export function usePagination({
  total,
  initialPage = 1,
  pageSize = 10,
}: PaginationOptions): PaginationResult {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  // Ensure current page is within bounds
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNumber);
    },
    [totalPages]
  );

  // Generate page items (for pagination display)
  const items = useMemo(() => {
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(start + 4, totalPages);
    
    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(1, end - 4);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    pageSize,
    totalItems: total,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage,
    prevPage,
    goToPage,
    items,
  };
}
