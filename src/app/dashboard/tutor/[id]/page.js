"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import TutorNavbar from "@/components/TutorNavbar";
import Sidebar from "@/components/Sidebar";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function TutorDashboard() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (!session) {
      router.push("/login/tutor");
    } else if (session.user.role !== "tutor") {
      alert("Access denied. Only tutors can access this page.");
      router.push("/");
    } else {
      fetchTutorData();
      fetchDashboardData();
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
        router.push(`/dashboard/tutor/${session.user.id}`); // Redirect to a safer place
      }
    } catch (error) {
      console.error("Error fetching tutor data:", error);
      router.push(`/dashboard/tutor/${session.user.id}`); // Redirect to a safer place
    }
  };

  // ✅ Fetch dashboard metrics
  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`/api/tutors/dashboard/${session?.user.id}`);
      const data = await res.json();

      if (res.ok) {
        setDashboardData(data);
      } else {
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") return <p className="text-center mt-10">Loading...</p>;

  // Chart data for lesson statistics
  const lessonStatsData = {
    labels: ["Completed", "Upcoming", "Confirmed", "Cancelled"],
    datasets: [
      {
        label: "Lessons",
        data: [
          dashboardData?.lessonsCompleted || 0,
          dashboardData?.lessonsUpcoming || 0,
          dashboardData?.lessonsConfirmed || 0,
          dashboardData?.lessonsCancelled || 0,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"],
      },
    ],
  };

  // Chart data for weekly bookings
  const weeklyBookingsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Bookings",
        data: dashboardData?.weeklyBookingsData || [0, 0, 0, 0, 0, 0, 0],
        borderColor: "#3F51B5",
        backgroundColor: "rgba(63, 81, 181, 0.2)",
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#F1f1f1] min-h-screen">
            <div className="hidden md:block bg-[#F1f1f1]">
              <Sidebar active="Dashboard"/>
            </div>
      <div className="flex-1 flex flex-col">
        <TutorNavbar />
        <div className="p-6 flex-1">
          <h1 className="text-2xl font-bold mb-6">Tutor Dashboard</h1>

          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Lessons */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-gray-500 text-sm">Total Lessons</h2>
              <p className="text-3xl font-bold">{dashboardData?.totalLessons || 0}</p>
              <div className="text-xs text-gray-500 mt-2">All time lessons</div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-gray-500 text-sm">Wallet Balance</h2>
              <p className="text-3xl font-bold">${dashboardData?.walletBalance || "0.00"}</p>
              <div className="text-xs text-gray-500 mt-2">Available for withdrawal</div>
            </div>

            {/* Total Earnings */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-gray-500 text-sm">Total Earnings</h2>
              <p className="text-3xl font-bold">${dashboardData?.totalEarnings || "0.00"}</p>
              <div className="text-xs text-gray-500 mt-2">Lifetime earnings</div>
            </div>

            {/* Withdrawn Amount */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-gray-500 text-sm">Withdrawn</h2>
              <p className="text-3xl font-bold">${dashboardData?.earningsWithdrawn || "0.00"}</p>
              <div className="text-xs text-gray-500 mt-2">Total amount withdrawn</div>
            </div>
          </div>

          {/* Middle Stats Row - Lessons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Lessons Graph */}
            <div className="bg-white rounded-lg shadow p-4 col-span-2">
              <h2 className="text-lg font-semibold mb-4">Weekly Bookings</h2>
              <div className="h-64">
                <Line 
                  data={weeklyBookingsData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }} 
                />
              </div>
            </div>

            {/* Lesson Status */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Lesson Status</h2>
              <div className="h-64">
                <Pie 
                  data={lessonStatsData} 
                  options={{
                    maintainAspectRatio: false,
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Lessons Completed */}
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full p-3 bg-green-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-gray-500 text-sm">Completed Lessons</h2>
                <p className="text-2xl font-bold">{dashboardData?.lessonsCompleted || 0}</p>
              </div>
            </div>

            {/* Upcoming Lessons */}
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full p-3 bg-blue-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-gray-500 text-sm">Upcoming Lessons</h2>
                <p className="text-2xl font-bold">{dashboardData?.lessonsUpcoming || 0}</p>
              </div>
            </div>

            {/* Assignments Completed */}
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full p-3 bg-purple-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-gray-500 text-sm">Assignments Completed</h2>
                <p className="text-2xl font-bold">{dashboardData?.assignmentsCompleted || 0}</p>
              </div>
            </div>

            {/* Current Rating */}
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full p-3 bg-yellow-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h2 className="text-gray-500 text-sm">Average Rating</h2>
                <p className="text-2xl font-bold">{dashboardData?.averageRating || "0.0"}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
            {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Student</th>
                      <th className="py-2 px-4 border-b text-left">Date</th>
                      <th className="py-2 px-4 border-b text-left">Time</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentBookings.map((booking, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{booking.student_name || "Student"}</td>
                        <td className="py-2 px-4 border-b">{booking.date}</td>
                        <td className="py-2 px-4 border-b">{`${booking.start_time} - ${booking.end_time}`}</td>
                        <td className="py-2 px-4 border-b">
                          <span className={`px-2 py-1 rounded text-xs ${
                            booking.status === "Completed" ? "bg-green-100 text-green-800" : 
                            booking.status === "Confirmed" ? "bg-blue-100 text-blue-800" : 
                            booking.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-red-100 text-red-800"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">${booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No recent bookings found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}