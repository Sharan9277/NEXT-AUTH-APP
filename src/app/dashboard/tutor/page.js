"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

export default function TutorDashboard() {
  const { data: session } = useSession();
  const [tutor, setTutor] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", subject_expertise: [], hourly_rate: 0 });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTutor = async () => {
      if (session?.user?.email) {
        const res = await fetch(`/api/tutors?email=${session.user.email}`);
        const data = await res.json();
        setTutor(data[0]);
        setFormData({
          name: data[0]?.name,
          phone: data[0]?.phone,
          subject_expertise: data[0]?.subject_expertise || [],
          hourly_rate: data[0]?.hourly_rate,
        });
      }
    };
    fetchTutor();
  }, [session]);

  const handleUpdate = async () => {
    const res = await fetch("/api/tutors", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutor_id: tutor.tutor_id, ...formData }),
    });
    if (res.ok) {
      const updatedTutor = await res.json();
      setTutor(updatedTutor.tutor);
      setIsEditing(false);
    }
  };

  if (!tutor) return <p>Loading tutor data...</p>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome, {tutor.name}</h1>
        <p>Email: {session.user.email}</p>
        <p>Phone: {isEditing ? <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /> : tutor.phone}</p>
        <p>Hourly Rate: ${isEditing ? <input type="number" value={formData.hourly_rate} onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })} /> : tutor.hourly_rate}</p>

        <h2 className="text-xl mt-4">Subjects of Expertise:</h2>
        {isEditing ? (
          <textarea
            value={formData.subject_expertise.join(", ")}
            onChange={(e) => setFormData({ ...formData, subject_expertise: e.target.value.split(", ") })}
          />
        ) : (
          <ul className="list-disc pl-5">
            {tutor.subject_expertise.map((subject, index) => (
              <li key={index}>{subject}</li>
            ))}
          </ul>
        )}

        <button onClick={() => (isEditing ? handleUpdate() : setIsEditing(true))} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}
