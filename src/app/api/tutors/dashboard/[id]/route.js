// pages/api/tutors/dashboard/[id].js
import { connectToDatabase } from "@/lib/mongodb";
import Tutor from "@/models/Tutor";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Assignment from "@/models/Assignment";
import Review from "@/models/Review";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    const tutorUserId = new mongoose.Types.ObjectId(id);

    console.log("Fetching Tutor for user_id:", tutorUserId);
    const tutorDoc = await Tutor.findOne({ user_id: tutorUserId });
    if (!tutorDoc) {
      console.log("Tutor not found");
      return new Response(JSON.stringify({ error: "Tutor not found" }), { status: 404 });
    }

    const tutorId = tutorDoc.user_id;
    console.log("Tutor found:", tutorId.toString());

    const user = await User.findById(tutorUserId);
    const walletBalance = user?.wallet_balance?.toString() || "0.00";
    const totalEarnings = tutorDoc.earnings?.toString() || "0.00";
    console.log("Wallet Balance:", walletBalance);
    console.log("Total Earnings:", totalEarnings);

    const bookings = await Booking.find({ tutor_id: tutorId });
    console.log("Total bookings found:", bookings.length);

    // LESSON STATS
    let totalLessons = 0;
    let lessonsCompleted = 0;
    let lessonsConfirmed = 0;
    let lessonsCancelled = 0;
    let lessonsUpcoming = 0;

    const now = new Date();

    bookings.forEach((booking, bookingIndex) => {
      if (booking.lesson_statuses && booking.lesson_statuses.length > 0) {
        totalLessons += booking.lesson_statuses.length;

        booking.lesson_statuses.forEach((ls, lsIndex) => {
          console.log(`Booking[${bookingIndex}].lesson_statuses[${lsIndex}]:`, ls);

          if (ls.status === "Completed") lessonsCompleted++;
          if (ls.status === "Confirmed") lessonsConfirmed++;
          if (ls.status === "Cancelled") lessonsCancelled++;

          if (ls.date && ["Pending", "Confirmed"].includes(ls.status)) {
            const lessonDate = new Date(ls.date);
            if (!isNaN(lessonDate)) {
              if (lessonDate > now) {
                lessonsUpcoming++;
                console.log(`✅ Upcoming lesson: ${lessonDate.toISOString()} (Status: ${ls.status})`);
              } else {
                console.log(`🕑 Past lesson: ${lessonDate.toISOString()} (Status: ${ls.status})`);
              }
            } else {
              console.log(`❌ Invalid date in lesson_statuses:`, ls.date);
            }
          }
        });
      }
    });

    console.log("Total Lessons:", totalLessons);
    console.log("Lessons Completed:", lessonsCompleted);
    console.log("Lessons Confirmed:", lessonsConfirmed);
    console.log("Lessons Cancelled:", lessonsCancelled);
    console.log("Lessons Upcoming:", lessonsUpcoming);

    const assignments = await Assignment.find({ assigned_to: tutorDoc._id , status: "completed" });
    const assignmentsCompleted = assignments.length;
    console.log("Assignments Completed:", assignmentsCompleted);

    const reviews = await Review.find({ tutor_id: tutorId });
    const averageRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";
    console.log("Reviews Count:", reviews.length);
    console.log("Average Rating:", averageRating);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const weeklyBookingsData = Array(7).fill(0);

    bookings.forEach(b => {
      const created = new Date(b.createdAt);
      if (created > thirtyDaysAgo) {
        const dayIndex = created.getDay();
        weeklyBookingsData[dayIndex]++;
      }
    });

    console.log("Weekly Bookings Data (Sun-Sat):", weeklyBookingsData);

    const formattedRecentBookings = bookings.slice(0, 5).map(b => {
      const firstLesson = b.lesson_statuses && b.lesson_statuses.length > 0 ? b.lesson_statuses[0] : null;

      return {
        id: b._id.toString(),
        student_name: b.student_id?.name || "Student",
        day: b.day,
        start_time: b.start_time,
        end_time: b.end_time,
        status: b.status,
        amount: b.amount,
        booking_type: b.booking_type,
        createdAt: b.createdAt,
        date: firstLesson?.date || null
      };
    });

    console.log("Recent Bookings (Top 5):", formattedRecentBookings);

    const dashboardData = {
      walletBalance,
      totalEarnings,
      earningsWithdrawn: "0.00",
      totalLessons,
      lessonsCompleted,
      lessonsUpcoming,
      lessonsConfirmed,
      lessonsCancelled,
      assignmentsCompleted,
      averageRating,
      weeklyBookingsData,
      recentBookings: formattedRecentBookings
    };

    console.log("✅ Final Dashboard Data:", dashboardData);

    return new Response(JSON.stringify(dashboardData), { status: 200 });

  } catch (error) {
    console.error("❌ Dashboard API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
