const { constants } = require('http2');

module.exports = (err, req, res, next) => {
  const { statusCode = constants.HTTP_STATUS_SERVICE_UNAVAILABLE, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка сервера.'
        : message,
    });
  next();
};
