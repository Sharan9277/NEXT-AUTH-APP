"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatList from "@/components/ChatList_Student";
import ChatWindow from "@/components/ChatWindow_Student";
import StudentNavbar from "@/components/StudentNavbar";
import Topbar from "@/components/Topbar";
import MyLessons from "@/components/StudentLessons";

const LessonsPage = () => {
    const params = useParams();
    const studentId = params.id;

    return (
        <div className="flex flex-col h-screen bg-white">
                  <StudentNavbar />
                  <Topbar page="Messages" />
            {/* ✅ Navbars are already included, just add the chat layout */}
            <div className="flex justify-center items-center flex-grow bg-gray-100 p-4">
                    <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">My Lessons</h2>
                        <MyLessons studentId={studentId} />
                    </div>
                </div>
        </div>
    );
};

export default LessonsPage;
