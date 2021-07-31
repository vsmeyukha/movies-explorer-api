const router = require('express').Router();
const { validateMovieInfo, validateMovieId } = require('../middlewares/celebrate');

const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getAllMovies);

router.post('/movies', validateMovieInfo, createMovie);

router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;
