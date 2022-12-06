const { constants } = require('http2');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictError;
