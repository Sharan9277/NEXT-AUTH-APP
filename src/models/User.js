import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "tutor", "admin"], default: "student" },
  wallet_balance: { 
    type: mongoose.Types.Decimal128, 
    default: 0.00,
    get: (v) => v.toString(),
  },
  
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
