import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const generateAccessToken = (payload) =>
  jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRY });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRY });

export const verifyAccessToken = (token) => jwt.verify(token, env.ACCESS_TOKEN_SECRET);

export const verifyRefreshToken = (token) => jwt.verify(token, env.REFRESH_TOKEN_SECRET);

export const generateAuthTokens = (user) => {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    email: user.email,
  };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken({ sub: user._id.toString() }),
  };
};

export const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateAuthTokens,
  setAuthCookies,
  clearAuthCookies,
};
