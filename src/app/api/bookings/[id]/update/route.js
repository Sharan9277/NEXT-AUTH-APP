import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import TutorSlot from "@/models/TutorSlot";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { status } = await req.json(); // ✅ "Confirmed" or "Canceled"

    if (!["Confirmed", "Cancelled"].includes(status)) {
      return NextResponse.json({ message: "Invalid status." }, { status: 400 });
    }

    // ✅ Update booking status
    const booking = await Booking.findById(params.id);
    if (!booking) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    booking.status = status;
    if (status === "Confirmed") {
      booking.lesson_statuses = booking.lesson_statuses.map((lesson) => ({
        ...lesson,
        status: "Confirmed",
      }));
    }


    // ✅ If booking is canceled, mark the slot as available
    if (status === "Cancelled") {
      await TutorSlot.findByIdAndUpdate(booking.slot_id, { is_booked: false });
    }
    await booking.save();


    return NextResponse.json({ message: `Booking ${status.toLowerCase()} successfully!`, booking }, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
