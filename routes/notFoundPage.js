const router = require('express').Router();
const NotFoundError = require('../errors/notFoundError');
const errors = require('../constants/errors');

router.all('*', (req, res, next) => next(new NotFoundError(errors.notFoundPage)));

module.exports = router;
