import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Student from "@/models/Student";
import mongoose from "mongoose"; // ✅ Import for ObjectId conversion

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } =await params;

    console.log("Fetching student data for ID:", id);

    // ✅ Convert to ObjectId if it's a valid MongoDB ID
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    const queryId = isValidObjectId ? new mongoose.Types.ObjectId(id) : id;

    console.log("Querying Student with ID:", queryId);

    const student = await Student.findOne({ user_id: queryId }).select(
      "name phone profile_image qualifications subject_expertise hourly_rate monthly_rate hourly_rate qualifications languages_spoken bio about_me specialities resume reviews isVerified"
    );
    
    console.log("Student Data from DB:", student);

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error fetching student details:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { profile_image, name, phone, timezone, facebook_connected, google_connected } = await req.json();

    const student = await Student.findOne({ user_id: params.id });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // ✅ Update student profile fields
    student.profile_image = profile_image || student.profile_image;
    student.name = name || student.name;
    student.phone = phone || student.phone;
    student.timezone = timezone || student.timezone;
    student.facebook_connected = facebook_connected ?? student.facebook_connected; // Allow true/false updates
    student.google_connected = google_connected ?? student.google_connected;

    await student.save();

    return NextResponse.json({ message: "Profile updated successfully!", student }, { status: 200 });
  } catch (error) {
    console.error("Error updating student profile:", error);
    return NextResponse.json({ message: "Error updating profile", error: error.message }, { status: 500 });
  }
  
}