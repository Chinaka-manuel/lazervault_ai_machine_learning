import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, avatar } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (bio !== undefined) updates.bio = bio;
  if (avatar !== undefined) updates.avatar = avatar;

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user: user.toSafeJSON() });
});

export const enrollCourse = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = req.user;
  if (!user.enrolledCourses.includes(productId)) {
    user.enrolledCourses.push(productId);
    await user.save();
  }
  res.json({ success: true, enrolledCourses: user.enrolledCourses });
});

export default { getProfile, updateProfile, enrollCourse };
