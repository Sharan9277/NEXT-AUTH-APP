// /mnt/data/AssignTutorss/src/models/Assignment.js
import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    file_url: { type: String, required: true }, // URL to the uploaded file
    payment_status: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    payment_link: { type: String, default: "" }, // Payment link for the assignment
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", default: null }, // Assigned tutor
    status: { type: String, enum: ["under_review", "pending", "accepted", "rejected", "completed"], default: "under_review" },
    price: { type: mongoose.Types.Decimal128, default: 0.00 }, // Amount for the assignment
    admin_reviewed: { type: Boolean, default: false }, // Flag to indicate if admin reviewed
  },
  { timestamps: true }
);

export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);
