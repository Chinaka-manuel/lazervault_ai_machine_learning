import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const overview = asyncHandler(async (req, res) => {
  const range = Number(req.query.days) || 30;
  const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000);

  const [revenueAgg, ordersByDay, topProducts, activeUsers, conversion] = await Promise.all([
    Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Product.find().sort('-views').limit(5).select('title views rating downloads type'),
    User.countDocuments({ lastLogin: { $gte: since } }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: 1 }, paid: { $sum: { $cond: ['$status', 1, 0] } } } }]),
  ]);

  const conv = conversion[0];
  res.json({
    success: true,
    revenueByDay: revenueAgg,
    ordersByDay,
    topProducts,
    activeUsers,
    conversionRate: conv ? (conv.paid / conv.total) * 100 : 0,
    range,
  });
});

export const instructorAnalytics = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;
  const [products, revenueAgg, students] = await Promise.all([
    Product.find({ instructor: instructorId }).select('title views rating downloads price'),
    Order.aggregate([
      { $match: { status: 'paid' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'prod',
        },
      },
      { $match: { 'prod.instructor': instructorId } },
      { $group: { _id: null, revenue: { $sum: '$items.price' } } },
    ]),
    Order.aggregate([
      { $match: { status: 'paid' } },
      { $unwind: '$items' },
      {
        $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'prod' },
      },
      { $match: { 'prod.instructor': instructorId } },
      { $group: { _id: null, students: { $addToSet: '$user' } } },
    ]),
  ]);

  res.json({
    success: true,
    products,
    revenue: revenueAgg[0]?.revenue || 0,
    studentCount: students[0]?.students?.length || 0,
  });
});

export default { overview, instructorAnalytics };
