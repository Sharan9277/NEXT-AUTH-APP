"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import TutorNavbar from "@/components/TutorNavbar";
import Sidebar from "@/components/Sidebar";

export default function TutorDashboard() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (!session) {
      // alert("Please sign in to access your dashboard.");
      router.push("/login/tutor");
    } else if (session.user.role !== "tutor") {
      alert("Access denied. Only tutors can access this page.");
      router.push("/");
    } else {
      fetchTutorData();
    }
  }, [session, status]);

  // ✅ Fetch tutor data and verify if ID is correct
  const fetchTutorData = async () => {
    try {
      const res = await fetch(`/api/tutors/${session.user.id}`);
      const data = await res.json();

      if (res.ok) {
        setTutor(data);
      } else {
        // alert("Invalid tutor ID. Redirecting...");
        router.push(`/dashboard/tutor/${session.user.id}`); // Redirect to a safer place
      }
    } catch (error) {
      console.error("Error fetching tutor data:", error);
      // alert("An error occurred. Redirecting...");
      router.push(`/dashboard/tutor/${session.user.id}`); // Redirect to a safer place
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex bg-[#F1f1f1] h-screen">
      
      <Sidebar active="Dashboard" />
      <TutorNavbar />
    </div>
  );
}
