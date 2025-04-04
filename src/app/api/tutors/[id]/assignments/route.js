import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import Student from "@/models/Student";
import User from "@/models/User";

export async function GET(request, context) {
  try {
    await connectToDatabase();

    const { id: tutorId } = context.params || {};
    console.log("Tutor ID extracted from params:", tutorId);

    if (!tutorId) {
      return NextResponse.json({ error: "Tutor ID is missing in route parameters" }, { status: 400 });
    }

    // Get all assignments for this tutor
    const assignments = await Assignment.find({
      assigned_to: tutorId,
      status: { $in: ["accepted", "completed"] }
    })
      .sort({ createdAt: -1 })
      .lean();

    // Prepare formatted assignments with manual fetch of Student & User
    const formattedAssignments = await Promise.all(assignments.map(async (assignment) => {
      let studentData = null;

      if (assignment.student_id) {
        const student = await Student.findOne({user_id: assignment.student_id}).lean();
        if (student && student.user_id) {
          const user = await User.findById(student.user_id).lean();
          studentData = {
            name: student.name || "",
            email: user?.email || ""
          };
        }
      }

      return {
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        price: assignment.price?.toString() || "0.00",
        deadline: assignment.deadline,
        file: assignment.file_url,
        status: assignment.status,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
        student: studentData
      };
    }));

    return NextResponse.json(formattedAssignments, { status: 200 });

  } catch (error) {
    console.error("Error fetching tutor assignments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
