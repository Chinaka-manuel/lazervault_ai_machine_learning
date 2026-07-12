import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 422 : 500);
    error = new ApiError(statusCode, error.message || 'Internal Server Error', false, err.stack);
  }

  if (error.statusCode >= 500) {
    logger.error('Server error', { message: error.message, stack: error.stack, path: req.originalUrl });
  } else {
    logger.warn('Client error', { status: error.statusCode, message: error.message, path: req.originalUrl });
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && error.stack ? { stack: error.stack } : {}),
  });
};

export default { notFound, errorHandler };
