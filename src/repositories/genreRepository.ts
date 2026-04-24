import { pool } from "../config/index.js";
import type { GenreResponse } from "../schemas/index.js";

export class GenreRepository {
  async fetch(): Promise<GenreResponse[]> {
    const result = await pool.query<GenreResponse>(
      "SELECT * FROM wickers.get_genres();"
    );

    return result.rows;
  }

  async fetchById(id: string): Promise<GenreResponse | null> {
    const result = await pool.query<GenreResponse>(
      "SELECT * FROM wickers.get_genre_by_id($1);",
      [id]
    );

    return result.rows[0] ?? null;
  }
}
