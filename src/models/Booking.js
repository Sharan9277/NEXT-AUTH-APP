import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    booking_id: { type: String, unique: true, required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    status: { type: String, enum: ["Confirmed", "Pending", "Canceled"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
