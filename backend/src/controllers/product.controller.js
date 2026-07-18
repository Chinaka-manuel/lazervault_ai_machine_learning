import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Download from '../models/Download.js';
import User from '../models/User.js';
import { paginate } from '../utils/helpers.js';

const buildFilter = (query) => {
  const filter = { isPublished: true };
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.search) filter.$text = { $search: query.search };
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.free === 'true') filter.isFree = true;
  return filter;
};

const buildSort = (sort) => {
  switch (sort) {
    case 'newest':
      return { publishedAt: -1 };
    case 'popular':
      return { views: -1 };
    case 'rating':
      return { rating: -1 };
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    default:
      return { publishedAt: -1 };
  }
};

export const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query.page, req.query.limit);
  const filter = buildFilter(req.query);
  const sort = buildSort(req.query.sort);
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).populate('category', 'name slug').populate('instructor', 'name avatar'),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, page, limit, total, count: products.length, products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  const query = isObjectId
    ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
    : { slug: req.params.id };

  const product = await Product.findOne(query)
    .populate('category', 'name slug')
    .populate('instructor', 'name avatar bio');

  if (!product) throw new ApiError(404, 'Product not found');
  product.views += 1;
  await product.save();

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isPublished: true,
  })
    .limit(4)
    .populate('instructor', 'name');

  res.json({ success: true, product, related });
});

export const createProduct = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (req.user.role === 'instructor') {
    body.instructor = req.user._id;
    body.isPublished = true;
  } else if (req.user.role === 'admin' && !body.instructor) {
    body.instructor = req.user._id;
  }
  if (body.isFree || Number(body.price) === 0) body.isFree = true;

  const product = await Product.create(body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  if (req.user.role !== 'admin' && product.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this product');
  }
  Object.assign(product, req.body);
  await product.save();
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const isId = mongoose.Types.ObjectId.isValid(req.params.id);
  const product = isId
    ? await Product.findById(req.params.id)
    : await Product.findOne({ slug: req.params.id });
  if (!product) throw new ApiError(404, 'Product not found');
  if (req.user.role !== 'admin' && product.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to delete this product');
  }

  await Promise.all([
    Cart.updateMany({ 'items.product': product._id }, { $pull: { items: { product: product._id } } }),
    Wishlist.updateMany({ products: product._id }, { $pull: { products: product._id } }),
    Order.updateMany({ 'items.product': product._id }, { $pull: { items: { product: product._id } } }),
    Review.deleteMany({ product: product._id }),
    Download.deleteMany({ product: product._id }),
    User.updateMany({ enrolledCourses: product._id }, { $pull: { enrolledCourses: product._id } }),
  ]);

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

export const featuredProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isPublished: true })
    .sort({ rating: -1, views: -1 })
    .limit(8)
    .populate('category', 'name')
    .populate('instructor', 'name');
  res.json({ success: true, products });
});

export const getCategoriesWithCounts = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });
  const counts = await Product.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));
  const result = categories.map((c) => ({ ...c.toObject(), productCount: map[c._id.toString()] || 0 }));
  res.json({ success: true, categories: result });
});

export default {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  featuredProducts,
  getCategoriesWithCounts,
};
