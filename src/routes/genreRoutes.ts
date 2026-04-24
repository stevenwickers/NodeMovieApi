import express from "express";

import { GenreRepository } from "../repositories/genreRepository.js";

const router = express.Router();
const repo = new GenreRepository();

router.get("/", async (req, res, next) => {
  try {
    req.log?.info("Fetching genres.");

    const genres = await repo.fetch();
    return res.json(genres);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id ?? "";

    req.log?.info({ genreId: id }, "Fetch Genre By Id");

    const genre = await repo.fetchById(id);

    if (!genre) {
      return res.status(404).json({
        message: "Genre not found.",
        correlationId: req.correlationId,
      });
    }

    return res.json(genre);
  } catch (error) {
    next(error);
  }
});

export default router;
