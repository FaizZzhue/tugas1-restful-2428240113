// Data film disimpan di memory
let movies = [
  {
    id: 1,
    judul: "Jejak Senja",
    genre: "Drama",
    durasiMenit: 118,
    ratingUsia: "13+",
    sutradara: "Arif Wibowo",
  },
  {
    id: 2,
    judul: "Malam Terakhir",
    genre: "Thriller",
    durasiMenit: 105,
    ratingUsia: "17+",
    sutradara: "Raka Pratama",
  },
  {
    id: 3,
    judul: "Petualangan Langit",
    genre: "Adventure",
    durasiMenit: 125,
    ratingUsia: "SU",
    sutradara: "Dimas Saputra",
  },
];

let nextId = 4;

// Mengambil seluruh film
const getAllMovies = () => {
  return movies;
};

// Mengambil film berdasarkan ID
const getMovieById = (id) => {
  return movies.find((movie) => movie.id === id);
};

// Filter berdasarkan genre
const getMoviesByGenre = (genre) => {
  return movies.filter(
    (movie) => movie.genre.toLowerCase() === genre.toLowerCase()
  );
};

// Menambahkan film
const createMovie = (movieData) => {
  const newMovie = {
    id: nextId++,
    ...movieData,
  };

  movies.push(newMovie);

  return newMovie;
};

// Mengubah film
const updateMovie = (id, movieData) => {
  const index = movies.findIndex((movie) => movie.id === id);

  if (index === -1) {
    return null;
  }

  const updatedMovie = {
    id,
    ...movieData,
  };

  movies[index] = updatedMovie;

  return updatedMovie;
};

// Menghapus film
const deleteMovie = (id) => {
  const index = movies.findIndex((movie) => movie.id === id);

  if (index === -1) {
    return false;
  }

  movies.splice(index, 1);

  return true;
};

module.exports = {
  getAllMovies,
  getMovieById,
  getMoviesByGenre,
  createMovie,
  updateMovie,
  deleteMovie,
};