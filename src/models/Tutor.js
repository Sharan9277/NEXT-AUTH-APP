import mongoose from "mongoose";

const TutorSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Foreign Key
    tutor_id: { type: String, unique: true, required: true }, // UUID or String
    name: { type: String, required: true },
    phone: { type: String, default: null },
    qualifications: { type: [String], default: [] },
    subject_expertise: { type: [String], required: true },
    hourly_rate: { type: Number, required: true },
    role: { type: String, default: "tutor" },
  },
  { timestamps: true }
);

export default mongoose.models.Tutor || mongoose.model("Tutor", TutorSchema);
