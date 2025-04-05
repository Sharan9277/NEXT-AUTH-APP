import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const reviews = await Review.find({}).sort({ created_at: -1 }).lean();

    // Extract student and tutor user_ids directly from Review
    const studentUserIds = [...new Set(reviews.map(r => r.student_id?.toString()))];
    const tutorUserIds = [...new Set(reviews.map(r => r.tutor_id?.toString()))];
    const allUserIds = [...new Set([...studentUserIds, ...tutorUserIds])];

    // Fetch User data
    const users = await User.find({ _id: { $in: allUserIds } }).select("name email profile_image").lean();
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Fetch Students and Tutors based on user_id
    const students = await Student.find({ user_id: { $in: studentUserIds } }).lean();
    const tutors = await Tutor.find({ user_id: { $in: tutorUserIds } }).lean();

    const studentMap = {};
    students.forEach(student => {
      const userId = student.user_id?.toString();
      studentMap[userId] = {
        ...student,
        user: userMap[userId] || null
      };
    });

    const tutorMap = {};
    tutors.forEach(tutor => {
      const userId = tutor.user_id?.toString();
      tutorMap[userId] = {
        ...tutor,
        user: userMap[userId] || null
      };
    });

    // Enrich the reviews with student and tutor info
    const enrichedReviews = reviews.map(review => {
      const student = studentMap[review.student_id?.toString()] || null;
      const tutor = tutorMap[review.tutor_id?.toString()] || null;

      return {
        ...review,
        student,
        tutor
      };
    });

    return NextResponse.json({ success: true, data: enrichedReviews });
  } catch (error) {
    console.error("Error fetching enriched reviews:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enriched reviews", error: error.message },
      { status: 500 }
    );
  }
}
