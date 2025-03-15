import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
    lessons_per_week: { type: Number, enum: [1, 2, 3, 4, 5], required: true }, // ✅ Selectable plans
    renewal_date: { type: Date, required: true }, // ✅ Auto-renews monthly
    status: { type: String, enum: ["active", "canceled", "expired"], default: "active" },
    worldpay_subscription_id: { type: String, required: true }, // ✅ Store WorldPay Subscription ID
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
