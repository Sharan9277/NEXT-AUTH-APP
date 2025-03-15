import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import TutorSlot from "@/models/TutorSlot";
import Booking from "@/models/Booking";
import Subscription from "@/models/Subscription";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { student_id, tutor_id, day, start_time, end_time, amount, booking_type, lessons_per_week } = await req.json();

    if (!tutor_id) {
      return NextResponse.json({ message: "Tutor ID is required for booking." }, { status: 400 });
    }

    // ✅ Check if Student Has Any Previous Bookings with Tutor
    const previousBookings = await Booking.findOne({
      student_id,
      tutor_id,
    });

    // ✅ If No Previous Booking Exists, Only Allow Trial
    if (!previousBookings && booking_type !== "trial") {
      return NextResponse.json({ message: "You must complete a trial lesson before booking more lessons." }, { status: 400 });
    }

    // ✅ If a Trial Has Already Been Done, Restrict Another Trial
    if (previousBookings && booking_type === "trial") {
      return NextResponse.json({ message: "You have already taken a trial lesson with this tutor. Choose an individual lesson or subscription.", success: false }, { status: 400 });
    }

    // ✅ If Subscription, Ensure No Duplicate Subscription
    if (booking_type === "subscription") {
      const activeSubscription = await Subscription.findOne({
        student_id,
        tutor_id,
        status: "active",
      });

      if (activeSubscription) {
        return NextResponse.json({ message: "You already have an active subscription with this tutor.", success: false }, { status: 400 });
      }
    }

    // ✅ Create a Tutor Slot (but no Booking yet)
    const newSlot = await TutorSlot.create({
      tutor_id,
      student_id,
      day,
      start_time,
      end_time,
      is_booked: false, // ✅ Mark slot as pending until payment
    });

    return NextResponse.json({
      message: "Tutor slot created successfully! Proceed to payment.",
      slot_id: newSlot._id,
      success: true,
    }, { status: 200 });

  } catch (error) {
    console.error("Error creating tutor slot:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
