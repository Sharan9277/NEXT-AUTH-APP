import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Booking from "@/models/Booking";

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const tutor_id = searchParams.get("tutor_id");
        const student_id = searchParams.get("student_id");
        console.log("Checking booking for tutor_id:", tutor_id, "and student_id:", student_id);
        if (!tutor_id || !student_id) {
            return NextResponse.json({ error: "Missing tutor_id or student_id" }, { status: 400 });
        }

        // ✅ Check if booking exists
        const booking = await Booking.findOne({
            tutor_id,
            student_id,
            status: "Confirmed"  // Only confirmed bookings allow messaging
        });

        return NextResponse.json({ hasBooking: !!booking });
    } catch (error) {
        console.error("Error checking booking:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
