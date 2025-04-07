import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import User from "@/models/User";
import Student from "@/models/Student";
import transporter from "@/lib/nodemailer";
import crypto from "crypto";

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

    // ✅ Generate a unique transaction reference for the assignment payment
    const transactionRef = `ASSIGNMENT-${crypto.randomUUID()}`;

    // ✅ Prepare Payment Request Payload for Worldpay
    const payload = {
      transactionReference: transactionRef,
      merchant: { entity: process.env.WORLDPAY_MERCHANT_CODE },
      narrative: { line1: "AssignTutors Assignment Payment" },
      value: { currency: "USD", amount: amount * 100 }, // Convert to cents
      resultURLs: {
        successURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify-assignment?ref=${transactionRef}&assignment_id=${id}&status=success&student_id=${assignment.student_id}&amount=${amount}`,
        failureURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify-assignment?ref=${transactionRef}&assignment_id=${id}&status=failed`,
        cancelURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify-assignment?ref=${transactionRef}&assignment_id=${id}&status=canceled`
      }
    };

    // ✅ Send Payment Request to Worldpay
    const authHeader = Buffer.from(`${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`).toString("base64");
    const response = await fetch("https://access.worldpay.com/payment_pages", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Accept": "application/vnd.worldpay.payment_pages-v1.hal+json",
        "Content-Type": "application/vnd.worldpay.payment_pages-v1.hal+json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, message: "Payment initiation failed", error: data }, { status: 400 });
    }

    // ✅ Store Transaction in Database (Pending) - assuming you have Transaction model
    const Transaction = mongoose.model('Transaction');
    const transaction = await Transaction.create({
      user_id: assignment.student_id,
      type: "debit",
      amount,
      method: "card",
      status: "pending",
      reference_id: transactionRef,
      metadata: { assignment_id: id, type: "assignment", amount }
    });

    console.log("✅ Assignment Transaction Created Successfully:", transaction);

    // ✅ Send email notification with payment link
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Assignment Reviewed",
      html: `
        <p>Your assignment has been reviewed. The payment amount is ₹${amount}.</p>
        <p>Please use the link below to make the payment:</p>
        <a href="${data.url}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Pay Now</a>
        <p>Once payment is complete, your assignment status will be updated.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Review notification email with payment link sent");

    return NextResponse.json({ 
      message: "Assignment reviewed and payment link sent.",
      paymentUrl: data.url 
    }, { status: 200 });
  } catch (error) {
    console.error("Error reviewing assignment:", error);
    return NextResponse.json({ message: "Error reviewing assignment.", error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await connectToDatabase();
  
  const { id } = params; // Extract assignment ID from URL
  const { status, price, title, description } = await req.json();

  try {
    const updateData = {};
    if (status) updateData.status = status;
    if (price) updateData.price = Number(price); // Ensure price is stored as a number
    if (title) updateData.title = title;
    if (description) updateData.description = description;

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