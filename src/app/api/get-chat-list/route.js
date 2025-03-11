import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Message from "@/models/Message";
import User from "@/models/User";
import Tutor from "@/models/Tutor";
import Student from "@/models/Student";
import CryptoJS from "crypto-js";

export async function GET(req) {
    try {
        await connectToDatabase();
        
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id");

        if (!user_id) {
            return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
        }

        // Find all unique users this user has messaged with
        const messages = await Message.find({
            $or: [{ sender_id: user_id }, { recipient_id: user_id }]
        }).sort({ timestamp: -1 });

        const userMap = new Map();

        for (const msg of messages) {
            const otherUserId = msg.sender_id.toString() === user_id ? msg.recipient_id.toString() : msg.sender_id.toString();
            
            if (!userMap.has(otherUserId)) {
                userMap.set(otherUserId, { 
                    lastMessage: msg.encrypted_content, 
                    lastTimestamp: msg.timestamp, 
                    unreadCount: 0 
                });
            }

            if (!msg.is_read && msg.recipient_id.toString() === user_id) {
                userMap.get(otherUserId).unreadCount += 1;
            }
        }

        const chatList = await Promise.all(
            [...userMap.keys()].map(async (userId) => {
                let user = null;
                let profileImage = "";

                // **1️⃣ First Check in Student Model**
                const student = await Student.findOne({ user_id: userId }).select("name profile_image");
                if (student) {
                    user = student;
                    profileImage = student.profile_image || "";
                } else {
                    // **2️⃣ If Not Found, Check in Tutor Model**
                    const tutor = await Tutor.findOne({ user_id: userId }).select("name profile_image");
                    if (tutor) {
                        user = tutor;
                        profileImage = tutor.profile_image || "";
                    } else {
                        // **3️⃣ If Still Not Found, Check in User Model**
                        const userData = await User.findById(userId).select("name");
                        if (userData) {
                            user = userData;
                        }
                    }
                }

                if (!profileImage || profileImage.trim() === "") {
                    profileImage = "/default-profile.png"; // Use a placeholder profile image
                }

                // **If user still not found, set default values**
                if (!user) {
                    user = { name: "Unknown User" };
                    profileImage = "";
                }

                // **Decrypt the last message**
                const lastMessageEncrypted = userMap.get(userId).lastMessage;
                let lastMessage = "";
                try {
                    const bytes = CryptoJS.AES.decrypt(lastMessageEncrypted, process.env.ENCRYPTION_KEY);
                    lastMessage = bytes.toString(CryptoJS.enc.Utf8);
                } catch (error) {
                    lastMessage = "[Unable to decrypt]";
                }

                const isArchived = false; // Later, implement archive system

                return {
                    user_id: userId,
                    name: user.name || "Unknown User",
                    profileImage,
                    lastMessage,
                    lastTimestamp: userMap.get(userId).lastTimestamp,
                    unreadCount: userMap.get(userId).unreadCount,
                    isArchived
                };
            })
        );

        return NextResponse.json(chatList);
    } catch (error) {
        console.error("Error fetching chat list:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
