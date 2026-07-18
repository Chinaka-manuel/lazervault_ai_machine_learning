import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';
import { generateOrderReference, paginate } from '../utils/helpers.js';
import { initializePayment } from '../services/payment.service.js';
import { sendEmail } from '../services/email.service.js';
import emailTemplates from '../services/emailTemplates.js';
import env from '../config/env.js';

const buildOrderFromCart = async (user, cart, couponCode) => {
  if (!cart.items.length) throw new ApiError(400, 'Cart is empty');
  const items = cart.items.map((i) => ({
    product: i.product,
    title: i.product.title,
    type: i.product.type,
    price: i.price,
    quantity: i.quantity || 1,
    thumbnail: i.product.thumbnail,
  }));
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  let discount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon && subtotal >= (coupon.minOrderAmount || 0)) {
      discount =
        coupon.discountType === 'percentage'
          ? (subtotal * coupon.discountValue) / 100
          : Math.min(coupon.discountValue, subtotal);
    }
  }
  const tax = 0;
  const total = Math.max(0, subtotal - discount + tax);
  return { items, subtotal, discount, tax, total, coupon };
};

export const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title type price thumbnail');
  if (!cart || !cart.items.length) throw new ApiError(400, 'Cart is empty');

  const { items, subtotal, discount, tax, total, coupon } = await buildOrderFromCart(req.user, cart, req.body.couponCode);
  const reference = generateOrderReference();
  const provider = req.body.provider || 'mock';

  const order = await Order.create({
    user: req.user._id,
    items,
    reference,
    subtotal,
    discount,
    tax,
    total,
    status: 'pending',
    paymentProvider: provider,
    couponCode: coupon ? coupon.code : '',
  });

  const callbackUrl = `${env.FRONTEND_URL}/checkout/verify?reference=${reference}`;
  const payment = await initializePayment(provider, {
    email: req.user.email,
    amount: total,
    reference,
    callbackUrl,
    metadata: { orderId: order._id.toString(), userId: req.user._id.toString() },
  });

  res.status(201).json({ success: true, order, authorizationUrl: payment.authorizationUrl, provider });
});

export const myOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query.page, req.query.limit);
  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id }).sort('-createdAt').skip(skip).limit(limit),
    Order.countDocuments({ user: req.user._id }),
  ]);
  res.json({ success: true, page, limit, total, orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, order });
});

export const confirmPurchase = async (order) => {
  order.status = 'paid';
  order.paidAt = new Date();
  await order.save();

  const user = await (await import('../models/User.js')).default.findById(order.user);
  const ProductModel = (await import('../models/Product.js')).default;

  for (const item of order.items) {
    if (item.type === 'course') {
      if (!user.enrolledCourses.includes(item.product)) user.enrolledCourses.push(item.product);
    }
    await ProductModel.findByIdAndUpdate(item.product, { $inc: { downloads: 1 } });
  }
  await user.save();

  if (order.couponCode) {
    await Coupon.updateOne({ code: order.couponCode }, { $inc: { usedCount: 1 } });
  }

  const tpl = emailTemplates.purchaseConfirmation(
    user.name,
    order.reference,
    order.items.map((i) => ({ title: i.title, price: `$${i.price}` })),
    `$${order.total}`,
  );
  await sendEmail({ to: user.email, ...tpl });
};

export const removeOrderItem = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.status !== 'paid') throw new ApiError(400, 'Only purchased items can be removed');

  const productId = req.params.productId;
  const before = order.items.length;
  order.items = order.items.filter((i) => i.product?.toString() !== productId);
  if (order.items.length === before) throw new ApiError(404, 'Product not found in this order');

  const subtotal = order.items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
  order.subtotal = subtotal;
  order.total = Math.max(0, subtotal - (order.discount || 0));
  await order.save();

  res.json({ success: true, order });
});

export default { createOrder, myOrders, getOrder, removeOrderItem, confirmPurchase };
