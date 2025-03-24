import { NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import { v4 as uuidv4 } from "uuid";
import transporter from "@/lib/nodemailer";

export async function POST(req) {
  try {
    const { email, role } = await req.json();
    if (!email || !role) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOneAndUpdate({ email }, { role }, { new: true });

    const newUser = await User.findById(user._id);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let profileData;
    if (role === "student") {
        profileData = await Student.create({
          user_id: newUser._id,
          student_id: uuidv4(),
          name: newUser.name,
          isVerified: true 
        });
      } else { 
        profileData = await Tutor.create({
          user_id: newUser._id,
          tutor_id: uuidv4(),
          name: newUser.name,
          subject_expertise: [],
          hourly_rate: 0,
          isVerified: true 
        });
      } 

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newUser.email,
            subject: 'Account Creation Confirmation',
            text: `Your account has been created successfully.`,
          };

          await transporter.sendMail(mailOptions);
          console.log("Assignment submission email sent");

    return NextResponse.json({ success: true, role });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}




          