export type PagedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  sortBy: string;
  sortDirection: string;
  usedDefaultSort: boolean;
};
