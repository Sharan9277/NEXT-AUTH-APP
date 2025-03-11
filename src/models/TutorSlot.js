import mongoose from "mongoose";

const TutorSlotSchema = new mongoose.Schema(
  {
    slot_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // ✅ Student who booked
    day: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    is_booked: { type: Boolean, default: false }, // ✅ True if booked
  },
  { timestamps: true }
);

export default mongoose.models.TutorSlot || mongoose.model("TutorSlot", TutorSlotSchema);
