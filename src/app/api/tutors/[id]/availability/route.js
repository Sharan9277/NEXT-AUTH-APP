import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import TutorAvailability from "@/models/TutorAvailability";
import Booking from "@/models/Booking";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    // 🔍 Fetch tutor availability
    const tutorAvailability = await TutorAvailability.findOne({ tutor_id: params.id });

    if (!tutorAvailability) {
      return NextResponse.json({ message: "Tutor availability not found" }, { status: 404 });
    }

    // ✅ Fetch booked slots that are not marked as "Completed"
    const bookedSlots = await Booking.find({
      tutor_id: params.id,
      status: { $nin: ["Completed","Cancelled"] },
    }).select("day start_time");

    console.log("📌 Booked Slots:", bookedSlots);
    console.log("📌 Tutor Availability:", tutorAvailability.availability);

    // ✅ Filter out booked slots
    const availability = tutorAvailability.availability.map((entry) => {
      return {
        day: entry.day,
        slots: entry.slots.filter((slot) => {
          return !bookedSlots.some((b) => 
            String(b.day).trim() === String(entry.day).trim() && 
            String(b.start_time).trim() === String(slot).trim()
          );
        }),
      };
    });

    return NextResponse.json({ availability, blocked_dates: tutorAvailability.blocked_dates || [] }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching availability:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
