import { NextResponse } from "next/server";
import Transaction from "@/models/Transaction";
import User from "@/models/User"; // ✅ Import User Model
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
    await connectToDatabase();

    try {
        // ✅ Parse Webhook Data
        const event = await req.json();
        console.log("✅ Received Worldpay Webhook:", JSON.stringify(event, null, 2));

        // ✅ Extract Important Details
        const { eventId, eventTimestamp, eventDetails } = event;

        if (!eventDetails) {
            console.error("❌ Missing eventDetails in Webhook Data.");
            return NextResponse.json({ error: "Invalid Webhook Data" }, { status: 400 });
        }

        const { classification, downstreamReference, transactionReference, type, date, amount } = eventDetails;

        // ✅ Ensure amount field exists
        if (!amount || !amount.value) {
            console.error("❌ Missing or invalid amount value in eventDetails:", eventDetails);
            return NextResponse.json({ error: "Invalid amount value" }, { status: 400 });
        }

        console.log("✅ Extracted Event Details:", { type, transactionReference, amount });

        // ✅ Find User ObjectId using transactionReference
        const user = await User.findOne({ email: transactionReference }); // OR use { customUserId: transactionReference }
        if (!user) {
            console.error("❌ User not found for reference:", transactionReference);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log("✅ Found User:", user._id);

        // ✅ Process "sentForAuthorization" Event
        if (type === "sentForAuthorization") {
            console.log("✅ Processing sentForAuthorization event for transaction:", transactionReference);

            const newTransaction = new Transaction({
                user_id: user._id, // ✅ Now using the correct ObjectId
                type: "credit",
                amount: amount.value,
                method: "card",
                status: "pending", // Payment is still being authorized
                reference_id: downstreamReference, // Store Worldpay Reference ID
                transaction_date: date
            });

            await newTransaction.save();
            console.log("✅ Transaction successfully saved:", newTransaction);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Error processing Worldpay Webhook:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
