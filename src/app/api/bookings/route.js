import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();

    // Step 1: Extract all unique user IDs from bookings
    const studentUserIds = [...new Set(bookings.map(b => b.student_id.toString()))];
    const tutorUserIds = [...new Set(bookings.map(b => b.tutor_id.toString()))];
    const allUserIds = [...new Set([...studentUserIds, ...tutorUserIds])];

    // Step 2: Fetch all User documents
    const users = await User.find({ _id: { $in: allUserIds } }).select("name email").lean();

    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Step 3: Fetch Student and Tutor documents using user_id
    const students = await Student.find({ user_id: { $in: studentUserIds } }).lean();
    const tutors = await Tutor.find({ user_id: { $in: tutorUserIds } }).lean();

    const studentMap = {};
    students.forEach(student => {
      const userId = student.user_id.toString();
      studentMap[userId] = {
        ...student,
        user: userMap[userId] || null
      };
    });

    const tutorMap = {};
    tutors.forEach(tutor => {
      const userId = tutor.user_id.toString();
      tutorMap[userId] = {
        ...tutor,
        user: userMap[userId] || null
      };
    });

    // Step 4: Combine everything into enriched bookings
    const enrichedBookings = bookings.map(booking => ({
      ...booking,
      student: studentMap[booking.student_id.toString()] || null,
      tutor: tutorMap[booking.tutor_id.toString()] || null
    }));

    return NextResponse.json({ success: true, data: enrichedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings", error: error.message },
      { status: 500 }
    );
  }
}
