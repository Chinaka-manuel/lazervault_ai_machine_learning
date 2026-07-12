import express from 'express';
import * as auth from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import * as v from '../validators/index.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { protect, refreshAccess } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authLimiter, v.registerValidator, validate, auth.register);
router.post('/login', authLimiter, v.loginValidator, validate, auth.login);
router.post('/logout', protect, auth.logout);
router.get('/me', protect, auth.me);
router.post('/verify-email', v.verifyEmailValidator, validate, auth.verifyEmail);
router.post('/forgot-password', authLimiter, v.forgotPasswordValidator, validate, auth.forgotPassword);
router.post('/reset-password', authLimiter, v.resetPasswordValidator, validate, auth.resetPassword);
router.post('/social', v.registerValidator, validate, auth.socialAuth);
router.post('/refresh', refreshAccess, auth.refresh);

export default router;
