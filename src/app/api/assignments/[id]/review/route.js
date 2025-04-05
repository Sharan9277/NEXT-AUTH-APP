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
    console.log("Received assignment id =", id);

    const { amount } = await req.json();
    if (!amount || isNaN(parseFloat(amount))) {
      return NextResponse.json({ message: "Valid amount is required" }, { status: 400 });
    }

    // Fetch assignment
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
    }

    if (!assignment.student_id) {
      return NextResponse.json({ message: "Student ID missing in assignment" }, { status: 400 });
    }

    // Find student
    const student = await Student.findOne({ user_id: assignment.student_id });
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Find user associated with student
    const user = await User.findById(student.user_id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate transaction reference
    const transactionRef = `ASSIGNMENT-${crypto.randomUUID()}`;

    // Prepare Payment Request Payload
    const payload = {
      transactionReference: transactionRef,
      merchant: { entity: process.env.WORLDPAY_MERCHANT_CODE },
      narrative: { line1: "Assignment Payment" },
      value: { currency: "USD", amount: amount * 100 }, // Convert to cents
      resultURLs: {
        successURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify-assignment?ref=${transactionRef}&assignment_id=${id}&status=success&student_id=${assignment.student_id}&amount=${amount}`,
        failureURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify-assignment?ref=${transactionRef}&assignment_id=${id}&status=failed`,
        cancelURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify-assignment?ref=${transactionRef}&assignment_id=${id}&status=canceled`
      }
    };

    console.log("Payment payload:", payload);
    console.log("Sending payment request to Worldpay...");

    // Send Payment Request to payment gateway
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

    console.log("Payment response:", response);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, message: "Payment initiation failed", error: data }, { status: 400 });
    }

    // Store Transaction
    const Transaction = mongoose.model('Transaction');
    await Transaction.create({
      user_id: assignment.student_id,
      type: "debit",
      amount,
      method: "card",
      status: "pending",
      reference_id: transactionRef,
      metadata: { assignment_id: id, type: "assignment", amount }
    });

    // Update assignment status to indicate review is complete
    assignment.status = "under_review";
    assignment.admin_reviewed = true;
    await assignment.save();

    // Send email with payment link
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Assignment Payment Required",
      html: `
        <p>Your assignment has been reviewed. The payment amount is ₹${amount}.</p>
        <p>Please use the link below to make the payment:</p>
        <a href="${data.url}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Pay Now</a>
        <p>Once payment is complete, your assignment will be processed further.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Review notification email with payment link sent to:", user.email);

    return NextResponse.json({ 
      message: "Assignment reviewed and payment link sent.",
      paymentUrl: data.url 
    }, { status: 200 });
  } catch (error) {
    console.error("Error reviewing assignment:", error);
    return NextResponse.json({ message: "Error reviewing assignment.", error: error.message }, { status: 500 });
  }
}