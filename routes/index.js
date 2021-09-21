const asyncHandler = require('express-async-handler');
const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { validateEmailAndPassword, validateRegistration } = require('../middlewares/celebrate');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const notFoundPageRouter = require('./notFoundPage');

router.use('/signup', validateRegistration, asyncHandler(createUser));

router.use('/signin', validateEmailAndPassword, asyncHandler(login));

router.use('/users', auth, usersRouter);

router.use('/movies', auth, moviesRouter);

router.use('/', auth, notFoundPageRouter);

module.exports = router;
