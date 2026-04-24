export type MovieFilters = {
  search?: string;
  mode?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  releaseDateFrom?: string;
  releaseDateTo?: string;
  worldwideGrossMin?: number;
  worldwideGrossMax?: number;
  productionBudgetMin?: number;
  productionBudgetMax?: number;
  domesticGrossMin?: number;
  domesticGrossMax?: number;
  genres?: string[];
};