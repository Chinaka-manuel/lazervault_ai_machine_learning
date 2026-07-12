import ApiError from '../utils/ApiError.js';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken, setAuthCookies } from '../utils/jwt.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    if (!accessToken) throw new ApiError(401, 'Authentication required');

    let payload;
    try {
      payload = verifyAccessToken(accessToken);
    } catch {
      throw new ApiError(401, 'Access token expired or invalid');
    }

    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) throw new ApiError(401, 'User not found or inactive');
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const refreshAccess = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new ApiError(401, 'Refresh token missing');

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub).select('+refreshTokens');
    if (!user || !user.refreshTokens?.includes(refreshToken)) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const accessToken = generateAccessToken({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    });
    setAuthCookies(res, { accessToken, refreshToken });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default { protect, refreshAccess };
