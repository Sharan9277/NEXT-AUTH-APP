import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Review from "@/models/Review";
import Tutor from "@/models/Tutor";
import Student from "@/models/Student";

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { student_id, tutor_id, rating, review } = await req.json();

    // Validate required fields
    if (!student_id || !tutor_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Invalid data provided" }, { status: 400 });
    }

    // Find the student by user_id
    const student = await Student.findOne({ user_id: student_id });
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Find the tutor by user_id
    const tutor = await Tutor.findOne({ user_id: tutor_id });
    if (!tutor) {
      return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
    }

    // Create a new review
    const newReview = new Review({
      tutor_id: tutor.user_id,  // Reference to Tutor model using user_id
      student_id: student.user_id,  // Reference to Student model using user_id
      rating,
      review,
    });

    // Save the new review
    await newReview.save();

    // Recalculate overall rating for the tutor
    const allReviews = await Review.find({ tutor_id: tutor.user_id });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const overallRating = (totalRating / allReviews.length).toFixed(1); // Round to 1 decimal

    // Update all reviews and tutor with the new overall rating
    await Review.updateMany({ tutor_id: tutor.user_id }, { overall_rating: overallRating });
    tutor.overall_rating = overallRating;
    await tutor.save();

    // Return the response with success message and review data
    return NextResponse.json({
      message: "Review added successfully",
      review: { ...newReview._doc, overall_rating: overallRating },
    }, { status: 201 });

  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
