import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel.js';

const authMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if ((decoded.tokenVersion ?? -1) !== user.tokenVersion) {
        return res.status(401).json({ message: 'Token has been invalidated. Please log in again.' });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: 'User account is deactivated' });
      }

      user.password = undefined;
      user.resetOTP = undefined;
      user.resetOTPExpires = undefined;
      user.resetOtp = undefined;
      user.resetOtpExpiry = undefined;
      req.user = user;

      const userRole = user.userType;

      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

const isUser = authMiddleware('User', 'Admin', 'SuperAdmin');
const isAdmin = authMiddleware('Admin', 'SuperAdmin');
const isSuperAdmin = authMiddleware('SuperAdmin');

export  {
  authMiddleware,
  isUser,
  isAdmin,
  isSuperAdmin
};