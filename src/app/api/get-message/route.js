import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Message from "@/models/Message";

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const sender_id = searchParams.get("sender_id");
        const recipient_id = searchParams.get("recipient_id");

        if (!sender_id || !recipient_id) {
            return NextResponse.json({ error: "Missing sender_id or recipient_id" }, { status: 400 });
        }

        // ✅ Fix: Retrieve messages in correct order
        const messages = await Message.find({
            $or: [
                { sender_id, recipient_id },
                { sender_id: recipient_id, recipient_id: sender_id }
            ]
        }).sort({ timestamp: 1 }); // ✅ Ensures messages are shown in chronological order

        // ✅ Use Model's Decryption Method
        const decryptedMessages = messages.map((msg) => ({
            ...msg.toObject(),
            decrypted_content: msg.getDecryptedContent()
        }));
        console.log("Decrypted Messages:", decryptedMessages);
        return NextResponse.json(decryptedMessages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
