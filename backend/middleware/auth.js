import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: No token provided'
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists in DB
    const user = await User.findById(decoded.id)
      .select('-password -otp -collegeOtp');

    if (!user) {
      res.clearCookie('token');
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Optional: block unverified users
    if (!user.isVerified) {
      res.clearCookie('token');
      return res.status(401).json({
        message: 'Please verify your account first'
      });
    }

    // Attach full user object to request
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

export default auth;