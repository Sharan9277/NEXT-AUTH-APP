import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import TutorSlot from "@/models/TutorSlot";
import Student from "@/models/Student";


export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    console.log("Fetching bookings for Tutor ID:", params.id);

    const bookings = await Booking.find({ tutor_id: params.id })
      .populate("slot_id", "day start_time end_time")
          for (let booking of bookings) {
              const student = await Student.findOne({ user_id: booking.student_id }); // Fetch tutor details manually
              booking.student_id = student; // Replace user_id with tutor details
          }
      

    if (!bookings.length) {
      console.log("No bookings found for tutor:", params.id);
      return NextResponse.json({ message: "No bookings found." }, { status: 404 });
    }
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
