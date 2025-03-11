import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Message from "@/models/Message";

export async function PUT(req) {
    try {
        await connectToDatabase();
        
        const { recipient_id, sender_id } = await req.json();

        if (!recipient_id || !sender_id) {
            return NextResponse.json({ error: "Missing recipient_id or sender_id" }, { status: 400 });
        }

        const updatedMessages = await Message.updateMany(
            { recipient_id, sender_id, is_read: false },
            { $set: { is_read: true } }
        );

        if (updatedMessages.modifiedCount === 0) {
            return NextResponse.json({ message: "No unread messages found" }, { status: 200 });
        }

        return NextResponse.json({ success: true, message: "Messages marked as read" });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
