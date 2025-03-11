"use client";
import { useState, useEffect } from "react";
import StudentNavbar from "@/components/StudentNavbar";

export default function StudentBookings() {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [studentId, setStudentId] = useState(null); // ✅ Store Student ID from session

  // ✅ Fetch student ID from session
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await fetch("/api/get-user-details");
        const data = await res.json();
        if (res.ok) {
          setStudentId(data.user_id);
        } else {
          alert("Error fetching student details.");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    
    fetchStudentData();
  }, []);

  // ✅ Fetch list of available tutors (Using `user_id`)
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch(`/api/tutors`);
        const data = await res.json();
        setTutors(data);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };

    fetchTutors();
  }, []);

  // ✅ Fetch available slots when a tutor is selected (Using `user_id`)
  useEffect(() => {
    if (selectedTutor) {
      const fetchSlots = async () => {
        try {
          const res = await fetch(`/api/tutors/${selectedTutor}/slots`);
          const data = await res.json();
          setSlots(data.slots);
        } catch (error) {
          console.error("Error fetching slots:", error);
        }
      };

      fetchSlots();
    }
  }, [selectedTutor]);

  // ✅ Handle Booking Request
  const handleBooking = async (slotId) => {
    if (!studentId) {
      alert("Error: Student ID not found.");
      return;
    }

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, tutor_id: selectedTutor, slot_id: slotId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Booking successful!");
        setSlots(slots.filter((slot) => slot._id !== slotId)); // ✅ Remove booked slot from UI
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <StudentNavbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Book a Tutor</h1>

        {/* ✅ Tutor Selection */}
        <div className="mb-4">
          <label className="block font-semibold">Select Tutor</label>
          <select
            className="border p-2 w-full rounded"
            onChange={(e) => setSelectedTutor(e.target.value)}
            value={selectedTutor || ""}
          >
            <option value="">Choose a Tutor</option>
            {tutors.map((tutor) => (
              <option key={tutor.user_id}> {/* ✅ Using `user_id` */}
                {tutor.name} (Hourly Rate: ${tutor.hourly_rate})
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Show Available Slots */}
        {selectedTutor && (
          <div>
            <h2 className="text-xl font-bold mb-2">Available Slots</h2>
            {slots.length === 0 ? (
              <p>No available slots</p>
            ) : (
              <ul className="space-y-2">
                {slots.map((slot) => (
                  <li key={slot._id} className="border p-3 rounded flex justify-between">
                    <span>{slot.day}: {slot.start_time} - {slot.end_time}</span>
                    <button
                      onClick={() => handleBooking(slot._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Book
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
