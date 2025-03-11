// app/api/resend-verification/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Student from '@/models/Student';
import transporter from '@/lib/nodemailer';
import { getToken } from 'next-auth/jwt';

export async function POST(req) {
  try {
    await connectToDatabase();
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const student = await Student.findOne({ user_id: token.sub });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    student.verificationCode = verificationCode;
    student.verificationExpires = Date.now() + 3600000;
    await student.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: token.email,
      subject: 'Resend Verification Code',
      text: `Your new verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Verification code resent to your email.' }, { status: 200 });
  } catch (error) {
    console.error('Error resending verification code:', error);
    return NextResponse.json({ message: 'Error resending verification code', error: error.message }, { status: 500 });
  }
}
