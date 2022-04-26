const service = require("./movies.service");

// MIDDLEWARE FUNCTIONS
// check if a movie is in the db
async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  } else {
    next({ status: 404, message: "Movie cannot be found." });
  }
}

// CRUD FUNCTIONS
// list all movies or only movies currently showing
async function list(req, res) {
  const { is_showing } = req.query;
  if (!is_showing) {
    const data = await service.list();
    res.json({ data });
  } else {
    const data = await service.listIsShowing();
    res.json({ data });
  }
}

// read a movie
function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data });
}

// read theaters where a movie is showing
async function readTheatersBy(req, res) {
  const { movie } = res.locals;
  const data = await service.readTheatersBy(movie.movie_id);
  res.json({ data });
}

// read reviews for a movie
async function readReviewsBy(req, res) {
  const { movie } = res.locals;
  const data = await service.readReviewsBy(movie.movie_id);
  res.json({ data });
}

module.exports = {
  list,
  read: [movieExists, read],
  readTheatersBy: [movieExists, readTheatersBy],
  readReviewsBy: [movieExists, readReviewsBy],
};
