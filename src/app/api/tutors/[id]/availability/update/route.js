import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import TutorAvailability from "@/models/TutorAvailability";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { availability } = await req.json();

    let tutorAvailability = await TutorAvailability.findOne({ tutor_id: params.id });

    if (!tutorAvailability) {
      tutorAvailability = new TutorAvailability({ tutor_id: params.id, availability });
    } else {
      tutorAvailability.availability = availability;
    }

    await tutorAvailability.save();

    return NextResponse.json({ message: "Availability updated successfully!", tutorAvailability }, { status: 200 });
  } catch (error) {
    console.error("Error updating availability:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
