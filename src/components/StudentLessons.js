import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, isPast } from "date-fns";

const MyLessons = ({ studentId }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [lessonDetails, setLessonDetails] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch(`/api/students/${studentId}/bookings`);
                const data = await res.json();
                
                console.log("Fetched Bookings:", data); // Debugging
        
                setBookings(data.bookings || []); // ✅ Ensures `bookings` is always an array
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setBookings([]); // ✅ Set an empty array in case of error
            }
        };        
        fetchBookings();
    }, [studentId]);

    const handleDateClick = (date) => {
        console.log("Clicked Date:", format(date, "yyyy-MM-dd"));
    
        const lesson = Array.isArray(bookings)
            ? bookings.find((b) => {
                if (!b.lesson_statuses || b.lesson_statuses.length === 0) return false;
    
                return b.lesson_statuses.some((lesson) => {
                    console.log("Lesson Date:", lesson.date, "vs Calendar Date:", format(date, "yyyy-MM-dd"));
                    return isSameDay(new Date(lesson.date), date);
                });
            })
            : undefined;
    
        setSelectedDate(date);
        setLessonDetails(lesson || null);
    
        console.log("Selected Date:", date, "Lesson Details:", lesson);
    };
    

    const handleReportIssue = async () => {
        if (!lessonDetails) return;

        try {
            const res = await fetch(`/api/bookings/report/${lessonDetails.booking_id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: lessonDetails.date })
            });
            if (res.ok) {
                alert("Lesson reported as not happened.");
            } else {
                alert("Failed to report lesson.");
            }
        } catch (error) {
            console.error("Error reporting lesson:", error);
        }
    };

    const renderCalendar = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const days = [];
        let day = startDate;
        while (day <= endDate) {
            days.push(day);
            day = addDays(day, 1);
        }

        return (
            <div className="grid grid-cols-7 gap-1">
                
                {days.map((date, index) => {


                // Find a lesson that matches the calendar date
                const lesson = Array.isArray(bookings)
                    ? bookings.find((b) => {
                        if (!b.lesson_statuses || b.lesson_statuses.length === 0) return false;

                        return b.lesson_statuses.some((lesson) => {

                            return isSameDay(new Date(lesson.date), date);
                        });
                    })
                    : undefined;

                    const lessonStatus = lesson
                    ? lesson.lesson_statuses.find((ls) => isSameDay(new Date(ls.date), date))?.status
                    : undefined;

                let bgColor = "bg-white";
                let showWarning = false;

                if (lesson) {
                    if (lessonStatus === "Pending") bgColor = "bg-red-500 text-white";
                    else if (lessonStatus === "Confirmed") bgColor = "bg-yellow-500 text-[#212121]";
                    else if (lessonStatus === "Completed") bgColor = "bg-green-500 text-white";
                    else if (lessonStatus === "Reported") {
                        bgColor = "bg-green-500";
                        showWarning = true;
                    }
                }

                return (
                    <div
                        key={index}
                        className={`p-3 border rounded-md text-center text-black font-inter cursor-pointer ${bgColor}`}
                        onClick={() => handleDateClick(date)}
                    >
                        {format(date, "d")} {showWarning && "⚠️"}
                    </div>
                );
            })}



            </div>
        );
    };

    return (
        <div className="flex space-x-6">
            <div className="w-2/3 p-4 bg-gray-100 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <button className="text-black" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>&#8592;</button>
                    <h2 className="text-lg font-bold font-inter text-black">{format(currentMonth, "MMMM yyyy")}</h2>
                    <button className="text-black" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>&#8594;</button>
                </div>
                <div className="grid grid-cols-7 font-bold bg-gray-200 p-2 rounded-md">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center font-bold font-inter text-black">{day}</div>
                    ))}
                </div>
                {renderCalendar()}
            </div>
            {selectedDate && (
    <div className="w-1/3 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-2 text-black">Lesson Details</h3>
        {lessonDetails ? (
            <div className="text-black">
                <p><strong>Tutor:</strong> {lessonDetails.tutor_id.name}</p>
                <p><strong>Time:</strong> {lessonDetails.start_time} - {lessonDetails.end_time}</p>

                {/* Find the lesson status for the selected date */}
                <p><strong>Status:</strong> 
                    {lessonDetails.lesson_statuses.find((ls) => 
                        isSameDay(new Date(ls.date), selectedDate)
                    )?.status || "No Status Available"}
                </p>

                {isPast(new Date(selectedDate)) && lessonDetails.lesson_statuses.find((ls) => 
                        isSameDay(new Date(ls.date), selectedDate)
                    )?.status === "Completed" && (
                    <button
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                        onClick={handleReportIssue}
                    >
                        Report as Not Happened
                    </button>
                )}
            </div>
        ) : (
            <p>No lesson scheduled.</p>
        )}
    </div>
)}

        </div>
    );
};

export default MyLessons;
