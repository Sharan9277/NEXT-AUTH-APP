import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import TutorAvailability from "@/models/TutorAvailability";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    // ✅ Fetch tutor's availability from `TutorAvailability`
    const tutorAvailability = await TutorAvailability.findOne({ tutor_id: params.id });

    if (!tutorAvailability || tutorAvailability.availability.length === 0) {
      return NextResponse.json({ message: "No available slots found." }, { status: 404 });
    }

    

    return NextResponse.json({ slots: tutorAvailability.availability }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tutor slots:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
