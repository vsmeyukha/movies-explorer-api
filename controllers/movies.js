const Movie = require('../models/movie');
const CastError = require('../errors/castError');
const NotYourMovieError = require('../errors/notYourMovieError');
const NotFoundError = require('../errors/notFoundError');
const SameEmailError = require('../errors/sameEmailError');

const getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;

  const movie = { ...req.body, owner };

  Movie.create(movie)
    .then((film) => res.status(200).send(film))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new CastError('Передана не вся информация о фильме'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new SameEmailError('Этот фильм уже сохранен'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;

  const { movieId } = req.params;

  Movie.findOne({ movieId })
    .orFail(new NotFoundError('Нет такого фильма'))
    .then((movie) => {
      if (String(movie.owner) !== owner) {
        throw new NotYourMovieError('НЕ покушайся на чужой фильм');
      }
      return movie.deleteOne()
        .then(() => res.status(200).send({
          message: 'Карточка успешно удалена',
        }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Вы прислали странный запрос'));
      }
      return next(err);
    });
};

module.exports = { getAllMovies, createMovie, deleteMovie };
