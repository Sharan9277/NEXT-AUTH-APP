import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Booking from "@/models/Booking";
import TutorSlot from "@/models/TutorSlot";
import Subscription from "@/models/Subscription";
import User from "@/models/User";
import { format, addDays, startOfWeek, isBefore, parseISO } from "date-fns";
// Import the server-side Google Meet utility instead
import { createGoogleMeetLink } from "@/lib/googleMeetServer";

// Update your GET function in the route handler
export async function GET(req) {
    try {
        await connectToDatabase();
        
        const url = new URL(req.url);
        const transactionRef = url.searchParams.get("ref");
        const slot_id = url.searchParams.get("slot_id");
        const paymentStatus = url.searchParams.get("status");
        
        const student_id = url.searchParams.get("student_id");
        const tutor_id = url.searchParams.get("tutor_id");
        const lessons_per_week = parseInt(url.searchParams.get("lessons_per_week")) || 1;
        const amount = parseFloat(url.searchParams.get("amount")) || 0;

        if (!transactionRef || !slot_id) {
            return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 });
        }

        // Find Transaction
        const transaction = await Transaction.findOne({ reference_id: transactionRef });

        if (!transaction) {
            return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 });
        }

        const booking_type = transaction.metadata?.booking_type || "trial";
        
        const selectedDate = transaction.metadata?.date
            ? parseISO(transaction.metadata.date)
            : null;

        if (!selectedDate) {
            return NextResponse.json({ success: false, message: "Missing booking date" }, { status: 400 });
        }

        const selectedDay = format(selectedDate, "EEEE");
        
        // Find Tutor Slot
        const slot = await TutorSlot.findById(slot_id);

        if (!slot) {
            return NextResponse.json({ success: false, message: "Slot not found" }, { status: 404 });
        }
        
        // Get student and tutor details for meeting link
        const student = await User.findById(student_id).select('email name');
        const tutor = await User.findById(tutor_id).select('email name');

        if (paymentStatus === "success") {
            if (booking_type === "subscription") {
                // Create Subscription
                const newSubscription = await Subscription.create({
                    student_id,
                    tutor_id,
                    lessons_per_week,
                    renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    status: "active",
                    worldpay_subscription_id: transactionRef,
                });
        
                // Generate Lesson Dates for Subscription
                const lessons = [];
                const today = new Date();
                const threeMonthsLater = addDays(today, 30);
                let firstOccurrence = startOfWeek(today, { weekStartsOn: 0 });
        
                while (format(firstOccurrence, "EEEE") !== slot.day) {
                    firstOccurrence = addDays(firstOccurrence, 1);
                }
        
                let lessonDate = firstOccurrence;
                let count = 0;
                
                // Generate a meeting link for the first lesson using our server API
                const meetingLink = await createGoogleMeetLink({
                    date: format(selectedDate, "yyyy-MM-dd"),
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    booking_type,
                    studentName: student?.name,
                    tutorName: tutor?.name,
                    studentEmail: student?.email, // Add student email
                    tutorEmail: tutor?.email     // Add tutor email
                });
        
                while (isBefore(lessonDate, threeMonthsLater)) {
                    if (count >= lessons_per_week * 4) break;
        
                    lessons.push({
                        date: format(lessonDate, "yyyy-MM-dd"),
                        status: "Confirmed",
                    });
        
                    lessonDate = addDays(lessonDate, 7);
                    count++;
                }
        
                // Create Subscription Booking with meeting link
                const newBooking = await Booking.create({
                    student_id,
                    tutor_id,
                    slot_id: slot._id,
                    day: slot.day,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    status: "Confirmed",
                    payment_status: "paid",
                    booking_type: "subscription",
                    amount,
                    lesson_statuses: lessons,
                    meeting_link: meetingLink || "" // Add the meeting link
                });
        
                // Update Tutor's Wallet Balance
                await User.findOneAndUpdate(
                    { _id: tutor_id },
                    { $inc: { wallet_balance: amount } }
                );
        
                transaction.status = "success";
                await transaction.save();
        
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/student/${student_id}?payment=subscription-success`);
            } else {
                // Generate a meeting link for individual or trial booking using our server API
                const meetingLink = await createGoogleMeetLink({
                    date: format(selectedDate, "yyyy-MM-dd"),
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    booking_type,
                    studentName: student?.name,
                    tutorName: tutor?.name,
                    studentEmail: student?.email, // Add student email
                    tutorEmail: tutor?.email     // Add tutor email
                });
                
                // Create Booking for Trial or Individual with meeting link
                const lessonStatus = [
                    {
                        date: format(selectedDate, "yyyy-MM-dd"),
                        status: "Confirmed",
                    },
                ];
        
                const newBooking = await Booking.create({
                    student_id: slot.student_id,
                    tutor_id: slot.tutor_id,
                    slot_id: slot._id,
                    day: selectedDay,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    status: "Confirmed",
                    payment_status: "paid",
                    booking_type,
                    amount,
                    lesson_statuses: lessonStatus,
                    meeting_link: meetingLink || "" // Add the meeting link
                });
        
                slot.is_booked = true;
                await slot.save();
        
                // Update Tutor's Wallet Balance
                await User.findOneAndUpdate(
                    { _id: slot.tutor_id },
                    { $inc: { wallet_balance: amount } }
                );
        
                transaction.status = "success";
                await transaction.save();
        
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/student/${newBooking.student_id}?payment=success`);
            }
        } else {
            // Payment Failed → Delete Slot & Cancel Subscription
            await TutorSlot.findByIdAndDelete(slot_id);
            if (booking_type === "subscription" || booking_type === "trial" || booking_type === "individual") {
                await Subscription.findOneAndUpdate({ student_id, tutor_id }, { status: "canceled" });
            }
        
            transaction.status = "failed";
            await transaction.save();
        
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/student/${student_id}?payment=failed`);
        }
        
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}