import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import User from "@/models/User";
import Student from "@/models/Student";
import transporter from "@/lib/nodemailer";

export async function POST(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    console.log("Received id =", id);

    const { amount } = await req.json();

    // ✅ Fetch assignment without populate
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
    }

    console.log("Raw Assignment:", assignment);

    if (!assignment.student_id) {
      return NextResponse.json({ message: "Student ID missing in assignment" }, { status: 400 });
    }

    // ✅ Update assignment details
    assignment.price = amount;
    assignment.status = "pending";
    assignment.admin_reviewed = true;
    await assignment.save();

    // ✅ Find student directly using `student_id`
    const student = await Student.findOne({user_id: assignment.student_id});
    console.log(student);
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const user = await User.findById(student.user_id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Assignment Reviewed",
      text: `Your assignment has been reviewed. The new payment amount is ₹${amount}.`
    };

    await transporter.sendMail(mailOptions);
    console.log("Review notification email sent");

    return NextResponse.json({ message: "Assignment reviewed and payment amount updated." }, { status: 200 });
  } catch (error) {
    console.error("Error reviewing assignment:", error);
    return NextResponse.json({ message: "Error reviewing assignment.", error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await connectToDatabase();
  
  const { id } = params; // Extract assignment ID from URL
  const { status, price } = await req.json();

  try {
    const updateData = {};
    if (status) updateData.status = status;
    if (price) updateData.price = Number(price); // Ensure price is stored as a number

    const updatedAssignment = await Assignment.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedAssignment) {
      return new Response(JSON.stringify({ message: "Assignment not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Assignment updated successfully", assignment: updatedAssignment }), { status: 200 });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}