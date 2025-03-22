import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Review from "@/models/Review";
import Tutor from "@/models/Tutor";
import Student from "@/models/Student";

export async function GET(req, { params }) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { id } = params; // `id` is the `user_id` of the tutor

    // Find the tutor using user_id
    const tutor = await Tutor.findOne({ user_id: id });

    if (!tutor) {
      return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
    }

    // Fetch all reviews for this tutor using tutor's user_id
    const reviews = await Review.find({ tutor_id: tutor.user_id });

    if (reviews.length === 0) {
      return NextResponse.json({ message: "No reviews found", overall_rating: 0, reviews: [] }, { status: 200 });
    }

    // Calculate overall rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const overallRating = (totalRating / reviews.length).toFixed(1); // Round to 1 decimal place

    // Update overall rating in the Review model
    await Review.updateMany({ tutor_id: tutor.user_id }, { overall_rating: overallRating });

    // Fetch student details manually using user_id from reviews
    const studentIds = reviews.map(review => review.student_id);
    const students = await Student.find({ user_id: { $in: studentIds } }).select("user_id name profile_image");

    // Map student details to reviews
    const reviewsWithStudentDetails = reviews.map(review => {
      const student = students.find(s => s.user_id.toString() === review.student_id.toString());
      return {
        _id: review._id,
        rating: review.rating,
        review: review.review,
        created_at: review.created_at,
        student: student ? { name: student.name, profile_image: student.profile_image } : null
      };
    });

    return NextResponse.json({ overall_rating: overallRating, reviews: reviewsWithStudentDetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
