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
                const res = await fetch(`/api/bookings/student/${studentId}`);
                const data = await res.json();
                setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        fetchBookings();
    }, [studentId]);

    const handleDateClick = (date) => {
        const lesson = bookings.find((b) => isSameDay(new Date(b.date), date));
        setSelectedDate(date);
        setLessonDetails(lesson || null);
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
                    const lesson = bookings.find((b) => isSameDay(new Date(b.date), date));
                    let bgColor = "bg-white";
                    let showWarning = false;
                    if (lesson) {
                        if (lesson.status === "Pending") bgColor = "bg-red-500 text-white";
                        else if (lesson.status === "Confirmed") bgColor = "bg-yellow-500 text-[#212121]";
                        else if (lesson.status === "Completed") bgColor = "bg-green-500 text-white";
                        else if (lesson.status === "Reported") {
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
                            <p><strong>Tutor:</strong> {lessonDetails.tutor.name}</p>
                            <p><strong>Time:</strong> {lessonDetails.start_time} - {lessonDetails.end_time}</p>
                            <p><strong>Status:</strong> {lessonDetails.status}</p>
                            {isPast(new Date(lessonDetails.date)) && lessonDetails.status === "Confirmed" && (
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
