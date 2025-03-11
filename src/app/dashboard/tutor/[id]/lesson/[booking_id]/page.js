"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import TutorNavbar from "@/components/TutorNavbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function LessonPage() {
  const { data: session } = useSession();
  const { id, booking_id } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);


  useEffect(() => {
    if (!session) {
      alert("Please sign in to access the lesson page.");
      router.push("/login/tutor");
    } else if (session.user.role !== "tutor") {
      alert("Access denied. Only tutors can access this page.");
      router.push("/");
    } else {
      fetchLessonDetails();
    }
  }, [session]);

  const fetchLessonDetails = async () => {
    try {
      const res = await fetch(`/api/bookings/${booking_id}`);
      const data = await res.json();
      if (res.ok) {
        setLesson(data);
      } else {
        console.error("Error fetching lesson details:", data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
      setLoading(false);
    }
  };
  const handleMarkComplete = async () => {
    setMarkingComplete(true);
    try {
      const res = await fetch(`/api/bookings/${booking_id}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Lesson marked as completed!");
        router.push(`/dashboard/tutor/${id}`); // ✅ Redirect to dashboard
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
    }
    setMarkingComplete(false);
  };

  if (loading) return <p className="text-center mt-10">Loading Lesson Details...</p>;
  if (!lesson) return <p className="text-center mt-10 text-red-500">Lesson not found.</p>;

  return (
    <div className="flex bg-[#F1f1f1] h-screen">
  <Sidebar active="My Schedule" />
  <div className="mx-auto w-full">
    <TutorNavbar />
    <div className="flex-grow p-6 bg-white rounded-md shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900">Lesson Details</h1>

      {/* Student Details */}
      <div className="mt-4 p-4 border rounded-md bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Student Details</h2>
        <p className="text-gray-700"><strong>Name:</strong> {lesson.student.name}</p>
        <p className="text-gray-700"><strong>Email:</strong> {lesson.student.email}</p>
        <p className="text-gray-700"><strong>Phone:</strong> {lesson.student.phone || "Not provided"}</p>
        <Link 
          href={`/dashboard/tutor/${id}/messages/${lesson.student.user_id}`} 
          className="block mt-2 text-blue-600 hover:text-blue-800 underline"
        >
          Send a Message
        </Link>
      </div>

      {/* Lesson Schedule */}
      <div className="mt-4 p-4 border rounded-md bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Lesson Schedule</h2>
        <p className="text-gray-700"><strong>Date:</strong> {lesson.day}</p>
        <p className="text-gray-700"><strong>Time:</strong> {lesson.start_time} - {lesson.end_time}</p>
      </div>

      {/* Google Meet Link */}
      <div className="mt-4 p-4 border rounded-md bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Google Meet Session</h2>
        <p className="text-gray-700">
          <strong>Meeting Link:</strong> 
          {lesson.meeting_link ? (
            <a 
              href={lesson.meeting_link} 
              target="_blank" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {lesson.meeting_link}
            </a>
          ) : (
            <span className="text-red-500 font-medium"> Meeting link not generated yet. </span>
          )}
        </p>
        <p className="text-sm text-gray-600">
          Only the tutor, student, and admins can join without requesting permission.
        </p>
      </div>
      {/* ✅ Mark Lesson as Completed Button */}
      {lesson.status !== "Completed" && (
            <div className="mt-4">
              <button
                onClick={handleMarkComplete}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={markingComplete}
              >
                {markingComplete ? "Marking as Completed..." : "Mark Lesson as Completed"}
              </button>
            </div>
          )}
    </div>
  </div>
</div>

  );
}
