const errorHandler = (err, req, res, next) => {
  console.error(err);

  // JSON tidak valid
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: "error",
      message: "JSON request tidak valid",
      data: null,
    });
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

module.exports = {
  notFoundHandler,
  errorHandler,
};