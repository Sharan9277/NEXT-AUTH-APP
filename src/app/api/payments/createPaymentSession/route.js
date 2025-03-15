import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import crypto from "crypto";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { user_id, amount, paymentType, slot_id, booking_type, date } = await req.json();

        if (!slot_id) {
            return NextResponse.json({ success: false, message: "Slot ID is required" }, { status: 400 });
        }

        // ✅ Generate a unique transaction reference
        const transactionRef = `ORDER-${crypto.randomUUID()}`;

        // ✅ Prepare Payment Request Payload
        const payload = {
            transactionReference: transactionRef,
            merchant: { entity: process.env.WORLDPAY_MERCHANT_CODE },
            narrative: { line1: "AssignTutors Payment" },
            value: { currency: "USD", amount: amount * 100 }, // Convert to cents
            resultURLs: {
                successURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify?ref=${transactionRef}&slot_id=${slot_id}&status=success`,
                failureURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify?ref=${transactionRef}&slot_id=${slot_id}&status=failed`,
                cancelURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify?ref=${transactionRef}&slot_id=${slot_id}&status=canceled`
            }
        };

        // ✅ Send Payment Request to Worldpay
        const authHeader = Buffer.from(`${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`).toString("base64");
        const response = await fetch("https://try.access.worldpay.com/payment_pages", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authHeader}`,
                "Accept": "application/vnd.worldpay.payment_pages-v1.hal+json",
                "Content-Type": "application/vnd.worldpay.payment_pages-v1.hal+json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        console.log("✅ Creating Transaction with Data:", {
            user_id,
            amount,
            paymentType,
            slot_id,
            booking_type,
            date,
        });

        if (!response.ok) {
            return NextResponse.json({ success: false, message: "Payment initiation failed", error: data }, { status: 400 });
        }

        // ✅ Store Transaction in Database (Pending)
        const transaction = await Transaction.create({
            user_id,
            type: "debit",
            amount,
            method: paymentType,
            status: "pending",
            reference_id: transactionRef,
            metadata: { slot_id, booking_type, date } // ✅ Store slot_id in metadata
        });

        console.log("✅ Transaction Created Successfully:", transaction);


        return NextResponse.json({ message: "Success", success: true, redirectUrl: data.url }, { status: 200 });

    } catch (error) {
        console.error("Error creating payment session:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
