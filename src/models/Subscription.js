import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    subscription_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    plan: { type: String, required: true }, // ✅ "Basic", "Pro", "Unlimited"
    amount: { type: mongoose.Types.Decimal128, required: true }, // ✅ Monthly charge
    status: { type: String, enum: ["active", "canceled", "expired"], default: "active" },
    next_billing_date: { type: Date, required: true },
    worldpay_subscription_id: { type: String, required: true }, // ✅ ID from Worldpay API
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
