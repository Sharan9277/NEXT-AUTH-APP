import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import User from "@/models/User";
import { generateGoogleMeetLink } from "@/utils/googleMeet"; // ✅ Your Google Meet API function

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const session = await getSession({ req });

    console.log("Fetching Booking with ID:", params.id || params.booking_id);

    // 🔍 Try fetching booking by `_id`
    let booking = await Booking.findById(params.id).lean();

    // 🔍 If not found by `_id`, try fetching by `booking_id`
    if (!booking) {
      booking = await Booking.findOne({ booking_id: String(params.booking_id) }).lean();
    }

    if (!booking) {
      return NextResponse.json({ message: "Lesson not found." }, { status: 404 });
    }

    console.log("Booking found:", booking);

    // 🔍 Fetch Student using user_id (stored as student_id in booking)
    const student = await Student.findOne({ user_id: booking.student_id }).lean();
    if (!student) {
      console.log("❌ Student details not found for user_id:", booking.student_id);
      return NextResponse.json({ message: "Student details not found." }, { status: 404 });
    }

    // 🔍 Fetch Tutor using user_id (stored as tutor_id in booking)
    const tutor = await Tutor.findOne({ user_id: booking.tutor_id }).lean();
    if (!tutor) {
      console.log("❌ Tutor details not found for user_id:", booking.tutor_id);
      return NextResponse.json({ message: "Tutor details not found." }, { status: 404 });
    }

    // 🔍 Fetch User details using student.user_id to get the email
    const studentUser = await User.findById(student.user_id).select("email").lean();
    if (!studentUser) {
      console.log("❌ User not found for student user_id:", student.user_id);
      return NextResponse.json({ message: "User details not found for student." }, { status: 404 });
    }

    // 🔍 Fetch User details using tutor.user_id to get the email
    const tutorUser = await User.findById(tutor.user_id).select("email").lean();
    if (!tutorUser) {
      console.log("❌ User not found for tutor user_id:", tutor.user_id);
      return NextResponse.json({ message: "User details not found for tutor." }, { status: 404 });
    }

    // ✅ Generate Google Meet Link if it's not already set
    // let updatedMeetingLink = booking.meeting_link;
    // if (!booking.meeting_link || booking.meeting_link === "") {
    //   updatedMeetingLink = await generateGoogleMeetLink(session.accessToken);

    //   // 🔥 Save the new meeting link
    //   if (updatedMeetingLink) {
    //     await Booking.findByIdAndUpdate(booking._id, { meeting_link: updatedMeetingLink });
    //   }
    // }

    return NextResponse.json({
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
      day: booking.day,
      start_time: booking.start_time,
      end_time: booking.end_time,
      status: booking.status,
      // meeting_link: updatedMeetingLink,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching lesson details:", error);
    return NextResponse.json({ message: "Error fetching lesson details", error: error.message }, { status: 500 });
  }
}
