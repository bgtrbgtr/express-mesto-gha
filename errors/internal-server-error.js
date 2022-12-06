const { constants } = require('http2');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_SERVICE_UNAVAILABLE;
  }
}

module.exports = InternalServerError;
