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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  
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
    if (typeof window !== "undefined") {
      const tutorTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Get today's date
      const today = new Date();
      
      // Start from the current date and show next 7 days
      const startDate = new Date(today);
      // Add (currentPage - 1) * 7 days to start date to handle pagination
      startDate.setDate(today.getDate() + (currentPage - 1) * 7);
      
      // Generate the days starting from current date
      const week = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        
        return {
          day: date.toLocaleString("en-US", { weekday: "short" }),
          date: date.toLocaleDateString("en-CA", { timeZone: tutorTimeZone }),
          fullDate: date // Store full date object for comparison
        };
      });
      
      setCurrentWeek(week);
    }
  }, [currentPage]);
  
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
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
  
  // Check if a date has already passed
  const hasDatePassed = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    return date < today;
  };

  if (!schedule) return <p className="text-center mt-10">Loading Tutor Dashboard...</p>;

  return (
    <div className="flex bg-[#F1f1f1] h-screen">
      <Sidebar active="Profile Settings" />
      <div className="mx-auto w-full flex flex-col">
        <TutorNavbar />
        <div className="flex-grow p-6 flex flex-col">
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
          <div className="mt-6 flex-grow">
            {/* Week Grid */}
            <div className="grid grid-cols-7 gap-4 text-center">
              {currentWeek.map((day, index) => {
                // Get today's date in the same format for comparison
                const todayLocal = new Date().toLocaleDateString("en-CA");
                const isToday = day.date === todayLocal;

                return (
                  <div key={index} className="flex flex-col items-center">
                    {/* Day Box with Highlight for Today */}
                    <div className={`px-4 py-2 rounded-full ${
                      isToday 
                        ? "bg-green-500 text-white font-bold" 
                        : "bg-blue-500 text-white"
                    }`}>
                      {getFullDayName(day.day)}
                    </div>

                    {/* Date Below Day */}
                    <div className={`mt-1 ${isToday ? "font-bold text-green-600" : "text-gray-600"}`}>
                      {day.date}
                    </div>

                    {/* Space Between Day and Lessons */}
                    <div className="h-4"></div>

                    {/* Lessons for this day */}
                    <div className="mt-2 flex flex-col gap-2 w-full">
                      {bookings
                        .flatMap(booking => 
                          booking.lesson_statuses
                            .filter(lesson => lesson.date === day.date)
                            .map(lesson => ({
                              _id: booking._id,
                              student_id: booking.student_id,
                              student_name: booking.student_id?.name || "Unknown Student",
                              lesson_date: lesson.date,
                              lesson_status: lesson.status,
                              start_time: booking.start_time,
                              end_time: booking.end_time,
                            }))
                        )
                        .sort((a, b) => 
                          convertTo24HourFormat(a.start_time) - convertTo24HourFormat(b.start_time)
                        )
                        .map((lesson, i) => (
                          <Link
                            key={i}
                            href={`/dashboard/tutor/${id}/lesson/${lesson._id}`}
                            className="block bg-white shadow-md rounded-md p-2 hover:bg-gray-200"
                          >
                            <p className="text-sm text-black font-bold">{lesson.student_name}</p>
                            <p className="text-xs text-blue-500">⏰ {lesson.start_time} - {lesson.end_time}</p>
                            <p className="text-xs text-gray-500">📅 Status: {lesson.lesson_status}</p>
                          </Link>
                        ))
                      }
                      {!bookings.some(booking => 
                        booking.lesson_statuses.some(lesson => lesson.date === day.date)
                      ) && (
                        <p className="text-gray-400 text-xs">No lessons</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* New Pagination UI fixed at the bottom */}
          <div className="mt-auto mb-4 pt-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1} 
                  className={`rounded-full w-12 h-12 flex items-center justify-center ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-white text-[#FF5722] hover:bg-gray-100'
                  }`}
                >
                  ←
                </button>
                
                {[1, 2, 3, 4, 5].map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-full w-12 h-12 flex items-center justify-center font-bold ${
                      currentPage === page 
                        ? 'bg-[#FF5722] text-white' 
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {page < 10 ? `0${page}` : page}
                  </button>
                ))}
                
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages} 
                  className={`rounded-full w-12 h-12 flex items-center justify-center ${
                    currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-white text-[#FF5722] hover:bg-gray-100'
                  }`}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}