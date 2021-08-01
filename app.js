require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const errorHandler = require('./middlewares/errorHandler');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const notFoundPageRouter = require('./routes/notFoundPage');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateEmailAndPassword, validateRegistration } = require('./middlewares/celebrate');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/beatfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('Подключено к базе данных'));

app.use(helmet());

app.use(cookieParser());

app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signup', validateRegistration, createUser);
app.post('/signin', validateEmailAndPassword, login);

app.use(auth);

app.use('/', usersRouter);
app.use('/', moviesRouter);
app.use('/', notFoundPageRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => { });
