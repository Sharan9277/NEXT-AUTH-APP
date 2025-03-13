import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true }, // ✅ Ensure correct reference
    slot_id: { type: mongoose.Schema.Types.ObjectId, ref: "TutorSlot", required: false },
    day: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
    meeting_link: { type: String, default: "" }, // ✅ Google Meet link will be stored here
    lesson_statuses: [
      {
        date: { type: String, required: true },
        status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Reported", "Cancelled"], default: "Pending" }
      }
    ],
    payment_status: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },

  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
