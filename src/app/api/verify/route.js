// app/api/verify/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Student from '@/models/Student';
import Tutor from '@/models/Tutor';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, verificationCode } = await req.json();

    // 1. Check Student Collection
    let user = await Student.findOne({ email, verificationCode });
    let role = "student";

    // 2. If not found, check Tutor Collection
    if (!user) {
      user = await Tutor.findOne({ email, verificationCode });
      role = "tutor";
    }

    // 3. If still not found, return Invalid Code
    if (!user) {
      return NextResponse.json({ message: 'Invalid verification code.' }, { status: 400 });
    }

    // 4. Check Expiry of Verification Code
    if (user.verificationExpires < Date.now()) {
      return NextResponse.json({ message: 'Verification code has expired.' }, { status: 400 });
    }

    // 5. Update Verification Status
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    console.log(`✅ Email verified for ${role}:`, email);

    return NextResponse.json({ message: 'Email verified successfully.', role }, { status: 200 });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json({ message: 'Error verifying email', error: error.message }, { status: 500 });
  }
}
