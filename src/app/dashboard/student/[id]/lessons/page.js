"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatList from "@/components/ChatList_Student";
import ChatWindow from "@/components/ChatWindow_Student";
import StudentNavbar from "@/components/StudentNavbar";
import Topbar from "@/components/Topbar";
import MyLessons from "@/components/StudentLessons";
import { WeeklyCalendar } from "@/components/weekly-calendar";

const LessonsPage = () => {
    const params = useParams();
    const studentId = params.id;

    return (
        <div className="flex flex-col h-screen bg-white">
            <StudentNavbar />
            <Topbar page="Lessons" />
            
            {/* Main content area - centered with max-width */}
            <div className="flex-grow bg-white py-[50px]">
                <div className="mx-auto w-full max-w-5xl bg-white rounded-lg flex flex-col">
                    <div className="py-6 border-b">
                        <h2 className="text-[28px] font-inter font-bold text-black">My Lessons</h2>
                    </div>
                    
                    {/* Calendar container - fixed height with overflow */}
                    <div className="h-[calc(100vh-230px)] overflow-hidden">
                        <WeeklyCalendar studentId={studentId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonsPage;