import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Message from "@/models/Message";
import Booking from "@/models/Booking"; // Missing import
import Pusher from "pusher";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

export async function POST(req) {
    try {
        await connectToDatabase();
        
        const { sender_id, recipient_id, message, sender_role } = await req.json(); // Added sender_role
        
        if (!sender_id || !recipient_id || !message) { // Added message check
            return NextResponse.json({ error: "Missing sender_id, recipient_id, or message" }, { status: 400 });
        }
        
        const previousMessage = await Message.findOne({
            $or: [
                { sender_id, recipient_id },
                { sender_id: recipient_id, recipient_id: sender_id }
            ]
        });
        
        // ✅ If no previous messages exist, sender must be a student
        if (!previousMessage) {
            const hasBooking = await Booking.findOne({
                tutor_id: recipient_id,
                student_id: sender_id,
                status: ["Pending", "Confirmed", "Completed", "Cancelled"]
            });
            
            if (!hasBooking) {
                return NextResponse.json({ error: "You must have a booking with this tutor to message them." }, { status: 403 });
            }
            
            if (sender_role !== "student") {
                return NextResponse.json({ error: "Only students can initiate a chat with tutors." }, { status: 403 });
            }
        }
                
        // ✅ Use Model's Pre-Save Encryption
        const newMessage = new Message({
            sender_id,
            recipient_id,
            encrypted_content: message
        });
        
        await newMessage.save();
        
        // ✅ Send Pusher Event for Real-Time Updates
        await pusher.trigger(`chat-${recipient_id}`, "new-message", {
            sender_id,
            recipient_id,
            decrypted_content: message // Consider using a sanitized/safe version if needed
        });
        
        return NextResponse.json({ success: true, message: "Message sent!" });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}