import { NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params; // Student ID from the URL

    // Find the student based on user_id
    const student = await Student.findOne({ user_id: id });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Fetch assignments belonging to this student
    const assignments = await Assignment.find({ student_id: id });

    // Process assignments to include tutor details
    const updatedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const tutor = await Tutor.findById(assignment.assigned_to);

        return {
          ...assignment.toObject(),
          assigned_to: tutor ? { _id: tutor._id, name: tutor.name, email: tutor.email } : null,
        };
      })
    );

    return NextResponse.json({ assignments: updatedAssignments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student assignments:", error);
    return NextResponse.json(
      { message: "Failed to fetch assignments", error: error.message },
      { status: 500 }
    );
  }
}
