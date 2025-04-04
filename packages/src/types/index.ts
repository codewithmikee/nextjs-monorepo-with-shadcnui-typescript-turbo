/**
 * @author Mikiyas Birhanu And AI
 * @description Type definitions for the packages library
 */
 
// Pagination types
export interface PaginationOptions {
  total: number;
  initialPage?: number;
  pageSize?: number;
}

export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  items: number[];
}
