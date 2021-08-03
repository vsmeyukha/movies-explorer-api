const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorizationError');

const auth = (req, res, next) => {
  const { JWT_SECRET = 'very-secret-key' } = process.env;
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AuthorizationError('Необходимо авторизоваться'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthorizationError('Неверный токен'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
