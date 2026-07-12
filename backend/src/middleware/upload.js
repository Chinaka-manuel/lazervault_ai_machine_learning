import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from '../utils/ApiError.js';

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImage = /jpeg|jpg|png|gif|webp/;
  const allowedDoc = /pdf|zip|docx?|pptx?/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (allowedImage.test(ext) || allowedDoc.test(ext)) return cb(null, true);
  cb(new ApiError(400, `Unsupported file type: ${ext}`));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export default upload;
