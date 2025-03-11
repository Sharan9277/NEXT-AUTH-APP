import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import TutorSlot from "@/models/TutorSlot";
import TutorAvailability from "@/models/TutorAvailability";
import { addDays, format, startOfWeek, isBefore } from "date-fns";


export async function POST(req) {
  try {
    await connectToDatabase();
    const { student_id, tutor_id, day, start_time, end_time } = await req.json();

    // ✅ Ensure tutor_id is not null before proceeding
    if (!tutor_id) {
      return NextResponse.json({ message: "Tutor ID is required for booking." }, { status: 400 });
    }

    // ✅ Check if the selected slot exists in `TutorAvailability`
    const availability = await TutorAvailability.findOne({ tutor_id });
    if (!availability) {
      console.log("❌ No availability found for tutor:", tutor_id);

      return NextResponse.json({ message: "Tutor availability not found" }, { status: 404 });
    }
    console.log("Received Booking Request:", { student_id, tutor_id, day, start_time, end_time });

    const dayAvailability = availability?.availability?.find(
      (entry) => entry?.day?.toLowerCase() === day?.toLowerCase() // ✅ Ensure safe access
    );
    
    if (dayAvailability) {
      console.log(`✅ Slots for ${day}:`, dayAvailability.slots);
    } else {
      console.log("❌ Day not found in availability.");
    }
    if (!dayAvailability) {
      console.log("❌ Error: Day not found in tutor's availability.");
      return NextResponse.json({ message: "Day not found in availability." }, { status: 400 });
    }
    

    if (!dayAvailability || !dayAvailability.slots.includes(start_time)) {
      return NextResponse.json({ message: "Slot not available" }, { status: 400 });
    }

    const isSlotAvailable = dayAvailability.slots.some(
      (slot) => slot.trim() === start_time.trim()
    );

    if (!isSlotAvailable) {
      return NextResponse.json({ message: "Slot not available in tutor's schedule." }, { status: 400 });
    }

    // ✅ Create a new slot in `TutorSlot`
    const newSlot = await TutorSlot.create({
      tutor_id,
      student_id,
      day,
      start_time,
      end_time,
      is_booked: true,
    });

    // ✅ Generate Lesson Dates for the Next 3 Months
    const lessons = [];
    const today = new Date();
    const threeMonthsLater = addDays(today, 90);

    console.log("Today:", today);

    // ✅ Find first occurrence of selected `day`
    let firstOccurrence = startOfWeek(today, { weekStartsOn: 0 });
    while (format(firstOccurrence, "EEEE") !== day) {
      firstOccurrence = addDays(firstOccurrence, 1);
    }

    let lessonDate = firstOccurrence;
    while (isBefore(lessonDate, threeMonthsLater)) {
      lessons.push({
        date: format(lessonDate, "yyyy-MM-dd"),
        status: "Pending", // ✅ Each lesson starts as "Pending"
      });

      lessonDate = addDays(lessonDate, 7); // Move to the next week
    }

    // ✅ Create Booking with the correct `tutor_id`
    const newBooking = await Booking.create({
      student_id,
      tutor_id, // ✅ Ensuring tutor_id is stored
      slot_id: newSlot._id,
      day,
      start_time,
      end_time,
      status: "Pending",
      lesson_statuses: lessons,
    });

    // ✅ Remove booked slot from `TutorAvailability`
    dayAvailability.slots = dayAvailability.slots.filter((slot) => slot !== start_time);
    await availability.save();

    return NextResponse.json({
      message: "Booking created successfully!",
      booking: newBooking,
      slot: newSlot,
      lesson_statuses: lessons,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
