import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Assignment from "@/models/Assignment";

// ✅ API: GET /api/tutors/[id]/earnings
export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        const tutor_id = params.id; // ✅ Extract tutor_id from URL

        if (!tutor_id) {
            return NextResponse.json({ success: false, message: "Tutor ID is required" }, { status: 400 });
        }

        // ✅ Fetch Income from Lessons (Bookings with payment_status: "paid")
        const lessonIncome = await Booking.find({ tutor_id, payment_status: "paid" }, "amount");

        // ✅ Fetch Income from Assignments (Assignments with payment_status: "paid" and assigned to this tutor)
        const assignmentIncome = await Assignment.find({ assigned_to: tutor_id, payment_status: "paid" }, "amount");

        // ✅ Calculate Total Earnings
        const incomeFromLessons = lessonIncome.reduce((total, booking) => total + booking.amount, 0);
        const incomeFromAssignments = assignmentIncome.reduce((total, assignment) => total + assignment.amount, 0);
        const totalIncome = incomeFromLessons + incomeFromAssignments;

        return NextResponse.json({
            success: true,
            tutor_id,
            totalIncome,
            incomeFromLessons,
            incomeFromAssignments
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching tutor earnings:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
