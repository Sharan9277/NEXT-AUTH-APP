"use client";

import StudentNavbar from "@/components/StudentNavbar";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import Container from "@/components/student_home_page";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      alert("Please sign in to access your dashboard.");
      router.push("/login/student");
    } else if (session.user.role !== "student") {
      alert("Access denied. Only students can access this page.");
      router.push("/");
    } else {
      fetchStudentData();
      fetchSubscriptions();
      fetchTutors();
    }
  }, [session, status]);

  // ✅ Fetch student data
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
    }
  };

  // ✅ Fetch all active subscriptions for the student
  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`/api/students/${id}/subscriptions`);
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      
      const data = await res.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]);
    }
  };

  // ✅ Fetch all tutors (both verified and unverified)
  const fetchTutors = async () => {
    try {
      const res = await fetch("/api/tutors/"); // Ensure correct API route
      if (!res.ok) throw new Error("Failed to fetch tutors");

      const data = await res.json();
      setTutors(data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setLoading(false); // ✅ Ensure loading is stopped once API calls finish
    }
  };

  if (loading || status === "loading") return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="relative min-h-screen z-30 flex flex-col bg-white">
      {/* Navbar */}
      <StudentNavbar />

      {/* Main Content */}
      <Topbar active="Home" />

      {/* Background Section with Pink Box */}
      <div className="relative w-full flex-grow flex flex-col items-center justify-center">
        {/* Full-Width Pink Box */}
        <div
          className="absolute w-full h-[200px] md:h-[300px] top-0"
          style={{ backgroundColor: "rgba(85, 119, 209, 0.23)" }}
        ></div>

        {/* Centered Container on Top of Pink Box */}
        <div className="relative z-10 w-full px-4 md:px-0">
          <Container />
        </div>
      </div>
    </div>
  );
}
