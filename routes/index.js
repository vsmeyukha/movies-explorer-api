const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const notFoundPageRouter = require('./notFoundPage');

router.use('/users', usersRouter);

