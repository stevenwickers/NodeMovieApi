type ResolvedSort = {
  sortBy: string;
  sortDirection: "ASC" | "DESC";
  usedDefaultSort: boolean;
};

export function resolveSort(sortBy?: string, sortDirection?: string): ResolvedSort {
  const allowedSorts = new Set([
    "id",
    "movie_name",
    "release_date",
    "worldwide_gross",
    "production_budget",
    "domestic_gross",
    "created_at",
    "updated_at",
  ]);

  const normalizedSortBy = sortBy?.trim().toLowerCase();
  const normalizedDirection = sortDirection?.trim().toLowerCase();

  const finalSortBy =
    normalizedSortBy && allowedSorts.has(normalizedSortBy)
      ? normalizedSortBy
      : "movie_name";

  const finalSortDirection =
    normalizedDirection === "desc" ? "DESC" : "ASC";

  return {
    sortBy: finalSortBy,
    sortDirection: finalSortDirection,
    usedDefaultSort: finalSortBy === "movie_name" && !normalizedSortBy,
  };
}