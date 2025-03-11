import mongoose from "mongoose";
import CryptoJS from "crypto-js";


const MessageSchema = new mongoose.Schema(
  {
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    encrypted_content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Function to encrypt message
const encryptMessage = (content) => {
  return CryptoJS.AES.encrypt(content, process.env.ENCRYPTION_KEY).toString();
};

// Function to decrypt message
const decryptMessage = (encryptedContent) => {
  const bytes = CryptoJS.AES.decrypt(encryptedContent, process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Encrypt message before saving
MessageSchema.pre("save", function (next) {
  if (this.isModified("encrypted_content")) {
    this.encrypted_content = encryptMessage(this.encrypted_content);
  }
  next();
});

// Method to decrypt messages when retrieving
MessageSchema.methods.getDecryptedContent = function () {
  return decryptMessage(this.encrypted_content);
};

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
