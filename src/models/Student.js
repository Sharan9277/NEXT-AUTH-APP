import mongoose from "mongoose";
import { fallbackModeToStaticPathsResult } from "next/dist/lib/fallback";

const StudentSchema = new mongoose.Schema(
  {
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true 
    },
    student_id: { 
      type: String, 
      unique: true, 
      required: true 
    },
    subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", default: null },
    name: { 
      type: String, 
      required: true, 
      minlength: 3, 
      maxlength: 50 
    },
    phone: { 
      type: String, 
      match: [/^\d{10}$/, 'Invalid phone number'], 
      default: null 
    },
    language_preferences: { 
      type: [String], 
      enum: ["English", "Spanish", "French", "German", "Chinese"], 
      default: [] 
    },
    learning_goals: { 
      type: [String], 
      default: [] 
    },
    profile_image: {
      type: String,
      default: "",
      required: false,
      set: (v) => (v === undefined ? "" : v),
      strict: false
    },   
    isVerified: {
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
    role: { 
      type: String, 
      default: "student", 
      enum: ["student"] 
    },
    email_notifications: { type: Boolean, default: true },
    push_notifications: { type: Boolean, default: false },
    lesson_reminders: { type: Boolean, default: true },
    promotional_emails: { type: Boolean, default: false },
  },
  { timestamps: true },
  { toJSON: { getters: true } }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
