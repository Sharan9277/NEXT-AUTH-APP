"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);

  const fetchData = async () => {
    try {
      const studentRes = await fetch("/api/students");
      const tutorRes = await fetch("/api/tutors");

      if (!studentRes.ok || !tutorRes.ok) throw new Error("Failed to fetch data");

      setStudents(await studentRes.json());
      setTutors(await tutorRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load students or tutors");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteStudent = async (student_id) => {
    try {
      const res = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id }),
      });

      const data = await res.json();
      if (res.ok) {
        
        fetchData(); // Refresh the student list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      
      console.error("Error deleting student:", error);
    }
  };

  const handleDeleteTutor = async (tutor_id) => {
    try {
      const res = await fetch("/api/tutors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutor_id }),
      });

      const data = await res.json();
      if (res.ok) {
        
        fetchData(); // Refresh the tutor list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      
      console.error("Error deleting tutor:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <h2 className="text-xl mt-4">Manage Students</h2>
        <ul className="list-disc pl-5">
          {students.map((student) => (
            <li key={student.student_id}>
              {student.name} ({student.email}) - ${student.wallet_balance}
              <button
                onClick={() => handleDeleteStudent(student.student_id)}
                className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <h2 className="text-xl mt-4">Manage Tutors</h2>
        <ul className="list-disc pl-5">
          {tutors.map((tutor) => (
            <li key={tutor.tutor_id}>
              {tutor.name} ({tutor.email}) - ${tutor.hourly_rate}/hr
              <button
                onClick={() => handleDeleteTutor(tutor.tutor_id)}
                className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
