import { body, param, query } from 'express-validator';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['student', 'instructor']).withMessage('Invalid role'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
];

export const forgotPasswordValidator = [body('email').isEmail().withMessage('Valid email required').normalizeEmail()];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Token required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const verifyEmailValidator = [body('token').notEmpty().withMessage('Token required')];

export const productValidator = [
  body('type').isIn(['course', 'video', 'snapshot']).withMessage('Invalid product type'),
  body('title').trim().notEmpty().withMessage('Title required').isLength({ max: 160 }),
  body('description').trim().notEmpty().withMessage('Description required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isMongoId().withMessage('Valid category required'),
  body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  body('language').optional().isString(),
  body('tags').optional().isArray(),
];

export const updateProductValidator = [
  body('title').optional().trim().isLength({ max: 160 }),
  body('price').optional().isFloat({ min: 0 }),
  body('description').optional().trim(),
];

export const cartAddValidator = [
  body('productId').isMongoId().withMessage('Valid productId required'),
  body('quantity').optional().isInt({ min: 1 }),
];

export const orderCreateValidator = [
  body('provider').optional().isIn(['paystack', 'stripe', 'mock']),
  body('couponCode').optional().isString(),
];

export const reviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating 1-5 required'),
  body('comment').optional().isString().isLength({ max: 1000 }),
  param('id').isMongoId().withMessage('Valid product id required'),
];

export const idParamValidator = [param('id').isMongoId().withMessage('Valid id required')];

export const queryValidators = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('sort').optional().isString(),
  query('search').optional().isString(),
  query('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('type').optional().isIn(['course', 'video', 'snapshot']),
];

export const createUserValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['student', 'instructor', 'admin']),
];

export const updateUserValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('role').optional().isIn(['student', 'instructor', 'admin']),
  body('isActive').optional().isBoolean(),
  body('isApprovedInstructor').optional().isBoolean(),
];

export default {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
  productValidator,
  updateProductValidator,
  cartAddValidator,
  orderCreateValidator,
  reviewValidator,
  idParamValidator,
  queryValidators,
  createUserValidator,
  updateUserValidator,
};
