import type { MovieFilters } from "../types/MovieFilters.js";
import { toNumber } from "./number_functions.js";
import { toString, toStringArray } from "./string_functions.js";

type FilterSource = Record<string, unknown>;

export function buildMovieFilters(source: FilterSource): MovieFilters {
  const searchMode = toString(source.searchMode);
  const mode = searchMode ?? toString(source.mode);

  return {
    search: toString(source.search),
    mode,
    page: toNumber(source.page),
    pageSize: toNumber(source.pageSize),
    sortBy: toString(source.sortBy),
    sortDirection: toString(source.sortDirection),
    releaseDateFrom: toString(source.releaseDateFrom),
    releaseDateTo: toString(source.releaseDateTo),
    worldwideGrossMin: toNumber(source.worldwideGrossMin),
    worldwideGrossMax: toNumber(source.worldwideGrossMax),
    productionBudgetMin: toNumber(source.productionBudgetMin),
    productionBudgetMax: toNumber(source.productionBudgetMax),
    domesticGrossMin: toNumber(source.domesticGrossMin),
    domesticGrossMax: toNumber(source.domesticGrossMax),
    genres: toStringArray(source.genres),
  };
}
