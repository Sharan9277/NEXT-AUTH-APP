"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import StudentNavbar from "@/components/StudentNavbar";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";


export default function BookingPage() {
    const { data: session } = useSession();
  const { tutor_id } = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState(null);
  const [availability, setAvailability] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState(new Set());
  const [hourlyRate, setHourlyRate] = useState(0);
  const [duration, setDuration] = useState(25); // Default trial duration
  const [totalAmount, setTotalAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // ✅ Fetch Tutor Details
  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const res = await fetch(`/api/tutors/${tutor_id}`);
        const data = await res.json();
        setTutor(data);
        setHourlyRate(data.hourly_rate || 0);
      } catch (error) {
        console.error("Error fetching tutor data:", error);
      }
    };

    fetchTutorData();
  }, [tutor_id]);

  // ✅ Fetch Tutor Availability
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`/api/tutors/${tutor_id}/availability`);
        const data = await res.json();
  
        console.log("✅ API Response:", data);
  
        if (data.availability) {
          // Convert array to object for easier access
          const availabilityMap = {};
          data.availability.forEach(({ day, slots }) => {
            availabilityMap[day] = slots;
          });
  
          console.log("✅ Transformed Availability:", availabilityMap);
          setAvailability(availabilityMap);
        } else {
          setAvailability({});
        }
  
        // ✅ Store blocked dates separately
        if (data.blocked_dates) {
          setBlockedDates(new Set(data.blocked_dates)); // Use a Set for faster lookup
        } else {
          setBlockedDates(new Set());
        }
      } catch (error) {
        console.error("❌ Error fetching availability:", error);
      }
    };
  
    fetchAvailability();
  }, [tutor_id]);

  useEffect(() => {
    const pricePerMinute = hourlyRate / 60;
    setTotalAmount(pricePerMinute * duration);
  }, [hourlyRate, duration]);
  
  

  // ✅ Handle Slot Selection
  const handleSlotSelection = (slot, day) => {
    if (!slot || !day.fullDate) {
        console.error("❌ Invalid slot selected:", slot);
        alert("Error: Selected slot data is incomplete. Please choose another slot.");
        return;
    }

    console.log("✅ Slot Selected:", slot);
    console.log("✅ Selected Date:", day.fullDate); // ✅ Correctly storing the full date

    setSelectedSlot({
        _id: `${day.fullDate}-${slot}`, // ✅ Unique slot ID using full date
        day: day.day, // ✅ Store the correct weekday name
        date: day.fullDate, // ✅ Store the selected full date
        start_time: slot,
        end_time: calculateEndTime(slot),
        tutor_id: tutor_id,
    });

    setSelectedDate(day.fullDate); // ✅ Store the selected date
    setShowConfirm(true);
};

  

  // ✅ Handle Confirm Booking
  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedDate) {
        alert("Please select a valid date and time slot.");
        return;
    }

    const bookingDetails = {
        tutor_id: selectedSlot.tutor_id,
        student_id: session.user.id,
        day: selectedSlot.day, // ✅ Store correct weekday
        date: selectedSlot.date, // ✅ Store correct full date (YYYY-MM-DD)
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        amount: totalAmount.toFixed(2), 
        booking_type: "trial", 
    };

    console.log("✅ Booking Details Sent to Checkout:", bookingDetails); // ✅ Debugging

    // ✅ Save booking details to localStorage
    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

    // ✅ Redirect to Checkout Page
    router.push("/checkout");
};

  

  const calculateEndTime = (startTime) => {
    const [hour, minute, period] = startTime.match(/(\d+):(\d+)\s?(AM|PM)/).slice(1);
    let endHour = parseInt(hour);
    let endMinute = parseInt(minute) + 60; // ✅ Assuming 1-hour slots
  
    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }
  
    if (endHour > 12) {
      endHour -= 12;
    }
  
    return `${endHour}:${endMinute.toString().padStart(2, "0")} ${period}`;
  };
  
  
  

  const getCurrentWeek = (offset = 0) => {
    const today = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay() + offset * 7); // ✅ Ensure Sunday start
  
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return {
        day: date.toLocaleDateString("en-US", { weekday: "long" }),
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: date.toISOString().split("T")[0], // ✅ Use full date for accurate mapping
      };
    });
  };
  
  // ✅ Initialize with the current week
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  
  // ✅ Navigate to Next Week
  const nextWeek = () => {
    setWeekOffset((prev) => prev + 1);
    setCurrentWeek(getCurrentWeek(weekOffset + 1));
  };
  
  // ✅ Navigate to Previous Week
  const prevWeek = () => {
    setWeekOffset((prev) => prev - 1);
    setCurrentWeek(getCurrentWeek(weekOffset - 1));
  };


  if (!tutor) return <p className="text-center mt-10">Loading tutor details...</p>;

  return (
    <div className="relative min-h-screen bg-white">
      <StudentNavbar />
      <Topbar />
    <div className="container mx-auto p-6 flex flex-row gap-6">
      {/* ✅ Left Column (Tutor Info & Duration Selection) */}
      <div className="w-1/4 bg-white shadow-md rounded-lg p-6">
        <Image
          src={tutor.profile_image || "/default-avatar.png"}
          width={160}
          height={160}
          alt="Tutor Profile"
          className="rounded-full mx-auto"
        />
        <h2 className="text-xl font-bold text-center mt-4 text-black">{tutor.name}</h2>
        
        <label className="block text-black font-semibold mt-4">Trial Lesson Duration</label>
        <select
          className="border p-2 w-full text-black rounded mt-2"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          {[25, 30, 45, 50, 60].map((time) => (
            <option key={time} value={time}>
              {time} minutes
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Right Column (Availability Grid) */}
      <div className="w-3/4 bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <button className="p-2 bg-white text-black rounded" onClick={prevWeek}>←</button>
          <h2 className="text-xl font-bold text-black">Select a Time Slot</h2>
          <button className="p-2 bg-white text-black rounded" onClick={nextWeek}>→</button>
        </div>

        {/* ✅ Weekly Grid */}
        <div className="grid grid-cols-7 gap-4 text-center border-t border-gray-300 pt-4">
        {currentWeek.map((day, index) => {
  const isBlocked = blockedDates.has(day.fullDate); // ✅ Check if the date is blocked

  return (
    <div key={index} className="flex flex-col items-center text-black">
      <div className="font-bold">{day.day}</div>
      <div className="text-black">{day.date}</div>

      <div className="mt-2 flex flex-col gap-2">
        {isBlocked ? ( 
          // ✅ Show "Blocked" message if the date is in blockedDates
          <p className="text-red-500">Blocked</p>
        ) : (
          (availability[day.day] && availability[day.day].length > 0) ? (
            availability[day.day].map((slot, slotIndex) => (
              <button
                key={slotIndex}
                onClick={() =>
                  handleSlotSelection(
                    slot, day)
                }
                className={`w-full rounded ${
                  selectedSlot?._id === `${day.day}-${slot}` ? "p-2 bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {slot}
              </button>
            ))
          ) : (
            <p className="text-black">No slots</p>
          )
        )}
      </div>
    </div>
  );
})}

</div>


        {/* ✅ Confirm Button (Hidden Initially) */}
        {showConfirm && (
          <div className="mt-6 text-center">
            <button
              onClick={handleConfirmBooking}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
