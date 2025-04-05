"use client";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false); // Ensures client-side rendering

  useEffect(() => {
    setIsClient(true); // Runs only on the client side
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentRes, tutorRes, assignmentRes, bookingRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/tutors"),
        fetch("/api/assignments"),
        fetch("/api/bookings")
      ]);

      if (!studentRes.ok) throw new Error("Failed to fetch students data");
      if (!tutorRes.ok) throw new Error("Failed to fetch tutors data");
      if (!assignmentRes.ok) throw new Error("Failed to fetch assignments data");
      if (!bookingRes.ok) throw new Error("Failed to fetch bookings data");

      const studentData = await studentRes.json();
      const tutorData = await tutorRes.json();
      const assignmentData = await assignmentRes.json();
      const bookingData = await bookingRes.json();

      // Process and set data based on API response format
      setStudents(Array.isArray(studentData) ? studentData : studentData.students || []);
      setTutors(Array.isArray(tutorData) ? tutorData : tutorData.tutors || []);
      setAssignments(Array.isArray(assignmentData) ? assignmentData : assignmentData.assignments || []);
      
      // Simplified booking data extraction - handle common response patterns
      let processedBookings = [];
      
      // Directly use bookingData if it's an array
      if (bookingData && bookingData.data && Array.isArray(bookingData.data)) {
        // If the response has a data property that is an array
        processedBookings = bookingData.data;
      } 
      // Keep your existing fallback handling
      else if (Array.isArray(bookingData)) {
        processedBookings = bookingData;
      } 
      else if (bookingData && bookingData.bookings && Array.isArray(bookingData.bookings)) {
        processedBookings = bookingData.bookings;
      } 
      else if (bookingData && typeof bookingData === 'object') {
        processedBookings = [bookingData];
      }

      // Flatten nested arrays if any
      if (processedBookings.length > 0 && Array.isArray(processedBookings[0])) {
        processedBookings = processedBookings.flat();
      }
      
      // Filter out invalid bookings
      processedBookings = processedBookings.filter(booking => booking && typeof booking === 'object');

      
      console.log("Processed Bookings:", processedBookings);
      setBookings(processedBookings);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Data Counts
  const stats = {
    students: students.length,
    tutors: tutors.length,
    assignments: assignments.length,
    bookings: bookings.length,
  };

  // Calculate additional stats based on the correct data structure
  const activeStudents = students.filter(student => student.isVerified).length;
  const activeTutors = tutors.filter(tutor => tutor.isVerified).length;
  const completedAssignments = assignments.filter(assignment => assignment.status === "completed").length;
  
  // Booking status calculations based on the provided data structure
  const confirmedBookings = bookings.filter(booking => booking.status === "Confirmed").length;
  const pendingBookings = bookings.filter(booking => booking.status === "Pending").length;
  const cancelledBookings = bookings.filter(booking => booking.status === "Cancelled").length;
  const paidBookings = bookings.filter(booking => booking.payment_status === "paid").length;

  // Booking type calculations
  const subscriptionBookings = bookings.filter(booking => booking.booking_type === "subscription").length;
  const oneTimeBookings = bookings.filter(booking => booking.booking_type === "one-time").length;

  // Pie Chart Data
  const overviewData = [
    { name: "Students", value: stats.students },
    { name: "Tutors", value: stats.tutors },
    { name: "Assignments", value: stats.assignments },
    { name: "Bookings", value: stats.bookings },
  ];

  // Status Charts Data
  const studentStatusData = [
    { name: "Verified", value: activeStudents },
    { name: "Unverified", value: stats.students - activeStudents },
  ];

  const tutorStatusData = [
    { name: "Verified", value: activeTutors },
    { name: "Unverified", value: stats.tutors - activeTutors },
  ];

  const assignmentStatusData = [
    { name: "Completed", value: completedAssignments },
    { name: "In Progress", value: stats.assignments - completedAssignments },
  ];

  const bookingStatusData = [
    { name: "Confirmed", value: confirmedBookings },
    { name: "Pending", value: pendingBookings },
    { name: "Cancelled", value: cancelledBookings },
  ];

  // Only include "Other" category if there are any
  if (stats.bookings - confirmedBookings - pendingBookings - cancelledBookings > 0) {
    bookingStatusData.push({ 
      name: "Other", 
      value: stats.bookings - confirmedBookings - pendingBookings - cancelledBookings 
    });
  }

  const bookingTypeData = [
    { name: "Subscription", value: subscriptionBookings },
    { name: "One-time", value: oneTimeBookings },
  ];

  // Only include "Other" category if there are any
  if (stats.bookings - subscriptionBookings - oneTimeBookings > 0) {
    bookingTypeData.push({ 
      name: "Other", 
      value: stats.bookings - subscriptionBookings - oneTimeBookings 
    });
  }

  const paymentStatusData = [
    { name: "Paid", value: paidBookings },
    { name: "Unpaid", value: stats.bookings - paidBookings },
  ];

  // Simply display the first 5 bookings instead of trying to sort by date
  const displayedBookings = bookings.slice(0, 5);

  // Bar Chart Data for Bookings by Day
  const bookingsByDay = bookings.reduce((acc, booking) => {
    // Use the 'day' field directly from the API response or fallback to "Unknown"
    const day = booking.day || "Unknown";
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const bookingBarData = Object.keys(bookingsByDay).map(day => ({
    day,
    count: bookingsByDay[day]
  }));

  // Sort by days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  bookingBarData.sort((a, b) => {
    return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
  });

  // Colors for Charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const STATUS_COLORS = ["#4CAF50", "#FFC107", "#F44336", "#9C27B0"];

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <AdminNavbar />
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="hidden md:block w-60">
            <AdminSidebar />
          </div>
          <div className="flex-1 bg-white shadow-md rounded-lg p-6 flex items-center justify-center">
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <AdminNavbar />
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="hidden md:block w-60">
            <AdminSidebar />
          </div>
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <p className="text-lg text-red-500">Error: {error}</p>
            <button 
              onClick={fetchData}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <AdminNavbar />

      {/* Main Content with Sidebar and Dashboard Section */}
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
        {/* Sidebar */}
        <div className="hidden md:block w-60">
          <AdminSidebar />
        </div>

        {/* Right Section (Dashboard with Graphs) */}
        <div className="flex-1">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-black">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium">Students</h3>
              <p className="text-2xl font-bold">{stats.students}</p>
              <p className="text-sm text-gray-600">{activeStudents} verified</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium">Tutors</h3>
              <p className="text-2xl font-bold">{stats.tutors}</p>
              <p className="text-sm text-gray-600">{activeTutors} verified</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium">Assignments</h3>
              <p className="text-2xl font-bold">{stats.assignments}</p>
              <p className="text-sm text-gray-600">{completedAssignments} completed</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium">Bookings</h3>
              <p className="text-2xl font-bold">{stats.bookings}</p>
              <p className="text-sm text-gray-600">{confirmedBookings} confirmed</p>
            </div>
          </div>

          {/* Charts Section */}
          {isClient && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 text-black">
              {/* Overview Pie Chart */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">System Overview</h2>
                <div className="flex justify-center">
                  <PieChart width={300} height={250}>
                    <Pie
                      data={overviewData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {overviewData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                    <Legend />
                  </PieChart>
                </div>
              </div>

              {/* Bookings by Day Bar Chart */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Bookings by Day</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={bookingBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Booking Status Chart */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Booking Status</h2>
                <div className="flex justify-center">
                  <PieChart width={250} height={200}>
                    <Pie
                      data={bookingStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {bookingStatusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                    <Legend />
                  </PieChart>
                </div>
              </div>

              {/* Booking Type Chart */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Booking Type</h2>
                <div className="flex justify-center">
                  <PieChart width={250} height={200}>
                    <Pie
                      data={bookingTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {bookingTypeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                    <Legend />
                  </PieChart>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Section - Now showing first 5-6 bookings instead of "recent" */}
          <div className="bg-white p-4 rounded-lg shadow-md text-black">
            <h2 className="text-lg font-semibold mb-4">Latest Bookings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day/Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedBookings.map((booking, index) => (
                    <tr key={booking._id || booking.booking_id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.booking_id ? booking.booking_id.substring(0, 6) : `BK-${index + 1}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.student?.name || booking.student?.user?.email || 
                         (booking.student_id ? `Student #${booking.student_id.substring(0, 4)}` : 'N/A')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.tutor?.name || booking.tutor?.user?.email || 
                         (booking.tutor_id ? `Tutor #${booking.tutor_id.substring(0, 4)}` : 'N/A')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.day || 'N/A'}, {booking.start_time || 'N/A'}-{booking.end_time || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${booking.amount || booking.price || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.booking_type || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {displayedBookings.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Lessons Section */}
          <div className="bg-white p-4 rounded-lg shadow-md mt-6 text-black">
            <h2 className="text-lg font-semibold mb-4">Upcoming Lessons</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.flatMap((booking) => {
                    // Handle case where lesson_statuses doesn't exist or isn't an array
                    const lessonStatuses = Array.isArray(booking.lesson_statuses) 
                      ? booking.lesson_statuses 
                      : [];
                    
                    return lessonStatuses.map((lesson, lessonIndex) => {
                      // Skip if lesson.date is missing
                      if (!lesson.date) return null;

                      const lessonDate = new Date(lesson.date);
                      const now = new Date();
                      
                      // Only show upcoming lessons (today or future)
                      if (lessonDate >= now) {
                        return (
                          <tr key={`${booking._id || booking.booking_id || lessonIndex}-${lessonIndex}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.booking_id ? booking.booking_id.substring(0, 6) : `BK-${lessonIndex + 1}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lessonDate.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.start_time || 'N/A'}-{booking.end_time || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.student?.name || booking.student?.user?.email || 
                              (booking.student_id ? `Student #${booking.student_id.substring(0, 4)}` : 'N/A')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.tutor?.name || booking.tutor?.user?.email || 
                              (booking.tutor_id ? `Tutor #${booking.tutor_id.substring(0, 4)}` : 'N/A')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                lesson.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                lesson.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                lesson.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {lesson.status || 'Unknown'}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    });
                  }).filter(Boolean)}
                  
                  {bookings.flatMap(booking => Array.isArray(booking.lesson_statuses) ? booking.lesson_statuses : [])
                    .filter(lesson => lesson && lesson.date && new Date(lesson.date) >= new Date()).length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No upcoming lessons found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}