import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Tutor from "@/models/Tutor";
import mongoose from "mongoose"; // ✅ Import for ObjectId conversion

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } =await params;

    console.log("Fetching tutor data for ID:", id);

    // ✅ Convert to ObjectId if it's a valid MongoDB ID
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    const queryId = isValidObjectId ? new mongoose.Types.ObjectId(id) : id;

    console.log("Querying Tutor with ID:", queryId);

    const tutor = await Tutor.findOne({ user_id: queryId }).select(
      "name phone profile_image qualifications subject_expertise hourly_rate monthly_rate hourly_rate qualifications languages_spoken bio about_me specialities resume reviews isVerified"
    );
    
    console.log("Tutor Data from DB:", tutor);

    if (!tutor) {
      return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
    }

    return NextResponse.json(tutor, { status: 200 });
  } catch (error) {
    console.error("Error fetching tutor details:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
