import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, avatar, email, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const updates = {};
  if (name) updates.name = name;
  if (bio !== undefined) updates.bio = bio;
  if (avatar !== undefined) updates.avatar = avatar;

  if (email && email.toLowerCase() !== user.email.toLowerCase()) {
    if (!currentPassword) throw new ApiError(400, 'Current password is required to change email');
    if (!(await user.comparePassword(currentPassword))) throw new ApiError(401, 'Current password is incorrect');
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing._id.toString() !== user._id.toString()) {
      throw new ApiError(409, 'That email is already in use');
    }
    updates.email = email.toLowerCase();
    updates.isEmailVerified = false;
  }

  if (newPassword) {
    if (!currentPassword) throw new ApiError(400, 'Current password is required to change password');
    if (!(await user.comparePassword(currentPassword))) throw new ApiError(401, 'Current password is incorrect');
    if (String(newPassword).length < 8) throw new ApiError(400, 'New password must be at least 8 characters');
    user.password = newPassword;
  }

  Object.assign(user, updates);
  await user.save();

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
