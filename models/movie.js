const mongoose = require('mongoose');
const validation = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validation.isURL(v);
      },
      message: 'Здесь должна быть действительная ссылка',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validation.isURL(v);
      },
      message: 'Здесь должна быть действительная ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validation.isURL(v);
      },
      message: 'Здесь должна быть действительная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    // ! вообще непонятно, что это за штука и как с ней быть
    // !что за тип данных должен быть, откула вообще брать
    required: true,
    unique: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
