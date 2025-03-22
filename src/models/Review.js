import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true }, // Reference to Tutor
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // Reference to Student (User)
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
    overall_rating: { type: Number, required: false, min: 1, max: 5 }, // Rating between 1 and 5
    review: { type: String, default: "" }, // Review text
    created_at: { type: Date, default: Date.now } // Timestamp when the review is created
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
