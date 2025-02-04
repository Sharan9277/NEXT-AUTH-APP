import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    message_id: { type: String, unique: true, required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
