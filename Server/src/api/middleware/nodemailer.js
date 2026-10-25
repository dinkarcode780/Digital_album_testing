import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const escapeHtml = (str) =>
  String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendResetPasswordEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Album Studio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset OTP</h2>
      <p>Your password reset code is:</p>
      <h1 style="letter-spacing: 6px;">${escapeHtml(otp)}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    throw err;
  }
};
