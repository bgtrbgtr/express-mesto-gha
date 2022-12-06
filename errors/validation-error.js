const { constants } = require('http2');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = ValidationError;
