const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const cekApiKey = require("../middlewares/cekApiKey");

// GET /movies
router.get("/", movieController.getMovies);

// GET /movies/:id
router.get("/:id", movieController.getMovieById);

// POST /movies
router.post("/", cekApiKey, movieController.createMovie);

// PUT /movies/:id
router.put("/:id", cekApiKey, movieController.updateMovie);

// DELETE /movies/:id
router.delete("/:id", cekApiKey, movieController.deleteMovie);

module.exports = router;