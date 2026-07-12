import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

const TAX_RATE = 0.0;

const computeTotals = async (cart) => {
  let subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  let discount = 0;
  let coupon = null;
  if (cart.couponCode) {
    coupon = await Coupon.findOne({ code: cart.couponCode.toUpperCase(), isActive: true });
    if (coupon && subtotal >= (coupon.minOrderAmount || 0)) {
      discount =
        coupon.discountType === 'percentage'
          ? (subtotal * coupon.discountValue) / 100
          : Math.min(coupon.discountValue, subtotal);
    }
  }
  const tax = subtotal * TAX_RATE;
  const total = Math.max(0, subtotal - discount + tax);
  return { subtotal, discount, tax, total };
};

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title thumbnail price type');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const totals = await computeTotals(cart);
  res.json({ success: true, cart, ...totals });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isPublished) throw new ApiError(404, 'Product not available');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }
  await cart.save();
  const totals = await computeTotals(cart);
  res.json({ success: true, cart, ...totals });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.id);
  await cart.save();
  const totals = await computeTotals(cart);
  res.json({ success: true, cart, ...totals });
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: '' });
  res.json({ success: true, message: 'Cart cleared' });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new ApiError(400, 'Invalid coupon');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new ApiError(400, 'Coupon expired');
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new ApiError(400, 'Coupon usage limit reached');
  cart.couponCode = coupon.code;
  await cart.save();
  const totals = await computeTotals(cart);
  res.json({ success: true, cart, coupon, ...totals });
});

export default { getCart, addToCart, removeFromCart, clearCart, applyCoupon };
