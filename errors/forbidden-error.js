const { constants } = require('http2');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_FORBIDDEN;
  }
}

module.exports = ForbiddenError;
