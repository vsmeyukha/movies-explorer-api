const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { validateMovieInfo, validateMovieId } = require('../middlewares/celebrate');
const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', asyncHandler(getAllMovies));

router.post('/', validateMovieInfo, asyncHandler(createMovie));

router.delete('/:movieId', validateMovieId, asyncHandler(deleteMovie));

module.exports = router;
