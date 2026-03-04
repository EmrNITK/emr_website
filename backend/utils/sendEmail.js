import nodemailer from 'nodemailer';

export const sendEmail = async (email, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, 
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"EMR NIT Kurukshetra" <${process.env.MAIL_USER}>`,
    to: email,
    subject: subject,
    html: htmlContent, // This is the critical fix
    // Fallback for text-only clients
    text: `Your OTP is: ${subject}` 
  });
};