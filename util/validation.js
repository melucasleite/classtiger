const { validationResult } = require("express-validator/check");

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  next();
}

module.exports = checkValidation;
