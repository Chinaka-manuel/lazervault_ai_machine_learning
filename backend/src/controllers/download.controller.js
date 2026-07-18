import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Download from '../models/Download.js';

const CLOUDINARY_HOST = 'res.cloudinary.com';

const buildMediaMeta = (product) => {
  const url = product.resourceUrl || product.previewUrl || '';
  const isCloudinary = url.includes(CLOUDINARY_HOST);
  const isYoutube = /youtube\.com|youtu\.be/.test(url);
  const isVideo = product.type === 'video' || /\.(mp4|webm|ogg|mov)$/i.test(url) || isCloudinary;

  let mediaType = 'file';
  let embedUrl = '';

  if (isYoutube) {
    mediaType = 'video';
    const id = url.includes('youtu.be') ? url.split('/').pop() : new URLSearchParams(url.split('?')[1] || '').get('v');
    embedUrl = id ? `https://www.youtube.com/embed/${id}` : '';
  } else if (isCloudinary && /video\/upload/.test(url)) {
    mediaType = 'video';
    embedUrl = url;
  } else if (/\.(mp4|webm|ogg|mov)$/i.test(url)) {
    mediaType = 'video';
    embedUrl = url;
  } else if (isCloudinary) {
    mediaType = 'image';
    embedUrl = url;
  }

  return { mediaType, embedUrl, downloadUrl: url };
};

const findProduct = (id) =>
  mongoose.Types.ObjectId.isValid(id)
    ? Product.findById(id)
    : Product.findOne({ slug: id });

export const requestDownload = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const purchased = await Order.findOne({
    user: req.user._id,
    status: 'paid',
    'items.product': product._id,
  });
  if (!purchased && !product.isFree) {
    throw new ApiError(403, 'You must purchase this product to download it');
  }

  const existing = await Download.findOne({ user: req.user._id, product: product._id });
  if (!existing) {
    await Download.create({ user: req.user._id, product: product._id, order: purchased?._id, ip: req.ip });
  }
  const meta = buildMediaMeta(product);
  res.json({ success: true, ...meta, title: product.title, type: product.type });
});

export const checkAccess = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id).select('isFree');
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.isFree) return res.json({ success: true, owned: true, isFree: true });

  const purchased = await Order.findOne({
    user: req.user._id,
    status: 'paid',
    'items.product': product._id,
  });
  res.json({ success: true, owned: Boolean(purchased), isFree: false });
});

export const deleteDownload = asyncHandler(async (req, res) => {
  const record = await Download.findOne({ _id: req.params.id, user: req.user._id });
  if (!record) throw new ApiError(404, 'Download record not found');
  await record.deleteOne();
  res.json({ success: true, message: 'Download removed' });
});

export const myDownloads = asyncHandler(async (req, res) => {
  const downloads = await Download.find({ user: req.user._id })
    .populate('product', 'title thumbnail type resourceUrl previewUrl')
    .sort('-createdAt')
    .limit(50);
  const mapped = downloads.map((d) => ({
    _id: d._id,
    createdAt: d.createdAt,
    product: d.product,
    downloadUrl: d.product ? d.product.resourceUrl || d.product.previewUrl || '' : '',
  }));
  res.json({ success: true, downloads: mapped });
});

export default { checkAccess, requestDownload, myDownloads, deleteDownload };
