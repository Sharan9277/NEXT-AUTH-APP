"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);

  const fetchData = async () => {
    const studentRes = await fetch("/api/students");
    const tutorRes = await fetch("/api/tutors");
    setStudents(await studentRes.json());
    setTutors(await tutorRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id, type) => {
    await fetch(`/api/${type}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [`${type}_id`]: id }),
    });
    fetchData();
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
              <button onClick={() => handleDelete(student.student_id, "students")} className="ml-4 bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </li>
          ))}
        </ul>

        <h2 className="text-xl mt-4">Manage Tutors</h2>
        <ul className="list-disc pl-5">
          {tutors.map((tutor) => (
            <li key={tutor.tutor_id}>
              {tutor.name} ({tutor.email}) - ${tutor.hourly_rate}/hr
              <button onClick={() => handleDelete(tutor.tutor_id, "tutors")} className="ml-4 bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
