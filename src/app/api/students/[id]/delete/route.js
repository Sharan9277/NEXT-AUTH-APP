import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Student from "@/models/Student";
import User from "@/models/User";
import Booking from "@/models/Booking";
import bcrypt from "bcryptjs";

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { password } = await req.json();

    // ✅ Find Student
    const student = await Student.findOne({ user_id: params.id });
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // ✅ Find Associated User Account
    const user = await User.findById(student.user_id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
    }

    // ✅ Delete Bookings Related to the Student
    await Booking.deleteMany({ student_id: student.user_id });

    // ✅ Delete Student & User Accounts
    await Student.deleteOne({ user_id: params.id });
    await User.deleteOne({ _id: params.id });

    return NextResponse.json({ message: "Account deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting student account:", error);
    return NextResponse.json({ message: "Error deleting account", error: error.message }, { status: 500 });
  }
}
