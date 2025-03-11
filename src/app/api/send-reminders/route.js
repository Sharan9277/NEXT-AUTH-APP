import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import transporter from "@/lib/nodemailer";

export async function POST() {
  try {
    await connectToDatabase();
    const upcomingLessons = await Booking.find({
      status: "Confirmed",
      start_time: { $gte: new Date(), $lte: new Date(Date.now() + 86400000) }, // Lessons within next 24 hours
    }).populate("student_id tutor_id", "email name");

    for (const lesson of upcomingLessons) {
      const emailOptions = {
        from: process.env.EMAIL_USER,
        to: [lesson.student_id.email, lesson.tutor_id.email],
        subject: "Lesson Reminder",
        text: `Reminder: You have a lesson scheduled at ${lesson.start_time}. Join using: ${lesson.meeting_link}`,
      };

      await transporter.sendMail(emailOptions);
    }

    return NextResponse.json({ message: "Reminders sent." }, { status: 200 });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json({ message: "Error sending reminders", error: error.message }, { status: 500 });
  }
}
