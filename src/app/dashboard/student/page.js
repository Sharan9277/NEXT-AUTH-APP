"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", learning_goals: [] });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      if (session?.user) {
        const res = await fetch(`/api/students?userId=${session.user.id}`);
        const data = await res.json();
        setStudent(data[0]);

        setFormData({
          name: data[0]?.name || "",
          phone: data[0]?.phone || "", // ✅ Default empty if null
          learning_goals: data[0]?.learning_goals || [],
        });
      }
    };
    fetchStudent();
  }, [session]);

  const handleUpdate = async () => {
    const updatedData = {
      student_id: student.student_id,
      ...formData,
      phone: formData.phone.trim() === "" ? null : formData.phone, // ✅ Send null if cleared
    };

    const res = await fetch("/api/students", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      const updatedStudent = await res.json();
      setStudent(updatedStudent.student);
      setIsEditing(false);
    }
  };

  if (!student) return <p>Loading student data...</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
        <h1 className="text-3xl font-bold mb-4">Welcome, {student.name}</h1>
        <p>Email: {session.user.email}</p>

        <p>
          Phone:{" "}
          {isEditing ? (
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border p-1 rounded"
              placeholder="Enter phone number"
            />
          ) : (
            student.phone || "N/A"
          )}
        </p>

        <p className="mt-4 font-semibold">Wallet Balance: ${student.wallet_balance}</p>

        <h2 className="text-xl mt-4">Learning Goals:</h2>
        {isEditing ? (
          <textarea
            value={formData.learning_goals.join(", ")}
            onChange={(e) => setFormData({ ...formData, learning_goals: e.target.value.split(", ") })}
            className="w-full border p-2 rounded"
          />
        ) : (
          <ul className="list-disc pl-5">
            {student.learning_goals.length > 0 ? (
              student.learning_goals.map((goal, index) => <li key={index}>{goal}</li>)
            ) : (
              <p className="text-gray-500">No learning goals set yet.</p>
            )}
          </ul>
        )}

        <button
          onClick={() => (isEditing ? handleUpdate() : setIsEditing(true))}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}
