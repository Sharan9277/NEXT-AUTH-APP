import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import CryptoJS from "crypto-js";

const Chat = ({ chatId, senderId, recipientId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        // Fetch previous messages from MongoDB
        fetch(`/api/get-messages?sender_id=${senderId}&recipient_id=${recipientId}`)
            .then(res => res.json())
            .then(setMessages);

        // Listen for new messages using Pusher
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER });
        const channel = pusher.subscribe(`chat-${recipientId}`);
        channel.bind("new-message", (data) => {
            setMessages(prev => [...prev, { ...data, decrypted_content: decryptMessage(data.encrypted_content) }]);
        });

        return () => channel.unsubscribe();
    }, [chatId]);

    // Encrypt message before sending
    const encryptMessage = (content) => {
        return CryptoJS.AES.encrypt(content, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString();
    };

    // Decrypt received messages
    const decryptMessage = (encryptedContent) => {
        const bytes = CryptoJS.AES.decrypt(encryptedContent, process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    const sendMessage = async () => {
        const encryptedContent = encryptMessage(newMessage);

        await fetch("/api/send-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId, sender_id: senderId, recipient_id: recipientId, encrypted_content: encryptedContent })
        });

        setNewMessage("");
    };

    return (
        <div>
            {messages.map((msg, i) => (
                <p key={i}><strong>{msg.sender_id === senderId ? "You" : "Them"}:</strong> {decryptMessage(msg.encrypted_content)}</p>
            ))}
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
