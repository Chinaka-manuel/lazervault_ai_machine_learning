import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Category from '../models/Category.js';

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name');
  res.json({ success: true, count: categories.length, categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, parent } = req.body;
  const existing = await Category.findOne({ name });
  if (existing) throw new ApiError(409, 'Category already exists');
  const category = await Category.create({ name, description, icon, parent });
  res.status(201).json({ success: true, category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, message: 'Category deleted' });
});

export default { listCategories, createCategory, updateCategory, deleteCategory };
