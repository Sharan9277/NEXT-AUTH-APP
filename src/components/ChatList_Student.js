import { useEffect, useState } from "react";

const ChatList = ({ userId, filter, onSelectChat, resetSelection }) => {
        const [selectedChatId, setSelectedChatId] = useState(null); // ✅ Track Selected Chat
    const [chats, setChats] = useState([]);

    useEffect(() => {
        fetch(`/api/get-chat-list?user_id=${userId}`)
            .then(res => res.json())
            .then((data) => {
                // ✅ Fix: Ensure `archive` is treated as a property, not a function
                if (filter === "unread") {
                    setChats(data.filter(chat => chat.unreadCount > 0));
                } else if (filter === "archive") {
                    setChats(data.filter(chat => chat.isArchived === true)); // ✅ Ensure `isArchived` is a valid boolean
                } else {
                    setChats(data);
                }
            })
            .catch(error => console.error("Error fetching chat list:", error));
    }, [userId, filter]);

    const handleChatClick = (chat) => {
            console.log("Chat clicked:", chat.user_id); // ✅ Debug log
            setSelectedChatId(chat.user_id); // ✅ Update Selected Chat
            onSelectChat({ id: chat.user_id, name: chat.name, profileImage: chat.profileImage });
        };
    
        useEffect(() => {
            console.log("resetSelection updated:", resetSelection);
            if (resetSelection) {
                console.log("Resetting selectedChatId"); 
                setSelectedChatId(null);
            }
        }, [resetSelection]);

    return (
        <div className="">
            {chats.map((chat) => (
                <div 
                    key={chat.user_id} 
                    className={`flex items-center p-3 cursor-pointer  transition-colors duration-200
                        ${selectedChatId === chat.user_id ? "bg-[#ED6C43]" : "hover:bg-[#ED6C43] hover:text-white text-black"}`}
                    onClick={() => handleChatClick(chat)}
                >
                    <img src={chat.profileImage} alt={chat.name} className="w-10 h-10 rounded-full mr-3" />
                    <div className="flex-1">
                    <p className={`${selectedChatId === chat.user_id ? "font-semibold" : "font-semibold"}`}>{chat.name}</p>
                    <p className={ `${selectedChatId === chat.user_id ? "text-sm text-white truncate":"text-sm  truncate"}`}>{chat.lastMessage}</p>
                    </div>
                    {chat.unreadCount > 0 && filter !== "archive" &&(
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {chat.unreadCount}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatList;
