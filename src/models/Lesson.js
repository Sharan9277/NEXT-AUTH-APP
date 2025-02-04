import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    lesson_id: { type: String, unique: true, required: true },
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["Scheduled", "Completed", "Canceled"], default: "Scheduled" },
  },
  { timestamps: true }
);

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
