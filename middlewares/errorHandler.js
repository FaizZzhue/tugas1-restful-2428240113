const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: "error",
      message: "JSON request tidak valid",
      data: null,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ status: "error", message: err.message, data: null });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ status: "error", message: "Format ID atau nilai tidak valid", data: null });
  }
  if (err.code === 11000) {
    return res.status(409).json({ status: "error", message: "Data duplikat", data: null });
  }

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Terjadi kesalahan pada server",
    data: null,
  });
};

const notFoundHandler = (req, res, next) => {
  const error = new Error("Endpoint tidak ditemukan");
  error.status = 404;
  next(error);
};

module.exports = { notFoundHandler, errorHandler };