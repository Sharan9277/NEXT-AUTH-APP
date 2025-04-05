import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import Tutor from "@/models/Tutor";
import User from "@/models/User";

export async function PUT(req, { params }) {
  await connectToDatabase();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "Invalid tutor ID" }, { status: 400 });
  }

  try {
    const { isAdminVerified } = await req.json();

    // Update verification fields
    await Tutor.findByIdAndUpdate(id, {
      isAdminVerified: !!isAdminVerified,
      admin_verified_at: isAdminVerified ? new Date() : null,
    });

    // Get updated tutor
    const updatedTutor = await Tutor.findById(id).lean();

    if (!updatedTutor) {
      return NextResponse.json({ success: false, message: "Tutor not found" }, { status: 404 });
    }

    // Fetch associated user data
    if (updatedTutor.user_id) {
      const user = await User.findById(updatedTutor.user_id).lean();
      if (user) {
        updatedTutor.user_id = user;
      }
    }

    return NextResponse.json(updatedTutor, { status: 200 });
  } catch (error) {
    console.error("Error updating admin verification:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
