import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Assignment from "@/models/Assignment";
import User from "@/models/User";
import transporter from "@/lib/nodemailer";

export async function GET(req) {
    try {
        await connectToDatabase();
        
        const url = new URL(req.url);
        const transactionRef = url.searchParams.get("ref");
        const assignment_id = url.searchParams.get("assignment_id");
        const paymentStatus = url.searchParams.get("status");
        const student_id = url.searchParams.get("student_id");
        const amount = parseFloat(url.searchParams.get("amount")) || 0;

        console.log("Verifying payment:", { transactionRef, assignment_id, paymentStatus, student_id, amount });

        if (!transactionRef || !assignment_id) {
            return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 });
        }

        // Find Transaction
        const transaction = await Transaction.findOne({ reference_id: transactionRef });

        if (!transaction) {
            console.log("Transaction not found for reference:", transactionRef);
            return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 });
        }

        // Find Assignment
        const assignment = await Assignment.findById(assignment_id);
        if (!assignment) {
            console.log("Assignment not found:", assignment_id);
            return NextResponse.json({ success: false, message: "Assignment not found" }, { status: 404 });
        }

        // Check if student_id is available, if not use assignment.student_id
        const actualStudentId = student_id || assignment.student_id;
        
        if (paymentStatus === "success") {
            console.log("Payment successful, updating assignment and transaction");
            
            // Update Assignment status
            assignment.payment_status = "paid";
            assignment.status = "accepted"; // Changed from pending_tutor_assignment to match your UI states
            await assignment.save();

            // Update Transaction status
            transaction.status = "success";
            await transaction.save();

            // Send confirmation email to student
            try {
                const student = actualStudentId ? await User.findById(actualStudentId) : null;
                if (student && student.email) {
                    const studentMailOptions = {
                        from: process.env.EMAIL_USER,
                        to: student.email,
                        subject: "Assignment Payment Successful",
                        html: `
                            <p>Your payment for the assignment was successful.</p>
                            <p>Assignment ID: ${assignment_id}</p>
                            <p>Amount Paid: ₹${amount}</p>
                            <p>A tutor will be assigned to your assignment soon by our admin team.</p>
                        `
                    };
                    
                    await transporter.sendMail(studentMailOptions);
                    console.log("Student confirmation email sent to:", student.email);
                }
            } catch (emailError) {
                console.error("Error sending student confirmation email:", emailError);
                // Continue execution despite email error
            }

            // Notify admin about payment
            try {
                const adminEmail = process.env.ADMIN_EMAIL || "admin@assigntutors.com";
                const adminMailOptions = {
                    from: process.env.EMAIL_USER,
                    to: adminEmail,
                    subject: "New Assignment Payment Received",
                    html: `
                        <p>A new assignment payment has been received.</p>
                        <p>Assignment ID: ${assignment_id}</p>
                        <p>Student ID: ${actualStudentId || "Unknown"}</p>
                        <p>Amount: ₹${amount}</p>
                        <p>Please assign a tutor to this assignment.</p>
                    `
                };
                
                await transporter.sendMail(adminMailOptions);
                console.log("Admin notification email sent to:", adminEmail);
            } catch (emailError) {
                console.error("Error sending admin notification email:", emailError);
                // Continue execution despite email error
            }

            // If student_id is not available, redirect to login page with success message and assignment ID
            if (!student_id) {
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login/student?payment=success&assignment_id=${assignment_id}`);
            }
            
            // Otherwise redirect to student dashboard with success message
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/student/${actualStudentId}?payment=assignment-success`);
        } else {
            // Payment Failed
            console.log("Payment failed, updating transaction");
            
            transaction.status = "failed";
            await transaction.save();

            // Notify student about failed payment if we have their info
            try {
                const student = actualStudentId ? await User.findById(actualStudentId) : null;
                if (student && student.email) {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: student.email,
                        subject: "Assignment Payment Failed",
                        html: `
                            <p>Your payment for the assignment was not successful.</p>
                            <p>Assignment ID: ${assignment_id}</p>
                            <p>Please try again or contact support if you need assistance.</p>
                        `
                    };
                    
                    await transporter.sendMail(mailOptions);
                    console.log("Payment failure email sent to:", student.email);
                }
            } catch (emailError) {
                console.error("Error sending payment failure email:", emailError);
                // Continue execution despite email error
            }

            // If student_id is not available, redirect to login page with failure message
            if (!student_id) {
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login/student?payment=failed&assignment_id=${assignment_id}`);
            }
            
            // Otherwise redirect to student dashboard with failure message
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/student/${actualStudentId}?payment=assignment-failed`);
        }
    } catch (error) {
        console.error("Error verifying assignment payment:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}