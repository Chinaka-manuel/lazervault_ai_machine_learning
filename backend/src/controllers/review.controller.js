import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const recomputeRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length) {
    await Product.findByIdAndUpdate(productId, { rating: stats[0].avg, ratingCount: stats[0].count });
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 0, ratingCount: 0 });
  }
};

export const listReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id, isApproved: true })
    .populate('user', 'name avatar')
    .sort('-createdAt');
  res.json({ success: true, reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const purchased = await Order.findOne({ user: req.user._id, status: 'paid', 'items.product': productId });
  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) throw new ApiError(409, 'You have already reviewed this product');

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    comment,
    verifiedPurchase: Boolean(purchased),
  });
  await recomputeRating(productId);
  res.status(201).json({ success: true, review });
});

export const respondToReview = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  review.instructorReply = reply;
  await review.save();
  res.json({ success: true, review });
});

export default { listReviews, createReview, respondToReview };
