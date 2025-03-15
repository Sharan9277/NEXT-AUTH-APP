import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Tutor from "@/models/Tutor";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const updatedData = await req.json();

    console.log("Updating Tutor Profile for User ID:", id);
    console.log("Received Data:", updatedData);

    const tutor = await Tutor.findOne({ user_id: id });

    if (!tutor) {
      return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
    }

    // ✅ Prevent storing empty profile images & resumes
    if (updatedData.profile_image && updatedData.profile_image.startsWith("data:image/")) {
      tutor.profile_image = updatedData.profile_image;
    }
    if (updatedData.resume && updatedData.resume.startsWith("data:application/")) {
      tutor.resume = updatedData.resume;
    }

        // ✅ Explicitly update hourly_rate and monthly_rate if provided
        if (updatedData.hourly_rate !== undefined) {
          tutor.hourly_rate = Number(updatedData.hourly_rate) || 0;
        }
        if (updatedData.monthly_rate !== undefined) {
          tutor.monthly_rate = Number(updatedData.monthly_rate) || 0;
        }

    // ✅ Update other provided fields
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] !== undefined && updatedData[key] !== "") {
        tutor[key] = updatedData[key];
      }
    });

    await tutor.save();
    console.log("Tutor Updated Successfully:", tutor);

    return NextResponse.json({ message: "Tutor profile updated successfully!", tutor }, { status: 200 });
  } catch (error) {
    console.error("Error updating tutor profile:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
