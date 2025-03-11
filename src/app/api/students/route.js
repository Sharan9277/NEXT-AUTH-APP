import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import transporter from '@/lib/nodemailer';

// ✅ GET all students with populated user details
export async function GET(req) {
  try {
    await connectToDatabase();
    
    const student = await Student.find({})
      .populate("user_id", "email role")
      .lean();

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json({ message: "Error fetching student", error: error.message }, { status: 500 });
  }
}

// ✅ POST - Create a new student (aligned with model)
export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, email, password } = await req.json();

    // Validation: Required fields
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, role: "student" });
    const profileImage = null;

    console.log("Received Signup Request:", { name, email, password });
    console.log("Generating Verification Code...");

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated Verification Code:", verificationCode);



    // Create Student (Linked to User)
    const newStudent = await Student.create({
      user_id: newUser._id,
      student_id: uuidv4(),
      name,
      profile_image: profileImage || "",
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
        console.error('Error creating student:', error);
        return NextResponse.json({ message: 'Error creating student', error: error.message }, { status: 500 });
      }
    }

// ✅ PUT - Update student details (sync with User)
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { student_id, name, language_preferences, learning_goals, profile_image } = await req.json();

    const student = await Student.findOne({ student_id });
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Update optional fields if provided
    student.name = name || student.name;
    student.language_preferences = language_preferences || student.language_preferences;
    student.learning_goals = learning_goals || student.learning_goals;
    student.profile_image = profile_image ?? student.profile_image;
    await student.save();

    return NextResponse.json({ student }, { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json({ message: "Error updating student", error: error.message }, { status: 500 });
  }
}


// ✅ DELETE - Remove student and linked user
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { student_id } = await req.json();

    const student = await Student.findOne({ student_id });
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(student.user_id); // Delete linked User
    await Student.deleteOne({ student_id });       // Delete Student

    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ message: "Error deleting student", error: error.message }, { status: 500 });
  }
}

