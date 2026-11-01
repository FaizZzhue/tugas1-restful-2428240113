const mongoose = require("mongoose");
const Cinema = require("../models/cinemaModel");
const Movie = require("../models/movieModel");

const validateCinema = (body) => {
  if (!body.nama || !body.lokasi || !body.alamat) {
    return "Field nama, lokasi, dan alamat wajib diisi";
  }
  if (body.fasilitas !== undefined && !Array.isArray(body.fasilitas)) {
    return "fasilitas harus berupa array";
  }
  return null;
};

const getCinemas = async (req, res) => {
  const cinemas = await Cinema.find().sort({ nama: 1 }).lean();
  res.status(200).json({ status: "success", total: cinemas.length, data: cinemas });
};

const getCinemaById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ status: "error", message: "ID cinema tidak valid", data: null });
  }
  const cinema = await Cinema.findById(req.params.id).lean();
  if (!cinema) return res.status(404).json({ status: "error", message: "Cinema tidak ditemukan", data: null });
  res.status(200).json({ status: "success", data: cinema });
};

const createCinema = async (req, res) => {
  const validationError = validateCinema(req.body);
  if (validationError) return res.status(400).json({ status: "error", message: validationError, data: null });
  const cinema = await Cinema.create({
    nama: req.body.nama,
    lokasi: req.body.lokasi,
    alamat: req.body.alamat,
    fasilitas: req.body.fasilitas || [],
  });
  res.status(201).json({ status: "success", message: "Cinema berhasil ditambahkan", data: cinema });
};

const updateCinema = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ status: "error", message: "ID cinema tidak valid", data: null });
  }
  const validationError = validateCinema(req.body);
  if (validationError) return res.status(400).json({ status: "error", message: validationError, data: null });
  const cinema = await Cinema.findByIdAndUpdate(
    req.params.id,
    { nama: req.body.nama, lokasi: req.body.lokasi, alamat: req.body.alamat, fasilitas: req.body.fasilitas || [] },
    { new: true, runValidators: true }
  );
  if (!cinema) return res.status(404).json({ status: "error", message: "Cinema tidak ditemukan", data: null });
  res.status(200).json({ status: "success", message: "Cinema berhasil diperbarui", data: cinema });
};

const deleteCinema = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ status: "error", message: "ID cinema tidak valid", data: null });
  }
  const linkedMovies = await Movie.countDocuments({ cinema: req.params.id });
  if (linkedMovies > 0) {
    return res.status(409).json({
      status: "error",
      message: "Cinema tidak dapat dihapus karena masih digunakan oleh film",
      linkedMovies,
      data: null,
    });
  }
  const cinema = await Cinema.findByIdAndDelete(req.params.id);
  if (!cinema) return res.status(404).json({ status: "error", message: "Cinema tidak ditemukan", data: null });
  res.status(200).json({ status: "success", message: "Cinema berhasil dihapus", data: null });
};

module.exports = { getCinemas, getCinemaById, createCinema, updateCinema, deleteCinema };