"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TutorNavbar from "@/components/TutorNavbar";
import ChatList from "@/components/ChatList_Tutor";
import ChatWindow from "@/components/ChatWindow_Tutor";

const MessagesPage = () => {
    const params = useParams();
    const userId = params.id;
    const [selectedUser, setSelectedUser] = useState(null);
    const [resetSelection, setResetSelection] = useState(false);


    const handleCloseChat = () => {
        setSelectedUser(null);
        setResetSelection(false);
        setTimeout(() => setResetSelection(true), 0);

        console.log("Chat closed", resetSelection);
    };
    

    return (
        <div className="flex h-screen">
            <Sidebar active="messages"/>

            {/* ✅ Main Content (Navbar + Chat Section) */}
            <div className="flex flex-col flex-grow">
                {/* ✅ Navbar Stays at Top of Content */}
                <TutorNavbar />

                {/* ✅ Chat Content Section */}
                <div className="flex justify-center items-center flex-grow bg-gray-100 p-4">
                    {/* ✅ Chat List (Left Side) */}
                    <div className={`w-[424px] bg-white pt-4 border rounded-lg shadow-md overflow-y-auto h-[600px] ${selectedUser ? "bg-[#ED6C43]" : ""}`}>
                        <ChatList userId={userId} userRole="tutor" onSelectChat={setSelectedUser} resetSelection={resetSelection}/>
                    </div>

                    {/* ✅ Gap of 24px */}
                    <div className="w-6"></div>

                    {/* ✅ Chat Window (Right Side) */}
                    <div className="w-[800px] border rounded-lg shadow-md  h-[600px] max-h-[600px]">
                        {selectedUser ? (
                            <ChatWindow userId={userId} selectedUserId={selectedUser.id} selectedUserName={selectedUser.name} selectedUserImage={selectedUser.profileImage} onClose={handleCloseChat} resetSelection={() => setResetSelection(true)}/>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Select a chat to start messaging
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
