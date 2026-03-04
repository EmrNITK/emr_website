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

// --- EMR EMAIL TEMPLATE GENERATOR ---
const generateEMREmailTemplate = (title, name, message, otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 0 40px rgba(0,0,0,0.8);">
    
    <div style="background-color: #0a0a0a; padding: 30px; text-align: center; border-b: 1px solid #222222;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
        <span style="color: #51b749;">EM</span><span style="color: #ffffff;">R</span>
      </h1>
      <p style="margin: 5px 0 0 0; color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">NIT Kurukshetra</p>
    </div>

    <div style="padding: 40px 30px;">
      <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #ffffff; font-weight: 600;">
        ${title}
      </h2>
      
      <p style="margin: 0 0 15px 0; font-size: 15px; color: #cccccc; line-height: 1.6;">
        Hello <strong style="color: #ffffff;">${name}</strong>,
      </p>
      
      <p style="margin: 0 0 30px 0; font-size: 15px; color: #cccccc; line-height: 1.6;">
        ${message}
      </p>

      <div style="text-align: center; margin: 40px 0;">
        <div style="display: inline-block; padding: 20px 40px; background-color: #000000; border: 1px solid rgba(81,183,73,0.3); border-radius: 12px; box-shadow: 0 0 20px rgba(81,183,73,0.1);">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; color: #51b749; letter-spacing: 8px;">
            ${otp}
          </span>
        </div>
      </div>

      <p style="margin: 0 0 10px 0; font-size: 13px; color: #888888; text-align: center;">
        This OTP is valid for a limited time. Please do not share it.
      </p>
      <p style="margin: 0; font-size: 13px; color: #666666; text-align: center;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>

    <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-t: 1px solid #222222;">
      <p style="margin: 0; font-size: 12px; color: #555555;">
        &copy; ${new Date().getFullYear()} Embedded Systems & Robotics Club. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
`;


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
        
        await sendEmail(
          existingUser.email, 
          'Verify Your EMR Account', 
          generateEMREmailTemplate(
            'Account Verification', 
            existingUser.name, 
            'Welcome back! We noticed you started creating an account. Please use the One-Time Password (OTP) below to verify your email address and complete your registration.', 
            otp
          )
        );

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

    await sendEmail(
      user.email, 
      'Welcome to EMR - Verify Your Email', 
      generateEMREmailTemplate(
        'Welcome to EMR', 
        user.name, 
        'Thank you for joining the Embedded Systems & Robotics Club platform. To activate your account, please verify your email address using the One-Time Password (OTP) below.', 
        otp
      )
    );

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
    let existingUser = await User.findOne({
      $or: [{ email: collegeEmail }, { collegeEmail: collegeEmail }]
    });
    if(existingUser){
          return res.status(400).json({ message: 'College Email is already Used' });
    }
    
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message: 'User not found'});

    const otp = generateOTP();
    await User.findByIdAndUpdate(userId, { collegeEmail, collegeOtp: otp, collegeEmailVerified: false });
    
    await sendEmail(
      collegeEmail, 
      'Verify Your College Email', 
      generateEMREmailTemplate(
        'College Verification', 
        user.name, 
        'We received a request to link this college email address to your EMR profile. Please use the One-Time Password (OTP) below to verify your student status.', 
        otp
      )
    );
    
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

    await sendEmail(
      user.email,
      'EMR Password Reset Request',
      generateEMREmailTemplate(
        'Password Reset', 
        user.name, 
        'We received a request to reset the password for your EMR account. Please use the secure One-Time Password (OTP) below to proceed with resetting your password.', 
        otp
      )
    );
    
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