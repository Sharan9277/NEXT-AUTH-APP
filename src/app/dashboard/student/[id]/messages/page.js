"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import ChatList from "@/components/ChatList_Student";
import ChatWindow from "@/components/ChatWindow_Student";
import StudentNavbar from "@/components/StudentNavbar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MessageSquare } from "lucide-react";

const MessagesPage = () => {
    const { data: session } = useSession();
    const params = useParams();
    const userId = params.id;
    const [selectedUser, setSelectedUser] = useState(null);
    const [filter, setFilter] = useState("all"); // Default filter is "all"
    const [resetSelection, setResetSelection] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [showChatList, setShowChatList] = useState(true);
    const [hasChats, setHasChats] = useState(true); // Add state to track if there are any chats

    // Check viewport size on component mount and window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        // Initial check
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Show appropriate view based on selection in mobile mode
    useEffect(() => {
        if (isMobileView && selectedUser) {
            setShowChatList(false);
        }
    }, [selectedUser, isMobileView]);

    // Redirect if user is not authenticated or not a student
    if (!session) {
        return <p className="text-center mt-10">Please log in to access settings.</p>;
    }
    if (session.user.role !== "student") {
        return <p className="text-center mt-10">Access Denied. Only students can access this page.</p>;
    }

    const handleCloseChat = () => {
        setSelectedUser(null); // Reset selected chat when closing
        setResetSelection(false);
        setTimeout(() => setResetSelection(true), 0);
        
        // In mobile view, show the chat list again when closing a chat
        if (isMobileView) {
            setShowChatList(true);
        }
        
        console.log("Chat closed", resetSelection);
    };

    const handleSelectChat = (user) => {
        setSelectedUser(user);
    };

    const handleBackToList = () => {
        setShowChatList(true);
    };

    const handleChatsAvailability = (available) => {
        setHasChats(available);
    };

    return (
        <div className="flex flex-col h-auto bg-white">
            <StudentNavbar />
            <div className="w-full sticky"><Topbar page="Messages" /></div>
            
            {/* Chat Layout */}
            <div className="flex flex-grow bg-gray-100 h-full">
                {/* Chat List Section - Hide on mobile when chat is selected */}
                {(!isMobileView || (isMobileView && showChatList)) && (
                    <div className={`${isMobileView ? 'w-full' : 'w-1/3'} bg-white pl-4 pb-4 px-4 border-r shadow-lg flex flex-col`}>
                        {/* Chat Menu Bar */}
                        <div className="flex justify-left border-b pb-2 overflow-x-auto">
                            {["all", "unread", "archive"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`pb-[25px] pt-[25px] px-5 whitespace-nowrap ${
                                        filter === tab ? "border-b-2 border-[#5577d1] text-[#5577d1]" : "text-gray-500"
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Render the Chat List or No Chats Message */}
                        <div className="flex-grow">
                            <ChatList 
                                userId={userId} 
                                filter={filter} 
                                onSelectChat={(user) => {
                                    handleSelectChat(user);
                                }} 
                                resetSelection={resetSelection}
                                onChatsAvailability={handleChatsAvailability}
                            />
                            
                            {/* Display a message when no chats are available */}
                            {!hasChats && (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                    <MessageSquare size={48} className="mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">No messages available</p>
                                    {filter !== "all" && (
                                        <p className="mt-2 text-sm text-center">
                                            No {filter} messages found. Try changing the filter or check back later.
                                        </p>
                                    )}
                                    {filter === "all" && (
                                        <p className="mt-2 text-sm text-center">
                                            You don't have any messages yet. When you receive messages, they will appear here.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Chat Window Section - Full width on mobile when chat is selected */}
                {(!isMobileView || (isMobileView && !showChatList)) && (
                    <div className={`${isMobileView ? 'w-full' : 'w-2/3'} h-[785px]`}>
                        {selectedUser ? (
                            <>
                                {/* Mobile Back Button */}
                                {isMobileView && (
                                    <div className="p-2 bg-white border-b flex items-center">
                                        <button 
                                            onClick={handleBackToList}
                                            className="flex items-center text-[#5577d1]"
                                        >
                                            <ArrowLeft size={18} />
                                            <span className="ml-1">Back to Messages</span>
                                        </button>
                                    </div>
                                )}
                                <ChatWindow 
                                    userId={userId} 
                                    selectedUserId={selectedUser.id} 
                                    selectedUserName={selectedUser.name} 
                                    selectedUserImage={selectedUser.profileImage} 
                                    onClose={handleCloseChat} 
                                    resetSelection={() => setResetSelection(true)}
                                />
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Select a chat to start messaging
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MessagesPage;