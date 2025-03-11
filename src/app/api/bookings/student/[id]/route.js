import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import User from "@/models/User";
import { addDays, format, startOfWeek, isBefore } from "date-fns";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    console.log("Fetching Bookings for Student ID:", params.id);

    // ✅ Fetch all bookings for the student
    const bookings = await Booking.find({ student_id: params.id }).lean();

    if (!bookings.length) {
      return NextResponse.json({ message: "No bookings found" }, { status: 404 });
    }

    const lessons = [];

    // ✅ Fetch student details using `user_id`
    const student = await Student.findOne({ user_id: params.id }).lean();
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // ✅ Fetch user details (email) for student
    const studentUser = await User.findById(student.user_id).select("email").lean();
    if (!studentUser) {
      return NextResponse.json({ message: "User details not found for student." }, { status: 404 });
    }

    // ✅ Get today's date
    const today = new Date();
    const threeMonthsLater = addDays(today, 90);

    for (const booking of bookings) {
      // ✅ Fetch tutor details using `user_id`
      const tutor = await Tutor.findOne({ user_id: booking.tutor_id }).lean();
      if (!tutor) continue;

      // ✅ Fetch user details (email) for tutor
      const tutorUser = await User.findById(tutor.user_id).select("email").lean();
      if (!tutorUser) {
        return NextResponse.json({ message: "User details not found for tutor." }, { status: 404 });
      }

      const dayOfWeek = booking.day; // "Monday", "Tuesday", etc.

      // ✅ Find the first upcoming occurrence of this day
      let firstOccurrence = startOfWeek(today, { weekStartsOn: 0 }); // Sunday start
      while (format(firstOccurrence, "EEEE") !== dayOfWeek) {
        firstOccurrence = addDays(firstOccurrence, 1);
      }

      // ✅ Generate future lesson dates within the next 3 months
      let lessonDate = firstOccurrence;
      while (isBefore(lessonDate, threeMonthsLater)) {
        lessons.push({
          booking_id: booking._id,
          student: {
            name: student.name || "N/A",
            email: studentUser.email || "N/A",
            phone: student.phone || "N/A",
            user_id: student.user_id || "N/A",
          },
          tutor: {
            name: tutor.name || "N/A",
            email: tutorUser.email || "N/A",
            phone: tutor.phone || "N/A",
            user_id: tutor.user_id || "N/A",
          },
          date: format(lessonDate, "yyyy-MM-dd"),
          status:
            booking.lesson_statuses.find(
              (l) => l.date === format(lessonDate, "yyyy-MM-dd")
            )?.status || "Confirmed",
          start_time: booking.start_time,
          end_time: booking.end_time,
          meeting_link: booking.meeting_link,
        });

        lessonDate = addDays(lessonDate, 7); // Move to the next occurrence
      }
    }

    return NextResponse.json(lessons, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching student lessons:", error);
    return NextResponse.json(
      { message: "Error fetching lessons", error: error.message },
      { status: 500 }
    );
  }
}
