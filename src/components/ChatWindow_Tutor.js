import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import Image from "next/image";

const ChatWindow = ({ userId, selectedUserId, selectedUserName, selectedUserImage, onClose, resetSelection }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (!selectedUserId) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/get-message?sender_id=${userId}&recipient_id=${selectedUserId}`);
                const data = await res.json();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER });
        const channel = pusher.subscribe(`chat-${userId}`);

        channel.bind("new-message", (data) => {
            if (data.sender_id === selectedUserId) {
                setMessages(prev => [...prev, data]);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [selectedUserId, userId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        await fetch("/api/send-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender_id: userId, recipient_id: selectedUserId, message: newMessage })
        });

        setMessages(prev => [...prev, { sender_id: userId, decrypted_content: newMessage }]);
        setNewMessage("");
    };

    const handleClose = () => {
        resetSelection();
        onClose();
    };

    return (
        <div className="w-full flex flex-col bg-white border rounded-lg shadow-md h-full">
            {/* ✅ Top Bar with Profile Image, Name, Close Button */}
            <div className="flex items-center justify-between bg-[#5577d1] px-4 py-3 border-b">
                <div className="flex items-center space-x-3">
                <img
                        src={selectedUserImage || "/default-profile.png"} 
                        width={40} 
                        height={40} 
                        className="object-cover rounded-full w-[40px] h-[40px]" 
                        alt={selectedUserName} 
                    />
                    <h2 className="text-lg font-bold">{selectedUserName}</h2>
                </div>
                <button 
                    onClick={handleClose} 
                    className="text-white hover:text-red-500 text-lg font-bold"
                >
                    ✕
                </button>
            </div>

            {/* ✅ Chat Messages (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ maxHeight: "480px" }}>
            {messages.map((msg, i) => (
                <div 
                    key={i} 
                    className={`flex w-full my-1 ${
                        msg.sender_id === userId ? "justify-end" : "justify-start"
                    }`}
                >
                    <div 
                        className={`px-4 py-2 rounded-lg text-white text-sm break-words shadow-md ${
                            msg.sender_id === userId 
                                ? "bg-[#ED6C43] text-right"
                                : "bg-[#5577d1] text-left"
                        }`}
                        style={{ maxWidth: "max-content", wordWrap: "break-word" }}
                    >
                        {msg.decrypted_content || "[Message Error]"}
                    </div>
                </div>
            ))}
            </div>

            {/* ✅ Fixed Message Input Box */}
            <div className="border-t p-4 bg-white flex items-center">
                <input 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none"
                />
                <button 
                    onClick={sendMessage} 
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
