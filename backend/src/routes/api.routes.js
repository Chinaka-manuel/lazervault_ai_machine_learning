import express from 'express';
import * as user from '../controllers/user.controller.js';
import * as product from '../controllers/product.controller.js';
import * as category from '../controllers/category.controller.js';
import * as review from '../controllers/review.controller.js';
import * as cart from '../controllers/cart.controller.js';
import * as wishlist from '../controllers/wishlist.controller.js';
import * as order from '../controllers/order.controller.js';
import * as payment from '../controllers/payment.controller.js';
import * as download from '../controllers/download.controller.js';
import * as admin from '../controllers/admin.controller.js';
import * as analytics from '../controllers/analytics.controller.js';
import * as upload from '../controllers/upload.controller.js';
import { validate } from '../middleware/validate.js';
import * as v from '../validators/index.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { upload as uploadMW } from '../middleware/upload.js';

const router = express.Router();

// Public product & category routes
router.get('/categories', category.listCategories);
router.get('/products/featured', product.featuredProducts);
router.get('/products', v.queryValidators, validate, product.listProducts);
router.get('/products/:id', product.getProduct);

// Categories management (admin/instructor)
router.post('/categories', protect, authorize('admin', 'instructor'), v.productValidator, validate, category.createCategory);
router.put('/categories/:id', protect, authorize('admin'), category.updateCategory);
router.delete('/categories/:id', protect, authorize('admin'), category.deleteCategory);

// Product CRUD
router.post('/products', protect, authorize('instructor', 'admin'), v.productValidator, validate, product.createProduct);
router.put('/products/:id', protect, v.updateProductValidator, validate, product.updateProduct);
router.delete('/products/:id', protect, product.deleteProduct);

// Reviews
router.get('/products/:id/reviews', review.listReviews);
router.post('/products/:id/reviews', protect, v.reviewValidator, validate, review.createReview);

// Cart
router.get('/cart', protect, cart.getCart);
router.post('/cart', protect, v.cartAddValidator, validate, cart.addToCart);
router.delete('/cart/:id', protect, cart.removeFromCart);
router.delete('/cart', protect, cart.clearCart);
router.post('/cart/coupon', protect, cart.applyCoupon);

// Wishlist
router.get('/wishlist', protect, wishlist.getWishlist);
router.post('/wishlist', protect, wishlist.toggleWishlist);
router.delete('/wishlist/:id', protect, wishlist.removeFromWishlist);

// Orders
router.post('/orders', protect, v.orderCreateValidator, validate, order.createOrder);
router.get('/orders', protect, order.myOrders);
router.get('/orders/:id', protect, order.getOrder);
router.delete('/orders/:id/items/:productId', protect, order.removeOrderItem);

// Payments
router.get('/payments/verify', protect, payment.verifyOrder);
router.post('/payments/webhook', payment.paymentWebhook);
router.post('/payments/:id/refund', protect, authorize('admin'), payment.refundOrder);

// Downloads
router.get('/downloads/access/:id', protect, download.checkAccess);
router.get('/downloads', protect, download.myDownloads);
router.get('/downloads/:id', protect, download.requestDownload);
router.delete('/downloads/:id', protect, download.deleteDownload);

// User profile
router.get('/profile', protect, user.getProfile);
router.patch('/profile', protect, user.updateProfile);

// Uploads
router.post('/upload', protect, uploadMW.single('file'), upload.uploadFile);

// Admin
router.get('/admin/stats', protect, authorize('admin'), admin.dashboardStats);
router.get('/admin/users', protect, authorize('admin'), admin.listUsers);
router.post('/admin/users', protect, authorize('admin'), v.createUserValidator, validate, admin.createUser);
router.put('/admin/users/:id', protect, authorize('admin'), v.updateUserValidator, validate, admin.updateUser);
router.delete('/admin/users/:id', protect, authorize('admin'), admin.deleteUser);
router.get('/admin/products', protect, authorize('admin'), admin.adminProducts);
router.get('/admin/orders', protect, authorize('admin'), admin.adminOrders);
router.get('/admin/coupons', protect, authorize('admin'), admin.listCoupons);
router.post('/admin/coupons', protect, authorize('admin'), admin.createCoupon);
router.post('/admin/announcements', protect, authorize('admin'), admin.sendAnnouncement);
router.get('/admin/reviews', protect, authorize('admin'), admin.pendingReviews);
router.put('/admin/reviews/:id', protect, authorize('admin'), admin.moderateReview);

// Analytics
router.get('/analytics/overview', protect, authorize('admin'), analytics.overview);
router.get('/analytics/instructor', protect, authorize('instructor', 'admin'), analytics.instructorAnalytics);

export default router;
