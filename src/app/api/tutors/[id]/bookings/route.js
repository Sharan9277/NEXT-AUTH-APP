import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import TutorSlot from "@/models/TutorSlot";
import Student from "@/models/Student";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    console.log("Fetching bookings for Tutor ID:", params.id);

    // Fetch the base booking records
    const bookings = await Booking.find({ tutor_id: params.id });
    console.log("Total bookings found:", bookings.length);

    if (!bookings.length) {
      console.log("No bookings found for tutor:", params.id);
      return NextResponse.json({ message: "No bookings found." }, { status: 404 });
    }

    // Enhance bookings with additional details
    const enhancedBookings = await Promise.all(bookings.map(async (booking) => {
      // Convert to plain object so we can modify it
      const bookingObj = booking.toObject();
      
      // Fetch the slot details to get day and time information
      const slot = await TutorSlot.findById(booking.slot_id);
      if (slot) {
        bookingObj.day = slot.day;
        bookingObj.start_time = slot.start_time;
        bookingObj.end_time = slot.end_time;
      }
      
      // Fetch student information
      const student = await Student.findOne({ user_id: booking.student_id });
      if (student) {
        // Get student's name directly from Student model
        bookingObj.student_name = student.name || "Unknown";
        bookingObj.student_email = student.email;
        
        // Include other student details if needed
        bookingObj.student_details = {
          grade: student.grade,
          school: student.school,
          // Add other relevant student fields here
        };
      }
      
      return bookingObj;
    }));

    return NextResponse.json({ bookings: enhancedBookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}