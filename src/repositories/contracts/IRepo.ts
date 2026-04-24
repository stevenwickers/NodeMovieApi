import {MovieFilters} from "../../types/MovieFilters.js";
import {PagedResponse} from "../../types/PagedResponse.js";
import type {MoviePatchRequest, MovieResponse} from "../../schemas/index.js";

export interface IRepo<TRequest, TResponse> {
  fetch(filters: MovieFilters): Promise<PagedResponse<MovieResponse>>;
  fetchById(id: string | number): Promise<TResponse | null>;
  create(data: TRequest): Promise<string | number>;
  update(id: string | number, data: TRequest): Promise<boolean>;
  patch?(id: string | number, data: MoviePatchRequest): Promise<TResponse | null>;
  delete(id: string | number): Promise<boolean>;
}
