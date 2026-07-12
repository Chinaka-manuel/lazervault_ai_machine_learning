import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'title thumbnail price type rating');
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  res.json({ success: true, wishlist });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

  const idx = wishlist.products.findIndex((p) => p.toString() === productId);
  let added = false;
  if (idx >= 0) {
    wishlist.products.splice(idx, 1);
  } else {
    wishlist.products.push(productId);
    added = true;
  }
  await wishlist.save();
  res.json({ success: true, added, wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found');
  wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.id);
  await wishlist.save();
  res.json({ success: true, wishlist });
});

export default { getWishlist, toggleWishlist, removeFromWishlist };
