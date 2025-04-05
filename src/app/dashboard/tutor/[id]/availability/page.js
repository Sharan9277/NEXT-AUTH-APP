"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa";
import TutorNavbar from "@/components/TutorNavbar";
import Sidebar from "@/components/Sidebar";


export default function TutorAvailability() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockedDates, setBlockedDates] = useState([]);
  const [showBlockDatePopup, setShowBlockDatePopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  
  const defaultAvailability = [
    { day: "Sunday", slots: [] },
    { day: "Monday", slots: [] },
    { day: "Tuesday", slots: [] },
    { day: "Wednesday", slots: [] },
    { day: "Thursday", slots: [] },
    { day: "Friday", slots: [] },
    { day: "Saturday", slots: [] },
  ];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      alert("Please sign in to access your dashboard.");
      router.push("/login/tutor");
    } else if (session.user.role !== "tutor") {
      alert("Access denied. Only tutors can access this page.");
      router.push("/");
    } else {
      fetchAvailability();
      fetchBlockedDates();
    }
  }, [session, status]);

  const fetchAvailability = async () => {
    try {
      const res = await fetch(`/api/tutors/${id}/availability`);
      const data = await res.json();
      setAvailability(data.availability.length ? data.availability : defaultAvailability);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailability(defaultAvailability);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const response = await fetch(`/api/tutors/${id}/availability/block`);
      const data = await response.json(); // ✅ Correctly extract JSON response
  
      console.log("API Response:", data); // ✅ Debugging log
  
      if (data && data.blocked_dates) { // ✅ Ensure response contains blocked_dates
        setBlockedDates(data.blocked_dates);
      } else {
        setBlockedDates([]); // ✅ Default empty array to prevent errors
      }
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
    }
  };
  

  const handleBlockDate = async () => {
    if (!selectedDate) {
      alert("Please select a date to block.");
      return;
    }

    try {
      const res = await fetch(`/api/tutors/${id}/availability/block`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, action: "block" }),
      });

      if (res.ok) {
        alert("Date blocked successfully!");
        setBlockedDates([...blockedDates, selectedDate]);
        setShowBlockDatePopup(false);
      } else {
        console.error("Error blocking date:", await res.json());
      }
    } catch (error) {
      console.error("Error blocking date:", error);
    }
  };

  // ✅ Handle unblocking a date
const handleUnblockDate = async (date) => {
  try {
    const res = await fetch(`/api/tutors/${id}/availability/block`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, action: "unblock" }),
    });

    if (res.ok) {
      alert("Date unblocked successfully!");
      setBlockedDates(blockedDates.filter((d) => d !== date));
    } else {
      console.error("Error unblocking date:", await res.json());
    }
  } catch (error) {
    console.error("Error unblocking date:", error);
  }
};


  const handleSlotChange = (day, index, value) => {
    setAvailability((prev) =>
      prev.map((entry) =>
        entry.day === day
          ? { ...entry, slots: entry.slots.map((slot, i) => (i === index ? value : slot)) }
          : entry
      )
    );
  };

  const handleAddSlot = (day) => {
    setAvailability((prev) =>
      prev.map((entry) =>
        entry.day === day ? { ...entry, slots: [...entry.slots, "2:00 PM"] } : entry
      )
    );
  };

  const handleRemoveSlot = (day, index) => {
    setAvailability((prev) =>
      prev.map((entry) =>
        entry.day === day
          ? { ...entry, slots: entry.slots.filter((_, i) => i !== index) }
          : entry
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tutors/${id}/availability/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability }),
      });
      if (res.ok) {
        alert("Availability updated successfully!");
        router.push(`/dashboard/tutor/${id}/availability`);
      } else {
        console.error("Error updating availability:", await res.json());
      }
    } catch (error) {
      console.error("Error updating tutor availability:", error);
    }
  };

  if (loading || status === "loading") return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex bg-gray-100 h-screen text-black">
      <Sidebar active="Availability" />
      <div className="mx-auto w-full">
        <TutorNavbar />
        <div className="flex-grow p-6">
          <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Manage Availability</h1>
              <button
                onClick={() => setShowBlockDatePopup(true)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Block Dates
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {availability.map((entry) => (
                <div key={entry.day} className="mb-4 border p-4 rounded">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold">{entry.day}</h2>
                    <button type="button" onClick={() => handleAddSlot(entry.day)} className="text-blue-500">
                      <FaPlus />
                    </button>
                  </div>
                  {entry.slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <select
                        value={slot}
                        onChange={(e) => handleSlotChange(entry.day, index, e.target.value)}
                        className="border p-2 rounded w-full"
                      >
                        {[...Array(12).keys()].map((hour) => (
                              [
                                <option key={`${hour + 1}-AM`} value={`${hour + 1}:00 AM`}>
                                  {`${hour + 1}:00 AM`}
                                </option>,
                                <option key={`${hour + 1}-PM`} value={`${hour + 1}:00 PM`}>
                                  {`${hour + 1}:00 PM`}
                                </option>
                              ]
                            ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(entry.day, index)}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
              <div className="text-center">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Save Availability
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Block Date Popup */}
{showBlockDatePopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-bold mb-4">Manage Blocked Dates</h2>

      {/* Select Date to Block */}
      <input
        type="date"
        className="border p-2 rounded w-full mb-4"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* Blocked Dates List */}
      {blockedDates.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Blocked Dates:</h3>
          <ul className="list-disc pl-5">
            {blockedDates.map((date, index) => (
              <li key={index} className="flex justify-between items-center text-gray-700">
                {date}
                <button
                  onClick={() => handleUnblockDate(date)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setShowBlockDatePopup(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
        <button
          onClick={handleBlockDate}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Block Date
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
