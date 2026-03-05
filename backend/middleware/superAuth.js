import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const superAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      res.clearCookie('token');
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (!user.isVerified) {
      res.clearCookie('token');
      return res.status(401).json({
        message: 'Please verify your account first'
      });
    }

    if (user.userType !== 'super-admin') {
      return res.status(403).json({
        message: 'Forbidden: Admin access required'
      });
    }

    req.user = user;

    next();

  } catch (error) {
    res.clearCookie('token');

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Session expired. Please login again.'
      });
    }

    return res.status(401).json({
      message: 'Invalid or corrupted token'
    });
  }
};

export default superAuth;