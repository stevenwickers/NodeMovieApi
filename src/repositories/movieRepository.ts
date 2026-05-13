import { type IRepo } from './contracts/IRepo.js';
import type { MoviePatchRequest, MovieResponse, MovieRequest } from "../schemas/index.js";
import { MovieFilters } from '../types/MovieFilters.js';
import { PagedResponse } from '../types/PagedResponse.js';
import { resolveSort } from '../utils/sort_utils.js'
import { pool } from '../config/index.js';

export class MovieRepository implements IRepo<MovieRequest, MovieResponse> {

  async fetch(filters: MovieFilters): Promise<PagedResponse<MovieResponse>> {
    const resolvedSort = resolveSort(filters.sortBy, filters.sortDirection);
    const normalizedGenres =
      filters.genres && filters.genres.length > 0 ? filters.genres : null;

    const isPaged =
      filters.page !== undefined && filters.pageSize !== undefined;

    const moviesResult = await pool.query<MovieResponse>(
      `
      SELECT *
      FROM wickers.get_movies(
        p_search => $1,
        p_search_mode => $2,
        p_page => $3,
        p_page_size => $4,
        p_sort_by => $5,
        p_sort_direction => $6,
        p_release_date_from => $7,
        p_release_date_to => $8,
        p_worldwide_gross_min => $9,
        p_worldwide_gross_max => $10,
        p_production_budget_min => $11,
        p_production_budget_max => $12,
        p_domestic_gross_min => $13,
        p_domestic_gross_max => $14,
        p_genres => $15
      )
      `,
      [
        filters.search ?? null,
        filters.mode ?? null,
        filters.page ?? null,
        filters.pageSize ?? null,
        resolvedSort.sortBy,
        resolvedSort.sortDirection,
        filters.releaseDateFrom ?? null,
        filters.releaseDateTo ?? null,
        filters.worldwideGrossMin ?? null,
        filters.worldwideGrossMax ?? null,
        filters.productionBudgetMin ?? null,
        filters.productionBudgetMax ?? null,
        filters.domesticGrossMin ?? null,
        filters.domesticGrossMax ?? null,
        normalizedGenres,
      ]
    );

    const countResult = await pool.query<{ total_count: number }>(
      `
      SELECT wickers.get_movies_count(
        p_search => $1,
        p_search_mode => $2,
        p_release_date_from => $3,
        p_release_date_to => $4,
        p_worldwide_gross_min => $5,
        p_worldwide_gross_max => $6,
        p_production_budget_min => $7,
        p_production_budget_max => $8,
        p_domestic_gross_min => $9,
        p_domestic_gross_max => $10,
        p_genres => $11
      ) AS total_count
      `,
      [
        filters.search ?? null,
        filters.mode ?? null,
        filters.releaseDateFrom ?? null,
        filters.releaseDateTo ?? null,
        filters.worldwideGrossMin ?? null,
        filters.worldwideGrossMax ?? null,
        filters.productionBudgetMin ?? null,
        filters.productionBudgetMax ?? null,
        filters.domesticGrossMin ?? null,
        filters.domesticGrossMax ?? null,
        normalizedGenres,
      ]
    );

    const items = moviesResult.rows.map(mapMovieResponse);
    const totalCount = Number(countResult.rows[0]?.total_count ?? 0);

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? Math.max(items.length, 1);
    const totalPages = isPaged
      ? Math.ceil(totalCount / pageSize)
      : 1;

    return {
      items,
      page,
      pageSize,
      totalCount,
      totalPages,
      sortBy: resolvedSort.sortBy,
      sortDirection: resolvedSort.sortDirection,
      usedDefaultSort: resolvedSort.usedDefaultSort,
    };
  }

  async fetchById(id: string): Promise<MovieResponse | null> {
    const result = await pool.query("SELECT * FROM wickers.get_movie_by_id($1);",[id]);
    return result.rows[0] ? mapMovieResponse(result.rows[0]) : null;
  }

  async create(request: MovieRequest): Promise<string> {
    const result = await pool.query(
      `
      SELECT id
      FROM wickers.create_movie(
        p_movie_name => $1::text,
        p_release_date => $2::date,
        p_worldwide_gross => $3::numeric,
        p_production_budget => $4::numeric,
        p_domestic_gross => $5::numeric,
        p_genre_names => $6::text[]
      );
      `,
      [
        request.movieName,
        request.releaseDate,
        request.worldwideGross ?? null,
        request.productionBudget ?? null,
        request.domesticGross ?? null,
        request.genres ?? [],
      ]
    );

    const movieId = result.rows[0]?.id;

    if (!movieId) {
      throw new Error("movie_create did not return a valid id.");
    }

    return movieId;
  }

  async update(id: string, request:MovieRequest):Promise<boolean> {
    const result = await pool.query(
      `
      SELECT EXISTS (
        SELECT 1
        FROM wickers.update_movie(
          p_movie_id => $1::uuid,
          p_movie_name => $2::text,
          p_release_date => $3::date,
          p_worldwide_gross => $4::numeric,
          p_production_budget => $5::numeric,
          p_domestic_gross => $6::numeric,
          p_genre_names => $7::text[]
        )
      ) AS updated;
      `,
      [
        id,
        request.movieName,
        request.releaseDate,
        request.worldwideGross ?? null,
        request.productionBudget ?? null,
        request.domesticGross ?? null,
        request.genres ?? [],
      ]
    );

    return Boolean(result.rows[0]?.updated);
  }

  async patch(id: string, request: MoviePatchRequest): Promise<MovieResponse | null> {
    const patchPayload = buildPatchPayload(request);

    const result = await pool.query<MovieResponse>(
      `
      SELECT *
      FROM wickers.update_graphql_movie(
        $1,
        CAST($2 AS jsonb)
      );
      `,
      [id, JSON.stringify(patchPayload)]
    );

    return result.rows[0] ? mapMovieResponse(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query(
      "SELECT wickers.delete_movie($1) AS deleted;",
      [id]
    );

    return Boolean(result.rows[0]?.deleted);
  }

}

type RawMovieRow = {
  id: unknown;
  movieName?: unknown;
  movie_name?: unknown;
  releaseDate?: unknown;
  release_date?: unknown;
  worldwideGross?: unknown;
  worldwide_gross?: unknown;
  productionBudget?: unknown;
  production_budget?: unknown;
  domesticGross?: unknown;
  domestic_gross?: unknown;
  genres?: unknown;
  createdAt?: unknown;
  created_at?: unknown;
  updatedAt?: unknown;
  updated_at?: unknown;
};

function mapMovieResponse(movie: Record<string, unknown>): MovieResponse {
  const row = movie as RawMovieRow;

  return {
    id: String(row.id),
    movieName: toStringValue(row.movieName ?? row.movie_name),
    releaseDate: toDateOnlyString(row.releaseDate ?? row.release_date),
    worldwideGross: toNullableNumber(row.worldwideGross ?? row.worldwide_gross),
    productionBudget: toNullableNumber(row.productionBudget ?? row.production_budget),
    domesticGross: toNullableNumber(row.domesticGross ?? row.domestic_gross),
    genres: toStringArray(row.genres),
    createdAt: toIsoString(row.createdAt ?? row.created_at),
    updatedAt: toIsoString(row.updatedAt ?? row.updated_at),
  };
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : String(value ?? "");
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item));
}

function toDateOnlyString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value.length >= 10 ? value.slice(0, 10) : value;
  }

  return "";
}

function toIsoString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function buildPatchPayload(request: MoviePatchRequest): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  addIfDefined(payload, "movie_name", request.movieName);
  addIfDefined(payload, "release_date", request.releaseDate);
  addIfDefined(payload, "worldwide_gross", request.worldwideGross);
  addIfDefined(payload, "production_budget", request.productionBudget);
  addIfDefined(payload, "domestic_gross", request.domesticGross);
  addIfDefined(payload, "genre_names", resolvePatchGenres(request));

  return payload;
}

function resolvePatchGenres(request: MoviePatchRequest): (string | null)[] | undefined {
  if (request.genres !== undefined) {
    return request.genres ?? [];
  }

  if (request.genreNames !== undefined) {
    return request.genreNames ?? [];
  }

  return undefined;
}

function addIfDefined(
  payload: Record<string, unknown>,
  key: string,
  value: unknown
): void {
  if (value !== undefined) {
    payload[key] = value;
  }
}
