// пакеты
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ошибочки
const CastError = require('../errors/castError');
const SameEmailError = require('../errors/sameEmailError');
const NotFoundUserError = require('../errors/notFoundUserError');
const NotFoundError = require('../errors/notFoundError');

// модель
const User = require('../models/user');

// const getAllUsers = (req, res, next) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch(next);
// };

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    return res.status(200).send(allUsers);
  } catch (err) {
    return next(err);
  }
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((encryptedPassword) => {
      User.create({
        email,
        password: encryptedPassword,
        name,
      })
        .then((user) => {
          res.status(200).send({
            email: user.email,
            name: user.name,
          });
        })
        .catch((err) => {
          if (!email || !password) {
            return next(new CastError('Вы не заполнили обязательные поля'));
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            return next(new SameEmailError('Пользователь с такой почтой уже зарегистрирован'));
          }
          return next(err);
        });
    });
};

const login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET = 'very-secret-key' } = process.env;

  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundUserError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotFoundUserError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-key',
            { expiresIn: '7d' },
          );

          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
            .status(201).send({
              message: 'Аутентификация прошла успешно',
            });
        });
    })
    .catch(next);
};

// получаем инфу о текущем пользователе
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Такого пользователя нет в базе'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Вы прислали странный запрос'));
      }
      return next(err);
    });
};

// обновляем инфу о текущем пользователе
const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  const { _id = '' } = req.user;

  User.findByIdAndUpdate(
    _id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Нет такого пользователя'))
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new CastError('Вы не заполнили обязательные поля'));
      }
      return next(err);
    });
};

const signOut = (req, res, next) => {
  const token = '';

  res.cookie('jwt', token, {
    httpOnly: true,
  })
    .status(201).send({
      message: 'Кука удалена',
    });

  next();
};

module.exports = {
  getAllUsers,
  createUser,
  login,
  getCurrentUser,
  updateUser,
  signOut,
};