// lib/nodemailer.js
import nodemailer from 'nodemailer';

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  }
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Nodemailer Config Error:", error);
  } else {
    console.log("✅ Nodemailer Config Success:", success);
  }
});

export default transporter;
