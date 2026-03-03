import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const isCollegeEmail = (email) => {
  return email.endsWith('.ac.in') || email.endsWith('.edu.in');
};

const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({
      $or: [{ email: email }, { collegeEmail: email }]
    });

    const otp = generateOTP();

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      } else {
        existingUser.otp = otp;
        existingUser.name = name;
        existingUser.password = await bcrypt.hash(password, 10);
        await existingUser.save();
        await sendEmail(user.email, 'Email Verify', `Your OTP is ${otp}`);

        // console.log(otp)
        return res.status(200).json({ message: 'Unverified account found. New OTP sent to email' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let collegeEmailVerified = false;
    let collegeEmail = '';

    if (isCollegeEmail(email)) {
      collegeEmail = email;
      collegeEmailVerified = true;
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      collegeEmail,
      collegeEmailVerified
    });
    await user.save();

    await sendEmail(user.email, 'College Email Verify', `Your OTP is ${otp}`);

    // console.log(otp)

    res.status(201).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 86400000, sameSite: 'lax' });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: email }, { collegeEmail: email }]
    });

    if (!user || !user.isVerified) return res.status(400).json({ message: 'Invalid credentials or unverified' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 86400000, sameSite: 'lax' });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -otp -collegeOtp');
    if (!user) return res.status(401).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

router.post('/send-college-otp', async (req, res) => {
  try {
    const { userId, collegeEmail } = req.body;
    if (!isCollegeEmail(collegeEmail)) {
      return res.status(400).json({ message: 'Must be a valid college domain (.ac.in, .edu.in)' });
    }

    const otp = generateOTP();
    await User.findByIdAndUpdate(userId, { collegeEmail, collegeOtp: otp, collegeEmailVerified: false });
    await sendEmail(user.email, 'College Email Verify', `Your OTP is ${otp}`);
    // console.log(otp)
    res.status(200).json({ message: 'College OTP sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-college-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user || user.collegeOtp !== otp) return res.status(400).json({ message: 'Invalid College OTP' });

    user.collegeEmailVerified = true;
    user.collegeOtp = undefined;
    await user.save();
    res.status(200).json({ message: 'College email verified', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update-profile', async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      $or: [{ email: email }, { collegeEmail: email }]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    await sendEmail(user.email, 'Password Reset', `Your OTP for password reset is ${otp}`);
    res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset-forgot-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      $or: [{ email: email }, { collegeEmail: email }]
    });

    if (!user || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });


    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: 'Password does not meet security requirements.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;