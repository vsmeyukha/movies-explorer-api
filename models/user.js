const mongoose = require('mongoose');
const validation = require('validator');
const errors = require('../constants/errors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validation.isEmail(v);
      },
      message: errors.invalidEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
