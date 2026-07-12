import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import { generateAuthTokens, setAuthCookies, clearAuthCookies } from '../utils/jwt.js';
import { sendEmail } from '../services/email.service.js';
import emailTemplates from '../services/emailTemplates.js';

const setTokens = (res, user) => {
  const tokens = generateAuthTokens(user);
  // Persist refresh token (rotation-ready)
  user.refreshTokens = [...(user.refreshTokens || []), tokens.refreshToken].slice(-5);
  user.lastLogin = new Date();
  user.save();
  setAuthCookies(res, tokens);
  return tokens;
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ name, email, password, role });
  const verificationToken = crypto.randomInt(100000, 999999).toString();
  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  const tpl = emailTemplates.verification(name, verificationToken);
  await sendEmail({ to: email, ...tpl });

  const tokens = setTokens(res, user);
  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    user: user.toSafeJSON(),
    accessToken: tokens.accessToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }
  if (!user.isActive) throw new ApiError(403, 'Account is disabled');

  const tokens = setTokens(res, user);
  res.json({ success: true, user: user.toSafeJSON(), accessToken: tokens.accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (req.user && refreshToken) {
    req.user.refreshTokens = (req.user.refreshTokens || []).filter((t) => t !== refreshToken);
    await req.user.save();
  }
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const user = await User.findOne({ emailVerificationToken: token }).select('+emailVerificationToken');
  if (!user || user.emailVerificationExpiry < Date.now()) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();
  res.json({ success: true, message: 'Email verified' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordResetToken');
  if (!user) {
    return res.json({ success: true, message: 'If the email exists, a reset link was sent.' });
  }
  const token = crypto.randomInt(100000, 999999).toString();
  user.passwordResetToken = token;
  user.passwordResetExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();
  const tpl = emailTemplates.passwordReset(user.name, token);
  await sendEmail({ to: user.email, ...tpl });
  res.json({ success: true, message: 'If the email exists, a reset link was sent.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({ passwordResetToken: token }).select('+passwordResetToken');
  if (!user || user.passwordResetExpiry < Date.now()) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  user.refreshTokens = [];
  await user.save();
  clearAuthCookies(res);
  res.json({ success: true, message: 'Password reset successful. Please login.' });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new ApiError(401, 'No refresh token');
  const { verifyRefreshToken, generateAccessToken } = await import('../utils/jwt.js');
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.sub).select('+refreshTokens');
  if (!user || !user.refreshTokens.includes(refreshToken)) {
    throw new ApiError(401, 'Invalid refresh token');
  }
  const accessToken = generateAccessToken({ sub: user._id.toString(), role: user.role, email: user.email });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.json({ success: true, accessToken });
});

export const socialAuth = asyncHandler(async (req, res) => {
  const { provider, email, name, providerId, avatar } = req.body;
  if (!['google', 'github'].includes(provider)) throw new ApiError(400, 'Unsupported provider');
  let user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    user = await User.create({
      name,
      email,
      provider,
      [provider === 'google' ? 'googleId' : 'githubId']: providerId,
      avatar,
      isEmailVerified: true,
    });
    const tpl = emailTemplates.welcome(name);
    await sendEmail({ to: email, ...tpl });
  }
  const tokens = setTokens(res, user);
  res.json({ success: true, user: user.toSafeJSON(), accessToken: tokens.accessToken });
});

export default {
  register,
  login,
  logout,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refresh,
  socialAuth,
};
