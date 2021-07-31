const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const validator = require('validator');

const validateUrl = (link) => {
  const result = validator.isURL(link);
  if (result) {
    return link;
  } throw new Error('URL validation err');
};

const validateUserId = (id, helpers) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return id;
  } return helpers.message('Неправильный ID');
};

const userInfo = {
  name: Joi.string().min(2).max(30),
  email: Joi.string().required().email(),
};

const EmailAndPassword = {
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
};

const validateUserInfo = celebrate({
  body: Joi.object().keys(userInfo),
});

const validateEmailAndPassword = celebrate({
  body: Joi.object().keys(EmailAndPassword),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({ ...userInfo, ...EmailAndPassword }),
});

const validateMovieInfo = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl),
    trailer: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
    owner: Joi.required().custom(validateUserId),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    MovieId: Joi.number().required(),
  }),
});

module.exports = {
  validateUserInfo,
  validateEmailAndPassword,
  validateRegistration,
  validateMovieInfo,
  validateMovieId,
};