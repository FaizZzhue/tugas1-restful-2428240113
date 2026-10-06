const movieModel = require("../models/movieModel");

// Validasi data film
const validateMovie = (body) => {
  const {
    judul,
    genre,
    durasiMenit,
    ratingUsia,
  } = body;

  if (
    !judul ||
    !genre ||
    durasiMenit === undefined ||
    !ratingUsia
  ) {
    return "Field judul, genre, durasiMenit, dan ratingUsia wajib diisi";
  }

  if (typeof durasiMenit !== "number") {
    return "durasiMenit harus berupa number";
  }

  const ratingValid = ["SU", "13+", "17+", "21+"];

  if (!ratingValid.includes(ratingUsia)) {
    return "ratingUsia harus SU, 13+, 17+, atau 21+";
  }

  return null;
};

// GET /movies
const getMovies = (req, res) => {
  const { genre } = req.query;

  if (genre) {
    const movies = movieModel.getMoviesByGenre(genre);

    return res.status(200).json(movies);
  }

  const movies = movieModel.getAllMovies();

  res.status(200).json(movies);
};

// GET /movies/:id
const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  const movie = movieModel.getMovieById(id);

  if (!movie) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  res.status(200).json(movie);
};

// POST /movies
const createMovie = (req, res) => {
  const validationError = validateMovie(req.body);

  if (validationError) {
    return res.status(400).json({
      status: "error",
      message: validationError,
      data: null,
    });
  }

  const newMovie = movieModel.createMovie({
    judul: req.body.judul,
    genre: req.body.genre,
    durasiMenit: req.body.durasiMenit,
    ratingUsia: req.body.ratingUsia,
    sutradara: req.body.sutradara || "",
  });

  res.status(201).json({
    status: "success",
    message: "Data film berhasil ditambahkan",
    data: newMovie,
  });
};

// PUT /movies/:id
const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);

  const existingMovie = movieModel.getMovieById(id);

  if (!existingMovie) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  const validationError = validateMovie(req.body);

  if (validationError) {
    return res.status(400).json({
      status: "error",
      message: validationError,
      data: null,
    });
  }

  const updatedMovie = movieModel.updateMovie(id, {
    judul: req.body.judul,
    genre: req.body.genre,
    durasiMenit: req.body.durasiMenit,
    ratingUsia: req.body.ratingUsia,
    sutradara: req.body.sutradara || "",
  });

  res.status(200).json({
    status: "success",
    message: `Data film dengan id ${id} berhasil diubah`,
    data: updatedMovie,
  });
};

// DELETE /movies/:id
const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  const existingMovie = movieModel.getMovieById(id);

  if (!existingMovie) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  movieModel.deleteMovie(id);

  res.status(200).json({
    status: "success",
    message: `Data film dengan id ${id} berhasil dihapus`,
    data: null,
  });
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};