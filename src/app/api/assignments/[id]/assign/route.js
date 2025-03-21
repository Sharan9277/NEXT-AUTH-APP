import { connectToDatabase } from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import Tutor from "@/models/Tutor";

export async function POST(req, { params }) {
  await connectToDatabase();

  const { id } = params; // Extract assignment ID from URL
  const { tutor_id } = await req.json(); // Extract tutor ID from request body

  if (!tutor_id) {
    return new Response(JSON.stringify({ message: "Tutor ID is required" }), { status: 400 });
  }

  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { assigned_to: tutor_id },
      { new: true }
    );

    if (!updatedAssignment) {
      return new Response(JSON.stringify({ message: "Assignment not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Tutor assigned successfully", assignment: updatedAssignment }), { status: 200 });
  } catch (error) {
    console.error("Error assigning tutor:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
