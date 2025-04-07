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
  const [bookedDatesMap, setBookedDatesMap] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState(new Set());
  const [hourlyRate, setHourlyRate] = useState(0);
  const [duration, setDuration] = useState(30);
  const [totalAmount, setTotalAmount] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [currentWeek, setCurrentWeek] = useState([]);

  // Enhanced Calendar Navigation Component
  const CalendarNavigation = ({ weekOffset, prevWeek, nextWeek }) => {
    const formatDateRange = () => {
      if (currentWeek.length === 0) return "";
      
      const firstDay = new Date(currentWeek[0].fullDate);
      const lastDay = new Date(currentWeek[6].fullDate);
      
      const options = { month: 'short', day: 'numeric' };
      return `${firstDay.toLocaleDateString('en-US', options)} – ${lastDay.toLocaleDateString('en-US', options)}, ${firstDay.getFullYear()}`;
    };

    return (
      <div className="flex justify-start items-center mb-6 overflow-x-auto w-full">
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
            <span className="text-base md:text-xl text-black font-semibold">{formatDateRange()}</span>
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

  // ✅ Fetch Tutor Availability with updated booking data structure
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`/api/tutors/${tutor_id}/availability`);
        const data = await res.json();
  
        console.log("✅ API Response:", data);
  
        if (data.availability)  {
          // Convert array to object for easier access - the structure has changed
          const availabilityMap = {};
          const bookedDates = {};
          
          data.availability.forEach(({ day, slots }) => {
            // Store time slots for each day and sort them in ascending order
            availabilityMap[day] = slots.map(slot => slot.time).sort((a, b) => {
              // Function to convert 12h time format to minutes for sorting
              const timeToMinutes = (timeStr) => {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                
                if (period === 'PM' && hours !== 12) {
                  hours += 12;
                } else if (period === 'AM' && hours === 12) {
                  hours = 0;
                }
                
                return hours * 60 + minutes;
              };
              
              return timeToMinutes(a) - timeToMinutes(b);
            });
            
            // Store booked dates for each day and time slot
            slots.forEach(slot => {
              const key = `${day}-${slot.time}`;
              bookedDates[key] = slot.booked_dates || [];
            });
          });
  
          console.log("✅ Transformed Availability:", availabilityMap);
          console.log("✅ Booked Dates Map:", bookedDates);
          
          setAvailability(availabilityMap);
          setBookedDatesMap(bookedDates);
        } else {
          setAvailability({});
          setBookedDatesMap({});
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

  // Generate correct week days with accurate day-date mapping
  useEffect(() => {
    const generateWeekDays = (offset = 0) => {
      const today = new Date();
      
      // Create a date for today but reset the time to 00:00:00 to avoid time zone issues
      today.setHours(0, 0, 0, 0);
      
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      // Apply week offset
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + (offset * 7));
      
      // Find the current day of week (0-6, with 0 being Sunday)
      const currentDayIndex = currentDate.getDay();
      
      // Create a NEW date object for start of week (Sunday)
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDayIndex);
      
      console.log("Start of week date:", startOfWeek.toDateString());
  
      const weekDays = [];
      
      for (let i = 0; i < 7; i++) {
        // Create a new date object for each day to avoid reference issues
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        const dayIndex = date.getDay();
        const dayName = daysOfWeek[dayIndex];
        
        // Ensure consistent date format YYYY-MM-DD that works reliably
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        const isToday = date.toDateString() === today.toDateString();
        
        weekDays.push({
          day: dayName,
          shortDay: dayName.substring(0, 3),
          date: date.getDate(),
          displayDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          fullDate: formattedDate,
          isToday: isToday,
        });
      }
      
      return weekDays;
    };
    
    const generatedWeek = generateWeekDays(weekOffset);
    console.log("Generated week:", generatedWeek);
    setCurrentWeek(generatedWeek);
  }, [weekOffset]);

  // Check if a specific slot on a specific date is booked
  const isSlotBooked = (dayName, slot, dateString) => {
    const key = `${dayName}-${slot}`;
    const bookedDatesForSlot = bookedDatesMap[key] || [];
    
    // Make sure the date format matches what's stored in the bookedDatesMap
    return bookedDatesForSlot.includes(dateString);
  };

  // Updated slot selection to use the day's actual date
  const handleSlotSelection = (slot, day) => {
    if (!slot || !day.fullDate) {
      console.error("❌ Invalid slot selected:", slot);
      alert("Error: Selected slot data is incomplete. Please choose another slot.");
      return;
    }
  
    console.log(`Selected: ${day.day} (${day.fullDate}) at ${slot}`);
    
    // Make sure we're using the consistent fullDate format (YYYY-MM-DD)
    setSelectedSlot({
      _id: `${day.fullDate}-${slot}`,
      day: day.day,
      date: day.fullDate, // Use the pre-formatted fullDate
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
      booking_type: "individual",
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

  // ✅ Navigate to Next Week
  const nextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };
  
  // ✅ Navigate to Previous Week
  const prevWeek = () => {
    // Only allow going back if we're not already at the current week
    if (weekOffset > 0) {
      setWeekOffset((prev) => prev - 1);
    }
  };

  // Format date for display in the booking confirmation
  const formatBookingDate = (dateString) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName}, ${date.toLocaleDateString()}`;
  };

  // For debugging - log selected slot information
  useEffect(() => {
    if (selectedSlot) {
      console.log("Selected slot:", selectedSlot);
      console.log("Selected date:", selectedDate);
      // Convert the ISO date string to a JavaScript Date
      const jsDate = new Date(selectedSlot.date);
      console.log("JS Date object:", jsDate);
      console.log("Day of week:", jsDate.getDay()); // 0-6, where 0 is Sunday
      console.log("Formatted date:", jsDate.toLocaleDateString());
    }
  }, [selectedSlot, selectedDate]);

  if (!tutor) return <p className="text-center mt-10">Loading tutor details...</p>;

  return (
    <div className="relative min-h-screen z-30 flex flex-col bg-white">
      <StudentNavbar />
      <Topbar />
      
      <div className="container mx-auto p-3 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
          {/* Left Column (Tutor Info & Duration Selection) */}
          <div className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-4 md:p-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full overflow-hidden h-24 w-24 md:h-40 md:w-40">
                <Image
                  src={tutor.profile_image || "/default-avatar.png"}
                  width={160}
                  height={160}
                  alt="Tutor Profile"
                  className="object-cover"
                />
              </div>
              <h2 className="text-lg md:text-xl font-bold mt-4 text-black">{tutor.name}</h2>
            </div>
            
            <div className="mt-6 md:mt-8">
              <label className="block text-black font-semibold">Individual Lesson Duration</label>
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
              <div className="mt-6 md:mt-8 p-3 md:p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium text-black text-xs md:text-sm">
                      {selectedSlot.day}, {new Date(selectedSlot.date).toLocaleDateString()}, 
                      {' '}{selectedSlot.start_time} - {selectedSlot.end_time}
                    </span>
                  </div>
                  <button 
                    onClick={clearSelectedSlot}
                    className="ml-2 w-6 h-6 flex items-center justify-center hover:bg-blue-200 text-black"
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
          <div className="w-full lg:w-2/3 bg-white shadow-md rounded-lg p-4 md:p-6">
            {/* Enhanced Calendar Navigation */}
            <CalendarNavigation 
              weekOffset={weekOffset}
              prevWeek={prevWeek}
              nextWeek={nextWeek}
            />

            {/* Mobile Week Slider View - Visible only on small screens */}
            <div className="block md:hidden mb-4">
              <div className="flex flex-row overflow-x-auto space-x-3 pb-2">
                {currentWeek.map((day, index) => (
                  <div 
                    key={index} 
                    className={`flex-shrink-0 p-2 rounded-lg w-16 text-center text-black ${
                      day.isToday ? 'bg-at-light-orange' : 'bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-xs">{day.shortDay}</div>
                    <div className="text-base font-bold">{day.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Grid with time slots - visible on medium and larger screens */}
            <div className="hidden md:grid grid-cols-7 gap-2 md:gap-4">
            {currentWeek.map((day, index) => {
              const isBlocked = blockedDates.has(day.fullDate);
              
              return (
                <div key={index} className="text-center">
                  {/* Day Header Section */}
                  <div className={`p-2 border-t-2 border-black ${day.isToday ? 'bg-at-light-orange' : ''}`}>
                    <div className={`font-semibold text-black`}>
                      {day.shortDay}
                    </div>
                    <div className={`text-lg font-bold text-black`}>
                      {day.date}
                    </div>
                    {/* Remove the debug date display that's causing confusion */}
                    {/* <div className="text-xs text-gray-500">
                      {new Date(day.fullDate).toLocaleDateString()}
                    </div> */}
                  </div>
                  
                  {/* Gap between sections */}
                  <div className="h-1"></div>
                  
                  {/* Time Slots Section */}
                  <div className={`flex flex-col gap-2 ${day.isToday ? 'bg-at-light-orange' : ''}`}>
                    {isBlocked ? (
                      <p className="text-red-500 text-sm p-2">Unavailable</p>
                    ) : (
                      // Find available slots for this specific day of the week
                      availability[day.day] && availability[day.day].length > 0 ? (
                        availability[day.day].map((slot, slotIndex) => {
                          // Check if this specific slot on this specific date is booked
                          const isBooked = isSlotBooked(day.day, slot, day.fullDate);
                          const isSelected = selectedSlot && selectedSlot._id === `${day.fullDate}-${slot}`;
                          
                          // Only render slots that aren't booked on this specific date
                          return !isBooked ? (
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
                          ) : null; // Don't render booked slots
                        }).filter(Boolean) // Filter out null values (booked slots)
                      ) : (
                        <p className="text-black text-sm p-2">No slots</p>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

            {/* Mobile Day View - Shows slots for each day vertically on small screens */}
            <div className="md:hidden mt-4">
              {currentWeek.map((day, index) => {
                const isBlocked = blockedDates.has(day.fullDate);
                
                return (
                  <div key={index} className="mb-6">
                    <div className={`p-2 mb-2 border-l-4 ${
                      day.isToday ? 'border-at-light-orange bg-at-light-orange' : 'border-gray-300'
                    }`}>
                      <h3 className="font-bold text-black">
                        {day.day}, {day.displayDate}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {isBlocked ? (
                        <p className="text-red-500 text-sm p-2 w-full">Unavailable</p>
                      ) : (
                        availability[day.day] && availability[day.day].length > 0 ? (
                          availability[day.day].map((slot, slotIndex) => {
                            const isBooked = isSlotBooked(day.day, slot, day.fullDate);
                            const isSelected = selectedSlot && selectedSlot._id === `${day.fullDate}-${slot}`;
                            
                            return !isBooked ? (
                              <button
                                key={slotIndex}
                                onClick={() => handleSlotSelection(slot, day)}
                                className={`text-sm rounded-full px-3 py-1 border ${
                                  isSelected 
                                    ? "bg-at-light-orange border-orange-400 text-black font-semibold" 
                                    : "border-gray-300 text-black hover:bg-gray-100"
                                }`}
                              >
                                {slot}
                              </button>
                            ) : null;
                          }).filter(Boolean)
                        ) : (
                          <p className="text-black text-sm p-2 w-full">No slots available</p>
                        )
                      )}
                      
                      {/* Show a message if all slots are booked on this date */}
                      {!isBlocked && availability[day.day] && availability[day.day].length > 0 && 
                       availability[day.day].every(slot => isSlotBooked(day.day, slot, day.fullDate)) && (
                        <p className="text-red-500 text-sm p-2 w-full">All slots booked</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Bottom Booking Button - more responsive */}
        {selectedSlot && (
          <div className="fixed bottom-0 left-0 right-0 p-3 md:p-4 bg-white border-t shadow-lg z-40">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <div>
                <p className="font-medium text-black text-sm md:text-base">
                  {selectedSlot.day}, {new Date(selectedSlot.date).toLocaleDateString()} • {selectedSlot.start_time} - {selectedSlot.end_time}
                </p>
                <p className="text-xs md:text-sm text-black">${totalAmount.toFixed(2)} • {duration} minutes</p>
              </div>
              <button
                onClick={handleConfirmBooking}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-medium px-4 md:px-6 py-2 rounded"
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