import mongoose from "mongoose";

const TutorAvailabilitySchema = new mongoose.Schema(
  {
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
    availability: [
      {
        day: { type: String, required: true }, // Example: "Sunday"
        slots: [{ type: String, required: true }] // Example: ["2:00 PM", "3:00 PM", "4:00 PM"]
      }
    ],
    blocked_dates: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.TutorAvailability || mongoose.model("TutorAvailability", TutorAvailabilitySchema);
