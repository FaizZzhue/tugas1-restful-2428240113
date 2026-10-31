const mongoose = require("mongoose");
const Movie = require("../models/movieModel");
const Cinema = require("../models/cinemaModel");

const allowedFields = [
  "judul",
  "genre",
  "durasiMenit",
  "ratingUsia",
  "sutradara",
  "pemeran",
  "cinema",
  "createdAt",
  "updatedAt",
];

const validateMovieBody = (body) => {
  const { judul, genre, durasiMenit, ratingUsia, cinemaId } = body;

  if (!judul || !genre || durasiMenit === undefined || !ratingUsia || !cinemaId) {
    return "Field judul, genre, durasiMenit, ratingUsia, dan cinemaId wajib diisi";
  }
  if (typeof durasiMenit !== "number" || durasiMenit <= 0) {
    return "durasiMenit harus berupa number lebih dari 0";
  }
  if (!["SU", "13+", "17+", "21+"].includes(ratingUsia)) {
    return "ratingUsia harus SU, 13+, 17+, atau 21+";
  }
  if (!mongoose.isValidObjectId(cinemaId)) {
    return "cinemaId bukan ObjectId yang valid";
  }
  if (body.pemeran !== undefined && !Array.isArray(body.pemeran)) {
    return "pemeran harus berupa array";
  }
  return null;
};

const parseProjection = (fields) => {
  if (!fields) return "-__v";
  const requested = fields.split(",").map((field) => field.trim()).filter(Boolean);
  const invalid = requested.filter((field) => !allowedFields.includes(field));
  if (invalid.length) {
    const error = new Error(`Field projection tidak diizinkan: ${invalid.join(", ")}`);
    error.status = 400;
    throw error;
  }
  return requested.join(" ") + " -__v";
};

// GET /movies: filtering + pagination + sorting + projection.
const getMovies = async (req, res) => {
  const {
    genre,
    ratingUsia,
    sutradara,
    cinemaId,
    search,
    minDurasi,
    maxDurasi,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    order = "desc",
    fields,
  } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return res.status(400).json({ status: "error", message: "page harus bilangan bulat minimal 1", data: null });
  }
  if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100) {
    return res.status(400).json({ status: "error", message: "limit harus bilangan bulat antara 1 sampai 100", data: null });
  }

  const sortableFields = ["judul", "genre", "durasiMenit", "ratingUsia", "sutradara", "createdAt", "updatedAt"];
  if (!sortableFields.includes(sortBy)) {
    return res.status(400).json({ status: "error", message: "sortBy tidak didukung", data: null });
  }
  if (!["asc", "desc"].includes(order)) {
    return res.status(400).json({ status: "error", message: "order harus asc atau desc", data: null });
  }

  const filter = {};
  if (genre) filter.genre = { $regex: genre, $options: "i" };
  if (ratingUsia) filter.ratingUsia = ratingUsia;
  if (sutradara) filter.sutradara = { $regex: sutradara, $options: "i" };
  if (cinemaId) {
    if (!mongoose.isValidObjectId(cinemaId)) {
      return res.status(400).json({ status: "error", message: "cinemaId bukan ObjectId yang valid", data: null });
    }
    filter.cinema = cinemaId;
  }
  if (search) {
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { judul: { $regex: safeSearch, $options: "i" } },
      { sutradara: { $regex: safeSearch, $options: "i" } },
    ];
  }
  if (minDurasi !== undefined || maxDurasi !== undefined) {
    filter.durasiMenit = {};
    if (minDurasi !== undefined) filter.durasiMenit.$gte = Number(minDurasi);
    if (maxDurasi !== undefined) filter.durasiMenit.$lte = Number(maxDurasi);
    if (Object.values(filter.durasiMenit).some(Number.isNaN)) {
      return res.status(400).json({ status: "error", message: "minDurasi dan maxDurasi harus berupa angka", data: null });
    }
  }

  const projection = parseProjection(fields);
  const sort = { [sortBy]: order === "asc" ? 1 : -1, _id: 1 };
  const skip = (pageNumber - 1) * limitNumber;

  const [movies, totalItems] = await Promise.all([
    Movie.find(filter)
      .select(projection)
      .populate("cinema", "nama lokasi alamat")
      .sort(sort)
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    Movie.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    message: "Daftar film berhasil diambil",
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(totalItems / limitNumber),
      totalItems,
      itemsPerPage: limitNumber,
      hasNextPage: pageNumber * limitNumber < totalItems,
      hasPrevPage: pageNumber > 1,
    },
    filters: { genre, ratingUsia, sutradara, cinemaId, search, minDurasi, maxDurasi },
    data: movies,
  });
};

const getMovieById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ status: "error", message: "ID film tidak valid", data: null });
  }
  const movie = await Movie.findById(req.params.id)
    .populate("cinema", "nama lokasi alamat fasilitas")
    .lean();
  if (!movie) {
    return res.status(404).json({ status: "error", message: "Film tidak ditemukan", data: null });
  }
  res.status(200).json({ status: "success", data: movie });
};

const createMovie = async (req, res) => {
  const validationError = validateMovieBody(req.body);
  if (validationError) {
    return res.status(400).json({ status: "error", message: validationError, data: null });
  }
  const cinema = await Cinema.findById(req.body.cinemaId);
  if (!cinema) {
    return res.status(404).json({ status: "error", message: "Cinema yang dipilih tidak ditemukan", data: null });
  }

  const movie = await Movie.create({
    judul: req.body.judul,
    genre: req.body.genre,
    durasiMenit: req.body.durasiMenit,
    ratingUsia: req.body.ratingUsia,
    sutradara: req.body.sutradara || "",
    pemeran: req.body.pemeran || [],
    cinema: cinema._id,
  });
  await movie.populate("cinema", "nama lokasi alamat");
  res.status(201).json({ status: "success", message: "Film berhasil ditambahkan", data: movie });
};

const updateMovie = async (req, res) => {
  const validationError = validateMovieBody(req.body);
  if (validationError) {
    return res.status(400).json({ status: "error", message: validationError, data: null });
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ status: "error", message: "ID film tidak valid", data: null });
  }
  const cinema = await Cinema.findById(req.body.cinemaId);
  if (!cinema) {
    return res.status(404).json({ status: "error", message: "Cinema yang dipilih tidak ditemukan", data: null });
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      judul: req.body.judul,
      genre: req.body.genre,
      durasiMenit: req.body.durasiMenit,
      ratingUsia: req.body.ratingUsia,
      sutradara: req.body.sutradara || "",
      pemeran: req.body.pemeran || [],
      cinema: cinema._id,
    },
    { new: true, runValidators: true }
  ).populate("cinema", "nama lokasi alamat");

  if (!movie) {
    return res.status(404).json({ status: "error", message: "Film tidak ditemukan", data: null });
  }
  res.status(200).json({ status: "success", message: "Film berhasil diperbarui", data: movie });
};

const deleteMovie = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ status: "error", message: "ID film tidak valid", data: null });
  }
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) {
    return res.status(404).json({ status: "error", message: "Film tidak ditemukan", data: null });
  }
  res.status(200).json({ status: "success", message: "Film berhasil dihapus", data: null });
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };