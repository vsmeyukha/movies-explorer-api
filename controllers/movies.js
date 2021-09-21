const Movie = require('../models/movie');
const CastError = require('../errors/castError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/ConflictError');
const errors = require('../constants/errors');
const messages = require('../constants/messages');

const getAllMovies = async (req, res, next) => {
  // ? вот так надо, но сделаем так попозже, когда порешаем с сохранением новых фильмов:
  const allMovies = await Movie.find({ owner: req.user._id });
  res.status(200).send(allMovies);
};

const createMovie = async (req, res, next) => {
  const owner = req.user._id;

  const movie = { ...req.body, owner };

  const allMovies = await Movie.find({ owner: req.user._id });

  const movieIsAlreadySaved = allMovies.some((oneMovie) => oneMovie.movieId === req.body.movieId);

  if (movieIsAlreadySaved) {
    return next(new ConflictError(errors.conflictMovie));
  } return Movie.create(movie)
    .then((film) => res.status(200).send(film))
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;

  const { movieId } = req.params;

  Movie.findOne({ movieId })
    .orFail(new NotFoundError(errors.notFoundMovie))
    .then((movie) => {
      if (String(movie.owner) !== owner) {
        throw new ForbiddenError(errors.forbiddenMovie);
      }
      return movie.deleteOne()
        .then(() => res.status(200).send({
          message: messages.deleteMovie,
        }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError(errors.strangeRequest));
      }
      return next(err);
    });
};

module.exports = { getAllMovies, createMovie, deleteMovie };
