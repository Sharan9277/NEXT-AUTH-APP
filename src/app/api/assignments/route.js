import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import Assignment from "@/models/Assignment";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import transporter from '@/lib/nodemailer';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, name, description, file_url, phone } = await req.json();

    // ✅ Check if user already exists
    let user = await User.findOne({ email });
    const password = Math.random().toString(36).slice(-8); // Generate random password
    const newPassword = password;

    if (!user) {
    
      
      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // ✅ Create new user
      user = await User.create({ 
        email, 
        password: hashedPassword, 
        role: "student" 
      });

      // ✅ Create new student profile with UUID
      await Student.create({
        user_id: user._id,
        student_id: uuidv4(),
        name,
        phone,
        isVerified: false
      });

      console.log("New student user created");
    }

    // ✅ Ensure student profile exists
    let studentProfile = await Student.findOne({ user_id: user._id });
    if (!studentProfile) {
      return NextResponse.json({ message: "Student profile not found" }, { status: 404 });
    }

    // ✅ Create assignment entry (matching schema)
    const newAssignment = await Assignment.create({
      student_id: studentProfile.user_id, // Reference to Student model
      description,
      file_url,
      payment_status: "unpaid",
      assigned_to: null, // No tutor assigned initially
      status: "under_review",
      price: 0.00, // Admin will update price
      admin_reviewed: false
    });

    // ✅ Send email confirmation
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Assignment Submission Confirmation',
      text: `Your assignment has been submitted successfully. We will notify you once it is reviewed. PLease sign in to check the status. Use the following credentials to sign in: Email: ${email}, Password: ${newPassword}`,
    };
    console.log("Password:", newPassword);

    await transporter.sendMail(mailOptions);
    console.log("Assignment submission email sent");

    return NextResponse.json({ assignment: newAssignment }, { status: 201 });
  } catch (error) {
    console.error("Error during assignment submission:", error);
    return NextResponse.json({ message: "Assignment submission failed", error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch assignments without population
    let assignments = await Assignment.find();

    // Process each assignment to replace student_id and tutor_id with actual details
    const updatedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        // Find student details using student_id
        const student = await Student.findOne({ user_id: assignment.student_id });
        const tutor = await Tutor.findById(assignment.assigned_to);

        return {
          ...assignment.toObject(),
          student_id: student ? { name: student.name, email: student.email } : null,
          assigned_to: tutor ? { name: tutor.name, email: tutor.email } : null,
        };
      })
    );

    return NextResponse.json({ assignments: updatedAssignments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { message: "Failed to fetch assignments", error: error.message },
      { status: 500 }
    );
  }
}

