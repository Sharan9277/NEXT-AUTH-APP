// /app/api/assignments/[assignmentId]/solution/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    const { assignmentId } = params;
    const { solution_url, status, tutorId } = await request.json();

    if (!solution_url || !tutorId) {
      return NextResponse.json({ error: "Solution URL and tutorId are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Verify the assignment exists
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Check if the assignment is assigned to this tutor
    if (!assignment.assigned_to || assignment.assigned_to.toString() !== tutorId) {
      return NextResponse.json({ error: "You are not authorized to update this assignment" }, { status: 403 });
    }

    // Update the assignment with the solution URL and mark as completed
    assignment.solution_url = solution_url;
    assignment.status = status || "completed";
    assignment.completed_at = new Date();

    await assignment.save();

    return NextResponse.json({
      message: "Solution submitted successfully",
      assignment: assignment,
    });
  } catch (error) {
    console.error("Error submitting solution:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
