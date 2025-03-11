"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import TutorNavbar from "@/components/TutorNavbar";


export default function TutorDashboard() {
  const { data: session } = useSession();
  const [tutor, setTutor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject_expertise: [],
    hourly_rate: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);


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

    const handleLogout = () => {
      localStorage.removeItem("isLoggedIn");
  
      let loginPath = "/login-selection";
  
      if (session?.user?.role === "admin") {
        loginPath = "/login/admin";
      } else if (session?.user?.role === "student") {
        loginPath = "/login/student";
      } else if (session?.user?.role === "tutor") {
        loginPath = "/login/tutor";
      }
  
      signOut({ callbackUrl: loginPath });
    };

  return (
    <div className="flex bg-[#F1f1f1]">
      
      <Sidebar active="My Assignment" />
      <TutorNavbar />
    </div>
  );
}
