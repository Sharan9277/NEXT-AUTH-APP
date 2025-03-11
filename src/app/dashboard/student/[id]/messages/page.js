"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import ChatList from "@/components/ChatList_Student";
import ChatWindow from "@/components/ChatWindow_Student";
import StudentNavbar from "@/components/StudentNavbar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

const MessagesPage = () => {
    const { data: session } = useSession();
    const params = useParams();
    const userId = params.id;
    const [selectedUser, setSelectedUser] = useState(null);
    const [filter, setFilter] = useState("all"); // ✅ Default filter is "all"
    const [resetSelection, setResetSelection] = useState(false);

    // ✅ Redirect if user is not authenticated or not a student
  if (!session) {
    return <p className="text-center mt-10">Please log in to access settings.</p>;
  }
  if (session.user.role !== "student") {
    return <p className="text-center mt-10">Access Denied. Only students can access this page.</p>;
  }

    const handleCloseChat = () => {
        setSelectedUser(null); // ✅ Fix: Reset selected chat when closing
        setResetSelection(false);
        setTimeout(() => setResetSelection(true), 0);

        console.log("Chat closed", resetSelection);
    };

    return (
        <div className="flex flex-col h-auto bg-white">
            
                  <StudentNavbar />
                  <div className="w-full sticky"><Topbar page="Messages" /></div>
            {/* ✅ Navbars are already included, just add the chat layout */}
            <div className="flex flex-grow bg-gray-100">
                {/* ✅ Chat List Section */}
                <div className="w-1/3 bg-white pl-4 pb-4 px-4 border-r shadow-lg">
                    {/* ✅ Chat Menu Bar */}
                    <div className="flex justify-left border-b pb-2">
                        {["all", "unread", "archive"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`pb-[25px] pt-[25px] px-5 ${
                                    filter === tab ? "border-b-2 border-[#5577d1] text-[#5577d1] " : "text-gray-500"
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* ✅ Render the Chat List */}
                    <ChatList userId={userId} filter={filter} onSelectChat={setSelectedUser} resetSelection={resetSelection}/>
                </div>

                {/* ✅ Chat Window Section */}
                <div className="w-2/3 h-[785px] ">
                    {selectedUser ? (
                        <ChatWindow userId={userId} selectedUserId={selectedUser.id} selectedUserName={selectedUser.name} selectedUserImage={selectedUser.profileImage} onClose={handleCloseChat} resetSelection={() => setResetSelection(true)}/>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select a chat to start messaging
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MessagesPage;
