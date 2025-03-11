import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import transporter from '@/lib/nodemailer';


export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, password, role, name, phone } = await req.json();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user in User collection
    const newUser = await User.create({ email, password: hashedPassword, role });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated Verification Code:", verificationCode);

    // ✅ Create role-specific data
    let profileData;
    if (role === "student") {
      profileData = await Student.create({
        user_id: newUser._id,
        student_id: uuidv4(),
        name,
        phone,
        verificationCode,
        verificationExpires: Date.now() + 3600000, // 1-hour expiry
        isVerified: false
      });
    } else if (role === "tutor") {
      profileData = await Tutor.create({
        user_id: newUser._id,
        tutor_id: uuidv4(),
        name,
        phone,
        subject_expertise: [],
        hourly_rate: 0,
        verificationCode,
        verificationExpires: Date.now() + 3600000, // 1-hour expiry
        isVerified: false
      });
    } else if (role === "admin") {
      profileData = await Admin.create({
        user_id: newUser._id,
        admin_id: uuidv4(),
        name,
        role: "Support",
        permissions: {},
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is: ${verificationCode}`
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification Email Sent");

    return NextResponse.json({ user: newUser, profile: profileData }, { status: 201 });
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({ message: "Signup failed", error: error.message }, { status: 500 });
  }
}
