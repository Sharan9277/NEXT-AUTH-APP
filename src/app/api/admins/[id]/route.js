import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import mongoose from "mongoose"; // ✅ Import for ObjectId conversion

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } =await params;

    console.log("Fetching admin data for ID:", id);

    // ✅ Convert to ObjectId if it's a valid MongoDB ID
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    const queryId = isValidObjectId ? new mongoose.Types.ObjectId(id) : id;

    console.log("Querying Admin with ID:", queryId);

    const admin = await Admin.findOne({ user_id: queryId }).select(
      "name profile_image"
    );
    
    console.log("Admin Data from DB:", admin);

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}


