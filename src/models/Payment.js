import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    payment_id: { type: String, unique: true, required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Pending", "Failed"], default: "Pending" },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
