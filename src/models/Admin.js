import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Foreign Key
    admin_id: { type: String, unique: true, required: true }, // UUID or String
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ["Super Admin", "Support"] },
    permissions: { type: mongoose.Schema.Types.Mixed, default: {} }, // JSON-like structure
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
