"use client";

import StudentNavbar from "@/components/StudentNavbar";

import { useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { signOut,useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (!session) {
      alert("Please sign in to access your dashboard.");
      router.push("/login/student");
    } else if (session.user.role !== "student") {
      alert("Access denied. Only students can access this page.");
      router.push("/");
    } else {
      fetchStudentData();
    }
  }, [session, status]);

  // ✅ Fetch student data and verify if ID is correct
  const fetchStudentData = async () => {
    try {
      const res = await fetch(`/api/students/${id}`);
      const data = await res.json();

      if (res.ok) {
        setStudent(data);
      } else {
        alert("Invalid student ID. Redirecting...");
        router.push("/dashboard/student");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("An error occurred. Redirecting...");
      router.push("/dashboard/student");
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") return <p className="text-center mt-10">Loading...</p>;


  return (
    <div className="relative min-h-screen bg-white">
      {/* Make the Navbar relative with a higher z-index */}
      <StudentNavbar />
      
      {/* Main Dashboard Content */}
      <Topbar active="Home" />
      
    </div>
  );
}
