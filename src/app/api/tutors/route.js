import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Tutor from "@/models/Tutor";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import transporter from '@/lib/nodemailer';

// ✅ GET all tutors with user details
export async function GET() {
  try {
    await connectToDatabase();
    
    const tutors = await Tutor.find({}).populate("user_id", "email role");
    return NextResponse.json(tutors, { status: 200 });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return NextResponse.json({ message: "Error fetching tutors", error: error.message }, { status: 500 });
  }
}

// ✅ POST - Create a new tutor
export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, email, password, phone, qualifications, subject_expertise, hourly_rate, availability } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, role: "tutor" });
    const profileImage = null;

    console.log("Generating Verification Code...");

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated Verification Code:", verificationCode);

    const newTutor = await Tutor.create({
      user_id: newUser._id,
      tutor_id: uuidv4(),
      name,
      phone: phone || null,
      profile_image: profileImage || "",
      qualifications: qualifications || [],
      subject_expertise: subject_expertise || [],
      hourly_rate: hourly_rate || 0,
      availability: availability || {},
      ratings: []
    });

            // Send verification email
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: 'Verify your email',
              text: `Your verification code is: ${verificationCode}`,
            };
        
            await transporter.sendMail(mailOptions);
    
            console.log("Verification Code:", verificationCode);
            console.log("Mail Options:", mailOptions);

    return NextResponse.json({ message: 'Account created. Please verify your email.' }, { status: 201 });
  } catch (error) {
    console.error("Error creating tutor:", error);
    return NextResponse.json({ message: "Error creating tutor", error: error.message }, { status: 500 });
  }
}

// ✅ PUT - Update tutor details
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { tutor_id, name, email, password, phone, profile_image, qualifications, subject_expertise, hourly_rate, availability } = await req.json();

    const tutor = await Tutor.findOne({ tutor_id });
    if (!tutor) {
      return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
    }

    const user = await User.findById(tutor.user_id);
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();

    tutor.name = name || tutor.name;
    tutor.phone = phone || tutor.phone;
    tutor.qualifications = qualifications || tutor.qualifications;
    tutor.subject_expertise = subject_expertise || tutor.subject_expertise;
    tutor.hourly_rate = hourly_rate !== undefined ? hourly_rate : tutor.hourly_rate;
    tutor.availability = availability || tutor.availability;
    tutor.profile_image = profile_image ?? tutor.profile_image;
    await tutor.save();

    return NextResponse.json({ user, tutor }, { status: 200 });
  } catch (error) {
    console.error("Error updating tutor:", error);
    return NextResponse.json({ message: "Error updating tutor", error: error.message }, { status: 500 });
  }
}

// ✅ DELETE - Remove tutor and linked user
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { tutor_id } = await req.json();

    const tutor = await Tutor.findOne({ tutor_id });
    if (!tutor) {
      return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(tutor.user_id); // Delete linked User
    await Tutor.deleteOne({ tutor_id });       // Delete Student

    return NextResponse.json({ message: "Tutor deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting tutor:", error);
    return NextResponse.json({ message: "Error deleting tutor", error: error.message }, { status: 500 });
  }
}
