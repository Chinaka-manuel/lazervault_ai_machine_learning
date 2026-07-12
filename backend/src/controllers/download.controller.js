import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Download from '../models/Download.js';

export const requestDownload = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const purchased = await Order.findOne({
    user: req.user._id,
    status: 'paid',
    'items.product': product._id,
  });
  if (!purchased && !product.isFree) {
    throw new ApiError(403, 'You must purchase this product to download it');
  }

  await Download.create({ user: req.user._id, product: product._id, order: purchased?._id, ip: req.ip });
  res.json({ success: true, downloadUrl: product.resourceUrl || product.previewUrl });
});

export const myDownloads = asyncHandler(async (req, res) => {
  const downloads = await Download.find({ user: req.user._id })
    .populate('product', 'title thumbnail type')
    .sort('-createdAt')
    .limit(50);
  res.json({ success: true, downloads });
});

export default { requestDownload, myDownloads };
