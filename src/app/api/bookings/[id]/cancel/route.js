import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import TutorSlot from "@/models/TutorSlot";
import TutorAvailability from "@/models/TutorAvailability";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { status } = await req.json(); // ✅ "Confirmed" or "Canceled"
    
        if (!["Confirmed", "Cancelled"].includes(status)) {
          return NextResponse.json({ message: "Invalid status." }, { status: 400 });
        }


    const booking = await Booking.findById(params.id);

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    booking.status = status;

        if (status === "Cancelled") {
          await TutorSlot.findByIdAndUpdate(booking.slot_id, { is_booked: false });
        }
        await booking.save();
    
    booking.lesson_statuses = booking.lesson_statuses.map((lesson) => ({
      ...lesson,
      status: "Cancelled",
    }));
    booking.status = "Cancelled";
    await booking.save();

    // ✅ Restore the slot to availability
    const tutorAvailability = await TutorAvailability.findOne({ tutor_id: booking.tutor_id });
    if (tutorAvailability) {
      const dayEntry = tutorAvailability.availability.find((entry) => entry.day === booking.day);
      if (dayEntry && !dayEntry.slots.includes(booking.start_time)) {
        dayEntry.slots.push(booking.start_time);
        await tutorAvailability.save();
      }
    }

    

    return NextResponse.json({ message: "Lesson marked as Completed. Slot restored." }, { status: 200 });
  } catch (error) {
    console.error("Error marking lesson as completed:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
