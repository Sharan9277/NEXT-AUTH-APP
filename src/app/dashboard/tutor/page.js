"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";


export default function TutorDashboard() {
  const { data: session } = useSession();
  const [tutor, setTutor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject_expertise: [],
    hourly_rate: "",
  });

  useEffect(() => {
    const fetchTutor = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/tutors?email=${session.user.email}`);
          const data = await res.json();
          if (data.length > 0) {
            setTutor(data[0]);
            setFormData({
              name: data[0]?.name || "",
              phone: data[0]?.phone || "",
              subject_expertise: data[0]?.subject_expertise || [],
              hourly_rate: data[0]?.hourly_rate || "",
            });
          }
        } catch (error) {
          console.error("Error fetching tutor data:", error);
        }
      }
    };
    fetchTutor();
  }, [session]);

  return (
    <div className="flex">
      
      <Sidebar active="Dashboard" />
      <div className="flex flex-col w-full">
      <div className="w-full flex relative bg-white flex flex-row items-center justify-between py-6 px-40 box-border text-left text-sm text-gray-600 font-body-large-400">
      <div className="flex flex-col items-start justify-start gap-1.5">
      <div className="w-[312px] relative tracking-[-0.01em] leading-[20px] font-medium inline-block">Good Morning</div>
      <div className="w-[312px] relative text-xl leading-[26px] font-semibold text-gray-900 inline-block">{tutor?.name || "Tutor"}</div>
      </div>
      <div className="flex flex-row items-start justify-start gap-4 text-base text-gray-500">
      <div className="w-[312px] relative bg-gray-50 h-12 overflow-hidden shrink-0">
      <div className="absolute top-[calc(50%_-_12px)] left-[18px] flex flex-row items-center justify-start gap-3">
      <Image className="w-6 relative h-6" width={24} height={24} alt="" src="/MagnifyingGlass.svg" />
      <div className="relative leading-[24px]">Search</div>
      </div>
      </div>
      <div className="bg-gray-50 flex flex-row items-start justify-start p-3">
      <Image className="w-6 relative h-6" width={24} height={24} alt="" src="/Bell.svg" />
      </div>
      <Image className="w-12 relative rounded-[50%] h-12 object-cover" width={48} height={48} alt="" src="/Ellipse 300.png" />
      </div>
      </div>
      </div>
    </div>
  );
}
