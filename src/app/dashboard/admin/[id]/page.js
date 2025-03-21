"use client";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isClient, setIsClient] = useState(false); // ✅ Ensures client-side rendering

  useEffect(() => {
    setIsClient(true); // ✅ Runs only on the client side
  }, []);

  const fetchData = async () => {
    try {
      const studentRes = await fetch("/api/students");
      const tutorRes = await fetch("/api/tutors");
      const assignmentRes = await fetch("/api/assignments");
      console.log(studentRes, tutorRes, assignmentRes);

      if (!studentRes.ok || !tutorRes.ok || !assignmentRes.ok)  throw new Error("Failed to fetch data");

      setStudents(await studentRes.json());
      setTutors(await tutorRes.json());
      const assignmentData = await assignmentRes.json();
      setAssignments(assignmentData.assignments || []); // Ensure it's an array


    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    console.log("Assignments Data:", assignments);
  }, [assignments]);
  

  useEffect(() => {
    fetchData();
  }, []);

  // Data Counts
  const stats = {
    students: students.length,
    tutors: tutors.length,
    assignments: assignments.length,
  };

  // Pie Chart Data
  const combinedData = [
    { name: "Students", value: stats.students },
    { name: "Tutors", value: stats.tutors },
    { name: "Assignments", value: stats.assignments },
  ];

  const studentData = [{ name: "Students", value: stats.students }];
  const tutorData = [{ name: "Tutors", value: stats.tutors }];
  const assignmentData = [{ name: "Assignments", value: stats.assignments }];

  // Colors for Pie Charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <AdminNavbar />

      {/* Main Content with Sidebar and Dashboard Section */}
      <div className="flex gap-6 p-6">
        {/* Sidebar */}
        <div className="w-60">
          <AdminSidebar />
        </div>

        {/* Right Section (Dashboard with Graphs) */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold font-inter text-black mb-4">Admin Dashboard</h1>

          {/* ✅ Render charts only on the client side */}
          {isClient && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 shadow-md p-4 rounded-lg flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-2 font-inter text-black">Overall Data</h2>
                <PieChart width={300} height={300}>
                  <Pie data={combinedData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                    {combinedData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
