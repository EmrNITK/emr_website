import nodemailer from "nodemailer";
import User from '../models/User.model.js';
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const generateSixDigitOTP = () => {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

const sendOTP = async (email) => {
  try {
    const otp = generateSixDigitOTP();

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: "Your New OTP for Verification",
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="https://your-new-link.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"><img width="200px" src="https://new-image-link.com/image.png" /></a>
          </div>
          <p style="font-size:1.1em">Hello,</p>
          <p>Thank you for choosing our service. Use the following OTP to complete your verification. OTP is valid for <b>5 minutes</b></p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Best Regards,<br />Your Company Name</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
            <a href="https://your-new-link.com" style="text-decoration: none; color:#aaa;" target="_blank">Your Company Name</a>
            <p>Made with ❤️</p>
            <a href="https://your-social-link.com" style="text-decoration: none; color:#aaa;" target="_blank">@yourSocialHandle</a>
          </div>
        </div>
      </div>`
    };

    await transporter.sendMail(mailOptions);
    const date = new Date();
    const expireAt = (date.getTime() + (5 * 60 * 1000));
    const expireTime = new Date(expireAt);

    await User.updateOne({ email: email }, { otp: otp, otpExpireAt: expireTime });
  } catch (error) {
    console.error("Error sending OTP: ", error.message);
    throw error;
  }
};

export { sendOTP };
