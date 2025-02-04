import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    review_id: { type: String, unique: true, required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
