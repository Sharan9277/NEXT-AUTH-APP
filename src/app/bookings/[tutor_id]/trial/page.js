"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import StudentNavbar from "@/components/StudentNavbar";
import Topbar from "@/components/Topbar";

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
  const [duration, setDuration] = useState(30);
  const [totalAmount, setTotalAmount] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);

  // Enhanced Calendar Navigation Component
  const CalendarNavigation = ({ weekOffset, prevWeek, nextWeek }) => {
    const formatDateRange = () => {
      const currentWeek = getCurrentWeek(weekOffset);
      if (currentWeek.length === 0) return "";
      
      const firstDay = new Date(currentWeek[0].fullDate);
      const lastDay = new Date(currentWeek[6].fullDate);
      
      const options = { month: 'short', day: 'numeric' };
      return `${firstDay.toLocaleDateString('en-US', options)} – ${lastDay.toLocaleDateString('en-US', options)}, ${firstDay.getFullYear()}`;
    };

    return (
      <div className="flex justify-start items-center mb-6">
        <div className="inline-flex bg-gray-100 text-black">
          <button 
            onClick={prevWeek}
            className="flex items-center justify-center w-10 rounded-l-md border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
            aria-label="Previous week"
            disabled={weekOffset <= 0} // Disable going to past weeks
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button 
            onClick={nextWeek}
            className="flex items-center justify-center w-10 rounded-r-md border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
            aria-label="Next week"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          
          <div className="flex items-center justify-center px-6 py-2 bg-white">
            <span className="text-[20px] text-black font-semibold">{formatDateRange()}</span>
          </div>
        </div>
      </div>
    );
  };

  // Function to clear selection
  const clearSelectedSlot = () => {
    setSelectedSlot(null);
    setSelectedDate(null);
  };

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
    console.log("✅ Selected Date:", day.fullDate);

    setSelectedSlot({
      _id: `${day.fullDate}-${slot}`,
      day: day.day, 
      date: day.fullDate,
      start_time: slot,
      end_time: calculateEndTime(slot),
      tutor_id: tutor_id,
    });

    setSelectedDate(day.fullDate);
  };

  // ✅ Handle Confirm Booking
  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedDate) {
      alert("Please select a valid date and time slot.");
      return;
    }

    const bookingDetails = {
      tutor_id: selectedSlot.tutor_id,
      student_id: session?.user?.id,
      day: selectedSlot.day,
      date: selectedSlot.date,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
      amount: totalAmount.toFixed(2),
      booking_type: "trial",
    };

    console.log("✅ Booking Details Sent to Checkout:", bookingDetails);

    // Save booking details to localStorage
    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

    // Redirect to Checkout Page
    router.push("/checkout");
  };

  const calculateEndTime = (startTime) => {
    const [hour, minute, period] = startTime.match(/(\d+):(\d+)\s?(AM|PM)/).slice(1);
    let endHour = parseInt(hour);
    let endMinute = parseInt(minute) + duration;
  
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
    
    // Start from today instead of the beginning of the week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + offset * 7);
  
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      
      // Check if this date is today
      const isToday = today.toDateString() === date.toDateString();
      
      return {
        day: date.toLocaleDateString("en-US", { weekday: "long" }),
        date: date.getDate(),
        displayDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: date.toISOString().split("T")[0],
        isToday: isToday, // Add this flag to identify the current day
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
    // Only allow going back if we're not already at the current week
    if (weekOffset > 0) {
      setWeekOffset((prev) => prev - 1);
      setCurrentWeek(getCurrentWeek(weekOffset - 1));
    }
  };

  if (!tutor) return <p className="text-center mt-10">Loading tutor details...</p>;

  return (
    <div className="relative min-h-screen bg-gray-50">
      <StudentNavbar />
      <Topbar />
      
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Column (Tutor Info & Duration Selection) */}
          <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full overflow-hidden h-40 w-40">
                <Image
                  src={tutor.profile_image || "/default-avatar.png"}
                  width={160}
                  height={160}
                  alt="Tutor Profile"
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mt-4 text-black">{tutor.name}</h2>
            </div>
            
            <div className="mt-8">
              <label className="block text-black font-semibold">Trial Lesson Duration</label>
              <select
                className="mt-2 block w-full p-2 border border-gray-300 rounded text-black"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              >
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            
            {/* Show Selected Slot Information - Now horizontally aligned */}
            {selectedSlot && (
              <div className="mt-8 p-4 border  rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium text-black text-[13px]">
                      {new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}, 
                      {' '}{selectedSlot.start_time} - {selectedSlot.end_time}
                    </span>
                  </div>
                  <button 
                    onClick={clearSelectedSlot}
                    className="ml-2 w-6 h-6 flex items-center justify-center   hover:bg-blue-200 text-black"
                    aria-label="Clear selection"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Availability Grid) */}
          <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg p-6">
            {/* Enhanced Calendar Navigation */}
            <CalendarNavigation 
              weekOffset={weekOffset}
              prevWeek={prevWeek}
              nextWeek={nextWeek}
            />

            {/* Calendar Grid with time slots displayed by day */}
            <div className="grid grid-cols-7 gap-4">
              {currentWeek.map((day, index) => {
                const isBlocked = blockedDates.has(day.fullDate);
                
                return (
                  <div key={index} className="text-center">
                    {/* Day Header Section - with its own background when it's today */}
                    <div className={`p-2 border-t-2 border-black ${day.isToday ? 'bg-at-light-orange' : ''}`}>
                      <div className={`font-semibold text-black`}>
                        {day.day.substring(0, 3)}
                      </div>
                      <div className={`text-lg font-bold text-black`}>
                        {day.date}
                      </div>
                    </div>
                    
                    {/* Gap between sections */}
                    <div className="h-1"></div>
                    
                    {/* Time Slots Section - with its own background when it's today */}
                    <div className={`flex flex-col gap-2 ${day.isToday ? 'bg-at-light-orange' : ''}`}>
                      {isBlocked ? (
                        <p className="text-red-500 text-sm">Unavailable</p>
                      ) : (
                        availability[day.day] && availability[day.day].length > 0 ? (
                          availability[day.day].map((slot, slotIndex) => {
                            const isSelected = selectedSlot && selectedSlot._id === `${day.fullDate}-${slot}`;
                            
                            return (
                              <button
                                key={slotIndex}
                                onClick={() => handleSlotSelection(slot, day)}
                                className={`text-sm rounded ${
                                  isSelected 
                                    ? "bg-at-light-orange p-2 text-black font-semibold" 
                                    : day.isToday
                                    ? "text-black p-2 font-semibold hover:bg-yellow-100 underline"
                                    : "text-black font-semibold p-2 hover:bg-at-light-orange underline"
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-black text-sm p-2">No slots</p>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Bottom Booking Button */}
        {selectedSlot && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <p className="font-medium text-black">{selectedSlot.day}, {new Date(selectedSlot.date).toLocaleDateString()} • {selectedSlot.start_time} - {selectedSlot.end_time}</p>
                <p className="text-sm text-black">${totalAmount.toFixed(2)} • {duration} minutes</p>
              </div>
              <button
                onClick={handleConfirmBooking}
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded"
              >
                Book Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}