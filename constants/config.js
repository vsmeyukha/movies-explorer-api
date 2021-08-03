require('dotenv').config();
const devMongodbURI = require('./config.dev');
const prodMongodbURI = require('./config.prod');

let mongoEnvConfig;

if (process.env.NODE_ENV === 'production') {
  mongoEnvConfig = prodMongodbURI;
} else {
  mongoEnvConfig = devMongodbURI;
}

module.exports = mongoEnvConfig;
