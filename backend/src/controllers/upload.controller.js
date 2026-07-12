import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  const folder = req.body.folder || 'lazervault';
  const result = await uploadToCloudinary(req.file.path, folder);
  res.status(201).json({
    success: true,
    file: {
      url: result.secure_url,
      publicId: result.public_id,
      originalName: req.file.originalname,
      local: Boolean(result.local),
    },
  });
});

export default { uploadFile };
