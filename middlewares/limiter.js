const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60000,
  max: 60,
});

module.exports = limiter;
