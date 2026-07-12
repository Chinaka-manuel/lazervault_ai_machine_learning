import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import Review from '../models/Review.js';
import { paginate } from '../utils/helpers.js';

export const dashboardStats = asyncHandler(async (req, res) => {
  const [users, instructors, products, orders, revenueAgg, pendingReviews] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' }),
    Product.countDocuments({}),
    Order.countDocuments({}),
    Order.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Review.countDocuments({ isApproved: false }),
  ]);
  res.json({
    success: true,
    stats: {
      students: users,
      instructors,
      products,
      orders,
      revenue: revenueAgg[0]?.total || 0,
      pendingReviews,
    },
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query.page, 50);
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const [users, total] = await Promise.all([
    User.find(filter).select('-password -refreshTokens').skip(skip).limit(limit).sort('-createdAt'),
    User.countDocuments(filter),
  ]);
  res.json({ success: true, page, limit, total, users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role, isActive, isApprovedInstructor } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role, isActive, isApprovedInstructor }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  if (isApprovedInstructor && role === 'instructor') {
    const tpl = emailTemplates.instructorApproval(user.name);
    const { sendEmail } = await import('../services/email.service.js');
    await sendEmail({ to: user.email, ...tpl });
  }
  res.json({ success: true, user: user.toSafeJSON() });
});

export const adminProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query.page, 50);
  const [products, total] = await Promise.all([
    Product.find().populate('instructor', 'name').skip(skip).limit(limit).sort('-createdAt'),
    Product.countDocuments(),
  ]);
  res.json({ success: true, page, limit, total, products });
});

export const adminOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query.page, 50);
  const [orders, total] = await Promise.all([
    Order.find().populate('user', 'name email').skip(skip).limit(limit).sort('-createdAt'),
    Order.countDocuments(),
  ]);
  res.json({ success: true, page, limit, total, orders });
});

export const listCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ success: true, coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

export const sendAnnouncement = asyncHandler(async (req, res) => {
  const { title, message } = req.body;
  const users = await User.find({ isActive: true }).select('_id');
  const docs = users.map((u) => ({ user: u._id, type: 'announcement', title, message }));
  await Notification.insertMany(docs);
  res.json({ success: true, delivered: docs.length });
});

export const pendingReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ isApproved: false }).populate('user', 'name').populate('product', 'title');
  res.json({ success: true, reviews });
});

export const moderateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
  if (!review) throw new ApiError(404, 'Review not found');
  res.json({ success: true, review });
});

export default {
  dashboardStats,
  listUsers,
  updateUserRole,
  adminProducts,
  adminOrders,
  listCoupons,
  createCoupon,
  sendAnnouncement,
  pendingReviews,
  moderateReview,
};
