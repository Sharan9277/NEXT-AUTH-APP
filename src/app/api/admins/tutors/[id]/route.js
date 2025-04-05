import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Tutor from "@/models/Tutor";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Review from "@/models/Review";
import mongoose from "mongoose";


// -------- PUT --------
export async function PUT(req, { params }) {
  await connectToDatabase();

  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "Invalid tutor ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const tutor = await Tutor.findById(id);
    if (!tutor) {
      return NextResponse.json({ success: false, message: "Tutor not found" }, { status: 404 });
    }

    // Update user email if provided
    if (body.email && tutor.user_id) {
      await User.findByIdAndUpdate(tutor.user_id, { email: body.email });
    }

    // Update tutor details
    const updated = await Tutor.findByIdAndUpdate(
      id,
      {
        ...body,
        hourly_rate: parseFloat(body.hourly_rate),
        monthly_rate: parseFloat(body.monthly_rate),
        updated_at: new Date(),
      },
      { new: true }
    ).lean();

    if (updated?.user_id) {
      const user = await User.findById(updated.user_id).lean();
      if (user) updated.user_id = user;
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT tutor error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// -------- DELETE --------
export async function DELETE(req, { params }) {
  await connectToDatabase();

  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "Invalid tutor ID" }, { status: 400 });
  }

  try {
    const tutor = await Tutor.findById(id);
    if (!tutor) {
      return NextResponse.json({ success: false, message: "Tutor not found" }, { status: 404 });
    }

    await Tutor.findByIdAndDelete(id);
    await Booking.deleteMany({ tutor_id: id });
    await Review.deleteMany({ tutor_id: id });

    // Optional: Delete associated user account
    // await User.findByIdAndDelete(tutor.user_id);

    return NextResponse.json({ success: true, message: "Tutor deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE tutor error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
