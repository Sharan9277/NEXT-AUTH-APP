// api/admin/students/[id]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Student from "@/models/Student";
import User from "@/models/User";

// Update student
export async function PUT(req, { params }) {
    try {
      await connectToDatabase();
      const { id: userId } = params; // this is user_id being sent from frontend
      console.log("Incoming user_id from params:", userId);
      const data = await req.json();
  
      // Find the student using user_id
      const student = await Student.findOne({ user_id: userId });
  
      if (!student) {
        return NextResponse.json({ message: "Student not found" }, { status: 404 });
      }
  
      // Update student details
      if (data.name) student.name = data.name;
      if (data.grade) student.grade = data.grade;
      if (data.phone) student.phone = data.phone;
      if (data.subjects) student.subjects = data.subjects;
  
      await student.save();
  
      // Update user's email if provided
      if (data.email) {
        const user = await User.findById(userId);
        if (user) {
          user.email = data.email;
          await user.save();
        }
      }
  
      // Return updated student info with populated user
      const updatedStudent = await Student.findOne({ user_id: userId })
        .populate("user_id", "email role")
        .lean();
  
      return NextResponse.json(updatedStudent, { status: 200 });
    } catch (error) {
      console.error("Error updating student:", error);
      return NextResponse.json(
        { message: "Failed to update student", error: error.message },
        { status: 500 }
      );
    }
  }
  

// Delete student
export async function DELETE(req, { params }) {
    try {
      await connectToDatabase();
      const { id: userId } = params;
  
      // Find the student using user_id
      const student = await Student.findOne({ user_id: userId });
  
      if (!student) {
        return NextResponse.json({ message: "Student not found" }, { status: 404 });
      }
  
      // Delete the student record
      await Student.findByIdAndDelete(student._id);
  
      // Delete the user account
      await User.findByIdAndDelete(userId);
  
      return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting student:", error);
      return NextResponse.json(
        { message: "Failed to delete student", error: error.message },
        { status: 500 }
      );
    }  
}