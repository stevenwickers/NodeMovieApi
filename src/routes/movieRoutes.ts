import express from "express";
import { moviePatchRequestSchema, movieRequestSchema} from '../schemas/index.js'
import { MovieRepository } from "../repositories/movieRepository.js";
import { buildMovieFilters } from "../utils/movieFilters.js";

const router = express.Router();
const repo = new MovieRepository();

router.get("/", async (req, res, next) => {
  try {
    const filters = buildMovieFilters(req.query as Record<string, unknown>);

    req.log?.info({ filters }, "Fetching movies.");

    const response = await repo.fetch(filters);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try{
    const id = req.params.id ?? '';

    //LOGGING
    req.log?.info({ movieId: id }, "Fetch Movie By Id");

    const movie = await repo.fetchById(req.params.id);

    if(!movie) {
      return res.status(404).json({
        message: "Movie not found.",
        correlationId: req.correlationId,
      });
    }

    res.json(movie)
  } catch(error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const parsed = movieRequestSchema.parse(req.body);

    //LOGGING
    req.log?.info(
      { movieName: parsed.movieName, genres: parsed.genres },
      "Creating movie"
    );

    const id = await repo.create(parsed);

    //Optional -> get object by id
    //const movie = await repo.fetchById(id);

    return res
      .status(201)
      .location(`/movies/${id}`)
      .json({ id });
  }catch(error) {
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const parsed = movieRequestSchema.parse(req.body);

    //LOGGING
    req.log?.info({ movie: parsed.movieName }, "Updating movie");

    const updated = await repo.update(req.params.id, parsed);

    if (!updated) {
      return res.status(404).json({
        message: "Movie not found.",
        correlationId: req.correlationId,
      });
    }

    // -> Note: The caller retains access to the updated movie object, as it
    // is passed by reference. For improved API efficiency, this method may
    // instead return a boolean when the updated entity is not
    // required in the response.
    const movie = await repo.fetchById(req.params.id);
    return res.json(movie);

  } catch (error) {
    next(error)
  }
})

router.patch("/:id", async (req, res, next) => {
  try {
    const parsed = moviePatchRequestSchema.parse(req.body);

    req.log?.info({ movieId: req.params.id, patch: parsed }, "Patching movie");

    const movie = await repo.patch(req.params.id, parsed);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found.",
        correlationId: req.correlationId,
      });
    }

    return res.json(movie);
  } catch (error) {
    next(error);
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id ?? '';

    //LOGGING
    req.log?.info({ movieId: id }, "Deleting movie");

    const deleted = await repo.delete(id);

    if (!deleted) {
      return res.status(404).json({
        deleted,
        message: "Movie not found.",
        correlationId: req.correlationId,
      });
    }

    return res.status(200).json({ deleted });
  }catch(error) {
    next(error)
  }
})

export default router;
