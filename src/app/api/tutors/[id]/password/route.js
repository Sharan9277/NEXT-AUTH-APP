import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Tutor from "@/models/Tutor";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { oldPassword, newPassword } = await req.json();

    const tutor = await Tutor.findOne({ user_id: params.id });

    if (!tutor) {
      return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
    }

    const user = await User.findById(tutor.user_id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ message: "Error updating password", error: error.message }, { status: 500 });
  }
}
