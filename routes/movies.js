const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { validateMovieInfo, validateMovieId } = require('../middlewares/celebrate');
const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', asyncHandler(getAllMovies));

router.post('/movies', validateMovieInfo, asyncHandler(createMovie));

router.delete('/movies/:movieId', validateMovieId, asyncHandler(deleteMovie));

module.exports = router;
