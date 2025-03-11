import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import TutorSlot from "@/models/TutorSlot";
import Tutor from "@/models/Tutor"; // ✅ Ensure the Tutor schema is imported

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    console.log("Fetching bookings for Student ID:", params.id);

    const bookings = await Booking.find({ student_id: params.id })
    .populate("slot_id", "day start_time end_time"); // Keep populating slots
  
    for (let booking of bookings) {
        const tutor = await Tutor.findOne({ user_id: booking.tutor_id }); // Fetch tutor details manually
        booking.tutor_id = tutor; // Replace user_id with tutor details
    }
  

    if (!bookings.length) {
      console.log("No bookings found for student:", params.id);
      return NextResponse.json({ message: "No bookings found." }, { status: 404 });
    }

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
