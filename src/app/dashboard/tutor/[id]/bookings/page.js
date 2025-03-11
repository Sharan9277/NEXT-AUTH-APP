"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import TutorNavbar from "@/components/TutorNavbar";
import Sidebar from "@/components/Sidebar";

export default function TutorBookings() {
  const { data: session, status } = useSession();
  const { id } = useParams(); // Tutor ID
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

    // ✅ Redirect if not logged in
    useEffect(() => {
      if (status === "loading") return; // Wait for session to load
  
      if (!session) {
        // alert("Please sign in to access your dashboard.");
        router.push("/login/tutor");
      } else if (session.user.role !== "tutor") {
        alert("Access denied. Only tutors can access this page.");
        router.push("/");
      } else{
        
        fetchBookings();
      }
    }, [session, status]);

  

    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/tutors/${id}/bookings`);
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
    }
  };

 

  const updateBookingStatus = async (booking_id, status) => {
    try {
      const res = await fetch(`/api/bookings/${booking_id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert(`Booking ${status} successfully!`);
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === booking_id ? { ...booking, status } : booking
          )
        );
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  
  const cancelBooking = async (booking_id, status) => {
    try {
      const res = await fetch(`/api/bookings/${booking_id}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert(`Booking ${status} successfully!`);
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === booking_id ? { ...booking, status } : booking
          )
        );
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };


  if (loading || status === "loading") return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex bg-[#F1f1f1] h-full">
        <Sidebar active="Bookings" />
    <div className="mx-auto w-full">
      <TutorNavbar />
        <div className="flex-grow p-6">
          <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
            {bookings.length === 0 ? (
              <p>No bookings available.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Student</th>
                    <th className="border p-2">Day</th>
                    <th className="border p-2">Time</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="border p-2">{booking.student_id?.name || "Unknown"}</td>
                      <td className="border p-2">{booking.slot_id?.day || "N/A"}</td>
                      <td className="border p-2">
                        {booking.slot_id?.start_time} - {booking.slot_id?.end_time}
                      </td>
                      <td className="border p-2">{booking.status}</td>
                      <td className="border p-2">
                        {booking.status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded"
                              onClick={() => updateBookingStatus(booking._id, "Confirmed")}
                            >
                              Accept
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded"
                              onClick={() => cancelBooking(booking._id, "Cancelled")}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
