"use client";
import { useEffect, useState } from "react";
import TutorNavbar from "@/components/TutorNavbar";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function TutorDashboard() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [schedule, setSchedule] = useState([]);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [selectedWeekStart, setSelectedWeekStart] = useState(new Date()); // Track week start date



  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (!session) {
      alert("Please sign in to access your dashboard.");
      router.push("/login/tutor");
    } else if (session.user.role !== "tutor") {
      alert("Access denied. Only tutors can access this page.");
      router.push("/");
    } else {
      fetchSchedule();
    }
  }, [session, status]);



 


useEffect(() => {
    if (typeof window !== "undefined") { // ✅ Ensure this runs only in the browser
      const tutorTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const today = new Date();
      const todayLocal = new Date(
        today.toLocaleString("en-US", { timeZone: tutorTimeZone })
      );
  
      const dayOfWeek = selectedWeekStart.getDay();
      const startOfWeek = new Date(selectedWeekStart);
      startOfWeek.setDate(selectedWeekStart.getDate() - dayOfWeek);
  
      const week = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
  
        return {
          day: date.toLocaleString("en-US", { weekday: "short" }),
          date: date.toLocaleDateString("en-CA", { timeZone: tutorTimeZone })
        };
      });
  
      setCurrentWeek(week);
    }
  }, [selectedWeekStart]);
  
  const fetchSchedule = async () => {
    try {
      const res = await fetch(`/api/tutors/${session?.user?.id}/bookings`);
      const data = await res.json();

      if (res.ok) {
        const blockedRes = await fetch(`/api/tutors/${session?.user?.id}/availability`);
        const blockedData = await blockedRes.json();

        const blockedDatesList = blockedData.blocked_dates || [];

        const upcomingLessons = data.bookings.filter((lesson) => lesson.status !== "Completed" && !blockedDatesList.includes(lesson.date));
        setBookings(upcomingLessons || []);
        setBlockedDates(blockedDatesList);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const getFullDayName = (shortDay) => {
    const daysMap = { Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };
    return daysMap[shortDay] || shortDay;
  };
  
  
  // ✅ Week navigation functions
  const handlePrevWeek = () => {
    setSelectedWeekStart(prev => {
      const newStart = new Date(prev);
      newStart.setDate(newStart.getDate() - 7); // Move back by 7 days
      return newStart;
    });
  };
  
  const handleNextWeek = () => {
    setSelectedWeekStart(prev => {
      const newStart = new Date(prev);
      newStart.setDate(newStart.getDate() + 7); // Move forward by 7 days
      return newStart;
    });
  };
  
  
  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
  
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
  
    return hours * 60 + minutes; // Convert to total minutes for easy sorting
  };

  if (!schedule) return <p className="text-center mt-10">Loading Tutor Dashboard...</p>;

  return (
    <div className="flex bg-[#F1f1f1] h-screen">
        <Sidebar active="Profile Settings" />
    <div className="mx-auto w-full">
      <TutorNavbar />
        <div className="flex-grow p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Schedule</h1>
            <div className="flex gap-4">
              {/* Manage Bookings */}
              <Link href={`/dashboard/tutor/${id}/bookings`} title="Manage Bookings">
                <button className="bg-gray-300 p-2 rounded-full hover:bg-gray-400">
                  📅
                </button>
              </Link>
              {/* Manage Availability */}
              <Link href={`/dashboard/tutor/${id}/availability`} title="Manage Availability">
                <button className="bg-gray-300 p-2 rounded-full hover:bg-gray-400">
                  ⚙️
                </button>
              </Link>
            </div>
          </div>
{/* Weekly Schedule Section */}
<div className="mt-6">
  <div className="flex items-center justify-between">
    <button onClick={handlePrevWeek} className="bg-[#ED6C43] px-3 py-2 rounded-md hover:bg-[#5577d1] ">
      ← Previous Week
    </button>
    
    <h2 className="text-xl text-black font-semibold">
      {currentWeek[0]?.date} - {currentWeek[6]?.date}
    </h2>

    <button onClick={handleNextWeek} className="bg-[#ED6C43] px-3 py-2 rounded-md hover:bg-[#5577d1]">
      Next Week →
    </button>
  </div>

  {/* Week Grid */}
  <div className="mt-4 grid grid-cols-7 gap-4 text-center">
    {currentWeek.map((day, index) => {
      // ✅ Get user's correct local date for comparison
      const todayLocal = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD" format
      const isToday = day.date === todayLocal; // ✅ Check if it's today

      return (
        <div key={index} className="flex flex-col items-center">
          {/* Day Box with Highlight for Today */}
          <div className={`px-4 py-2 rounded-full ${isToday ? "bg-green-500 text-white font-bold" : "bg-blue-500 text-white"}`}>
            {getFullDayName(day.day)}
          </div>

          {/* Date Below Day */}
          <div className="text-gray-600 mt-1">{day.date}</div>

          {/* Space Between Day and Lessons */}
          <div className="h-4"></div> {/* ✅ Adds spacing between day and lessons */}

          {/* Lessons for this day */}
          <div className="mt-2 flex flex-col gap-2 w-full">
            {bookings
            
              .filter(booking => booking.slot_id?.day === getFullDayName(day.day))
              .sort((a, b) => 
                convertTo24HourFormat(a.slot_id?.start_time) - convertTo24HourFormat(b.slot_id?.start_time)
              )
              .map((booking, i) => (
                <Link
                  key={i}
                  href={`/dashboard/tutor/${id}/lesson/${booking._id}`}
                  className="block bg-white shadow-md rounded-md p-2 hover:bg-gray-200"
                >
                  <p className="text-sm text-black font-bold">{booking.student_id?.name || "Unknown Student"}</p>
                  {/* <p className="text-xs text-gray-600">📖 Subject: {booking.subject || "Not Specified"}</p> */}
                  <p className="text-xs text-blue-500">⏰ {booking.slot_id?.start_time} - {booking.slot_id?.end_time}</p>
                </Link>
              ))
            }
            {bookings.filter(booking => booking.slot_id?.day === getFullDayName(day.day)).length === 0 && (
              <p className="text-gray-400 text-xs">No lessons</p>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>





        </div>
      </div>
    </div>
  );
}
