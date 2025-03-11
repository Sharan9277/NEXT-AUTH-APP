import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import Image from "next/image";

const ChatWindow = ({ userId, userRole, selectedUserId, selectedUserName, selectedUserImage, onClose, resetSelection  }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [canSend, setCanSend] = useState(false);

    useEffect(() => {
        if (!selectedUserId) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/get-message?sender_id=${userId}&recipient_id=${selectedUserId}`);
                const data = await res.json();
                setMessages(data);
                setCanSend(data.length > 0 || userRole === "student"); // ✅ Fix: Allow students to initiate chat
                
                // ✅ Fix: Automatically mark messages as read when chat is opened
                await fetch("/api/mark-read", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ recipient_id: userId, sender_id: selectedUserId })
                });
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER });
        const channel = pusher.subscribe(`chat-${userId}`);

        // ✅ Fix: Prevent duplicate messages by checking if it already exists
        channel.bind("new-message", (data) => {
            if (data.sender_id === selectedUserId) {
                setMessages(prev => {
                    const messageExists = prev.some(msg => msg._id === data._id);
                    setCanSend(true);
                    return messageExists ? prev : [...prev, data];
                });
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [selectedUserId, userId, userRole]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return; // ✅ Prevent sending empty messages

        const messageData = { sender_id: userId, recipient_id: selectedUserId, message: newMessage };

        await fetch("/api/send-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageData)
        });

        // ✅ Fix: Immediately update UI for sender
        setMessages(prev => [...prev, { ...messageData, decrypted_content: newMessage }]);

        setNewMessage("");
    };

    
    const handleClose = () => {
        resetSelection();
        onClose();
    };


    return (
        <div className="h-full flex flex-col bg-white p-4">
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
                    onClick={handleClose} // ✅ Properly Call Close Function
                    className="text-white hover:text-red-500 text-lg font-bold"
                >
                    ✕
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
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
            <div className="flex mt-4">
                <input 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    className="flex-1 p-2 border rounded-l-lg" 
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
