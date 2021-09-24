require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const limiter = require('./middlewares/limiter');
const errorHandler = require('./middlewares/errorHandler');
const { cors } = require('./middlewares/cors');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const mongoEnvConfig = require('./constants/config');

const app = express();

const { PORT } = process.env;

console.log(mongoEnvConfig);

mongoose.connect(mongoEnvConfig, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('Подключено к базе данных'));

app.use(cors);

app.use(helmet());

app.use(limiter);

app.use(cookieParser());

app.use(bodyParser.json());

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => { });
