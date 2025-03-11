import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Student
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tutor
    last_message: { type: String, default: "" }, // Last message preview
    last_message_timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
