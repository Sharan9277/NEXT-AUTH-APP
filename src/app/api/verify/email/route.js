import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import User from "@/models/User";
import transporter from '@/lib/nodemailer';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, verificationCode, action, user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }

    console.log("Received request:", { email, verificationCode, action, user_id });

    // ✅ Fetch the user type (Student or Tutor)
    let userRecord = await Student.findOne({ user_id }) || await Tutor.findOne({ user_id });

    if (!userRecord) {
      return NextResponse.json({ message: "User record not found. Cannot proceed." }, { status: 404 });
    }

    // ✅ Send OTP
    if (action === "send_otp") {
      // ✅ Check if email already exists in the User model
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "Email is already registered." }, { status: 400 });
      }

      // ✅ Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("✅ OTP for", email, ":", otp);

      // ✅ Update OTP in the existing Student/Tutor model
      userRecord.verificationCode = otp;
      userRecord.verificationExpires = Date.now() + 3600000; // OTP valid for 1 hour
      await userRecord.save();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        text: `Your verification code is: ${otp}`
      };

      await transporter.sendMail(mailOptions);
      console.log("Verification Email Sent");

      console.log("Updated User record:", userRecord);

      return NextResponse.json({ message: "OTP sent successfully!", otp }, { status: 200 });
    }

    // ✅ Verify OTP and update email
    console.log("User found for OTP verification:", userRecord);

    if (userRecord.verificationCode !== verificationCode || userRecord.verificationExpires < Date.now()) {
      return NextResponse.json({ message: "Invalid OTP or expired" }, { status: 400 });
    }

    // ✅ Update email in the User model
    const user = await User.findById(user_id);
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.email = email;
    await user.save();

    // ✅ Clear OTP after successful verification
    userRecord.verificationCode = null;
    userRecord.verificationExpires = null;
    await userRecord.save();

    return NextResponse.json({ message: "Email updated successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ message: "Error verifying email", error: error.message }, { status: 500 });
  }
}
