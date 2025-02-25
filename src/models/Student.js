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
    wallet_balance: { 
      type: mongoose.Types.Decimal128, 
      default: 0.00 
    },
    profile_image: {
      type: String,
      default: "",
      required: false,
      set: (v) => (v === undefined ? "" : v),
      strict: false

    },    
    role: { 
      type: String, 
      default: "student", 
      enum: ["student"] 
    }
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
