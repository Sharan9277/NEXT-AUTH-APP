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

    // ✅ Fetch booked slots that are not marked as "Completed" or "Cancelled"
    // Include the actual booking date for each slot
    const bookedSlots = await Booking.find({
      tutor_id: params.id,
      status: { $nin: ["Completed", "Cancelled"] },
    }).select("day start_time lesson_statuses");

    console.log("📌 Booked Slots:", bookedSlots);
    console.log("📌 Tutor Availability:", tutorAvailability.availability);

    // ✅ Process availability with booked dates
    const availability = tutorAvailability.availability.map((entry) => {
      // Get all slots for this day
      const daySlots = entry.slots.map(slot => {
        // Find bookings for this day and time slot
        const bookingsForSlot = bookedSlots.filter(b => 
          String(b.day).trim() === String(entry.day).trim() && 
          String(b.start_time).trim() === String(slot).trim()
        );
        
        // If there are bookings, extract the specific dates when this slot is booked
        const bookedDates = bookingsForSlot.flatMap(booking => 
          booking.lesson_statuses?.map(lesson => new Date(lesson.date).toISOString().split('T')[0]) || []
        );
        
        // Return the slot with its booked dates (if any)
        return {
          time: slot,
          booked_dates: bookedDates
        };
      });

      return {
        day: entry.day,
        slots: daySlots
      };
    });

    return NextResponse.json({ 
      availability, 
      blocked_dates: tutorAvailability.blocked_dates || [] 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching availability:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}