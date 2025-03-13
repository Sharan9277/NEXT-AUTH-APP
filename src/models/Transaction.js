import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    transaction_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Who made the transaction
    type: { type: String, enum: ["credit", "debit"], required: true }, // ✅ "credit" for adding funds, "debit" for spending
    amount: { type: mongoose.Types.Decimal128, required: true }, // ✅ Amount involved
    method: { type: String, enum: ["wallet", "card", "subscription"], required: true }, // ✅ How the payment was made
    status: { type: String, enum: ["pending", "success", "failed", "refunded"], default: "pending" }, // ✅ Payment status
    reference_id: { type: String, default: null }, // ✅ Worldpay Transaction ID or Refund ID
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
