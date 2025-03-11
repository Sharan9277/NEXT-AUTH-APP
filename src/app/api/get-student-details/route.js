import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { userId } = await req.json();

    console.log("Received Request with User ID:", userId); // ✅ Debug incoming request

    if (!userId) {
      console.error("Error: User ID is missing in the request body!");
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Find the student by user_id
    const student = await Student.findOne({ user_id: userId }).select("name profile_image");

    console.log("MongoDB Query Result:", student); // ✅ Debug MongoDB response

    if (!student) {
      console.error("Error: Student not found for User ID:", userId);
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ name: student.name, profile_image: student.profile_image }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student details:", error);
    return NextResponse.json({ message: "Error fetching student details", error: error.message }, { status: 500 });
  }
}


