import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Assignment from "@/models/Assignment";
import { startOfDay, subDays, subMonths, format } from "date-fns";

export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        const { id } = params;
        const url = new URL(req.url);
        const range = url.searchParams.get("range") || "7days";

        let startDate;
        if (range === "30days") {
            startDate = subDays(new Date(), 30);
        } else if (range === "6months") {
            startDate = subMonths(new Date(), 6);
        } else {
            startDate = subDays(new Date(), 7);
        }

        // Initialize earnings map
        const earningsMap = new Map();

        // Fetch lesson earnings
        const lessonEarnings = await Booking.find({
            tutor_id: id,
            payment_status: "paid",
            createdAt: { $gte: startDate },
        });

        lessonEarnings.forEach((booking) => {
            const dateKey = format(startOfDay(booking.createdAt), "yyyy-MM-dd");
            earningsMap.set(dateKey, (earningsMap.get(dateKey) || 0) + booking.amount);
        });

        // Fetch assignment earnings
        const assignmentEarnings = await Assignment.find({
            tutor_id: id,
            payment_status: "paid",
            createdAt: { $gte: startDate },
        });

        assignmentEarnings.forEach((assignment) => {
            const dateKey = format(startOfDay(assignment.createdAt), "yyyy-MM-dd");
            earningsMap.set(dateKey, (earningsMap.get(dateKey) || 0) + assignment.amount);
        });

        // Prepare data for chart
        const sortedDates = Array.from(earningsMap.keys()).sort();
        const values = sortedDates.map((date) => earningsMap.get(date));

        return NextResponse.json({ success: true, labels: sortedDates, values }, { status: 200 });
    } catch (error) {
        console.error("Error fetching chart data:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
