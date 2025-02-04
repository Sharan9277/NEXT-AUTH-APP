import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// ✅ GET all students with populated user details
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // ✅ Fetch student linked to the logged-in user's ID
    const student = await Student.find({user_id: userId}).populate("user_id", "email role");

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
    const { name, email, password, phone, language_pref, learning_goals, wallet_balance } = await req.json();

    // ✅ Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // ✅ Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, role: "student" });

    // ✅ Create Student (linked with user_id)
    const newStudent = await Student.create({
      user_id: newUser._id,
      student_id: uuidv4(),
      name,
      phone: phone || "",
      language_pref: language_pref || [],
      learning_goals: learning_goals || [],
      wallet_balance: wallet_balance || 0,
    });

    return NextResponse.json({ user: newUser, student: newStudent }, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ message: "Error creating student", error: error.message }, { status: 500 });
  }
}

// ✅ PUT - Update student details (sync with User)
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { student_id, name, email, password, phone, learning_goals } = await req.json();

    const student = await Student.findOne({ student_id });
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // ✅ Check for linked user
    const user = await User.findById(student.user_id);
    if (!user) {
      return NextResponse.json({ message: "Linked user not found for this student" }, { status: 404 });
    }

    // ✅ Update User details
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();  // 🔐 This will only run if the user exists

    // ✅ Update Student details
    student.name = name || student.name;
    student.phone = phone === null ? null : phone || student.phone;
    student.learning_goals = learning_goals || student.learning_goals;
    await student.save();

    return NextResponse.json({ user, student }, { status: 200 });
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
