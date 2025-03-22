import mongoose from "mongoose";

const TutorSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Foreign Key
    tutor_id: { type: String, unique: true, required: true }, // UUID or String
    name: { type: String, required: true },
    bio: { type: String, default: "" }, // ✅ Short Introductory Bio
    about_me: { type: String, default: "" }, // ✅ Detailed Description
    country: { type: String, default: "" }, // ✅ Detailed Description
    phone: { type: String, default: null },
    profile_image: {
      type: String,
      default: "",
      required: false,
      set: (v) => (v === undefined ? "" : v),
      strict: false
    },
    earnings: { type: mongoose.Types.Decimal128, default: 0.00 },
    resume: { type: String, default: "" },
    qualifications: { type: [String], default: [] },
    subject_expertise: { type: [String], required: true },
    specialties: { type: [String], default: [] },
    hourly_rate: { type: Number, required: true },
    monthly_rate: { type: Number, default: 0 }, 
    languages_spoken: { type: [String], default: [] },
    role: { type: String, default: "tutor" },
    isVerified: {
      type: Boolean,
      default: false
    },
    isAdminVerified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
      default: null
    },
    verificationExpires: {
      type: Date,
      default: null
    }, 
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }] // Reference to the Review model
  },
  { timestamps: true }
);

export default mongoose.models.Tutor || mongoose.model("Tutor", TutorSchema);
