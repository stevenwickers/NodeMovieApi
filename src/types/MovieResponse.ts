export type MovieResponse = {
  id: string;
  movie_name: string;
  release_date: string;
  worldwide_gross: number | null;
  production_budget: number | null;
  movie_link: string | null;
  domestic_gross: number | null;
  genres: string[];
  created_at: string;
  updated_at: string;
};