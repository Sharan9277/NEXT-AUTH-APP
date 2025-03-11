import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const bookings = await Booking.find({ student_id: params.id }).select("day start_time end_time status");

    const formattedBookings = bookings
      .filter((booking) => booking.status === "Confirmed") // ✅ Only confirmed bookings
      .map((booking) => {
        const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(booking.day);

        return {
          day: booking.day,
          dayIndex,
          start_time: booking.start_time,
          end_time: booking.end_time,
          status: booking.status, // ✅ Include status for verification
        };
      });

    return NextResponse.json({ bookings: formattedBookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student bookings:", error);
    return NextResponse.json({ message: "Error fetching bookings", error: error.message }, { status: 500 });
  }
}
