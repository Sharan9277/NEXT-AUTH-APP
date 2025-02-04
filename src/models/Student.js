import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student_id: { type: String, unique: true, required: true }, // UUID or String
    name: { type: String, required: true },
    phone: { type: String, default: null },
    language_pref: { type: [String], default: [] },
    learning_goals: { type: [String], default: [] },
    wallet_balance: { type: Number, default: 0 },
    role: { type: String, default: "student" },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
