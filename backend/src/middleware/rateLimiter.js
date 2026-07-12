import rateLimit from 'express-rate-limit';
import ApiError from '../utils/ApiError.js';

const handler = (req, res, next, options) => {
  next(new ApiError(429, options.message || 'Too many requests, please try again later.'));
};

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later.',
  handler,
});

export default { globalLimiter, authLimiter };
