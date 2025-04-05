// app/api/contact/route.js
import { NextResponse } from 'next/server';
import transporter from '@/lib/nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, phoneNumber, email, message } = body;

    // Validate required fields
    if (!fullName || !phoneNumber || !email || !message) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${fullName}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        New Contact Form Submission
        ---------------------------
        Name: ${fullName}
        Phone: ${phoneNumber}
        Email: ${email}
        Message: ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Error sending email', error: error.message }, { status: 500 });
  }
}
