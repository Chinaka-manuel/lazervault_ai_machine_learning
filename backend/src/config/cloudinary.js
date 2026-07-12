import { v2 as cloudinary } from 'cloudinary';
import env from './env.js';

const configured = Boolean(env.CLOUDINARY.cloudName && env.CLOUDINARY.apiKey && env.CLOUDINARY.apiSecret);

if (configured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY.cloudName,
    api_key: env.CLOUDINARY.apiKey,
    api_secret: env.CLOUDINARY.apiSecret,
    secure: true,
  });
}

export const cloudinaryEnabled = configured;

export const uploadToCloudinary = async (filePath, folder = 'lazervault') => {
  if (!configured) {
    // Local fallback when Cloudinary is not configured (development).
    return { public_id: `local_${Date.now()}`, secure_url: filePath, local: true };
  }
  const result = await cloudinary.uploader.upload(filePath, { folder, resource_type: 'auto' });
  return result;
};

export const deleteFromCloudinary = async (publicId) => {
  if (!configured || !publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
