import nodemailer from 'nodemailer';

export const sendEmail = async (email, subject, text) => {
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
    from: process.env.MAIL_USER,
    to: email,
    subject,
    text
  });
};