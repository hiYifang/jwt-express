const appError = (httpStatus, errMessage, field = '', next) => {
  const error = new Error(errMessage);
  if (field !== '') { error.field = field };
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
}

module.exports = appError;