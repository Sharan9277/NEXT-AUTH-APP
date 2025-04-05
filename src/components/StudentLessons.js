"use client";
import { useState, useEffect } from "react";

const MyLessons = ({ studentId }) => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/students/${studentId}/bookings`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                
                const data = await response.json();
                
                // Check the structure of the response and extract bookings array
                const bookingsArray = Array.isArray(data) ? data : 
                                     (data.bookings ? data.bookings : 
                                     (data.data ? data.data : []));
                
                setBookings(bookingsArray);
                
                console.log("Bookings data received:", data);
                console.log("Processed bookings array:", bookingsArray);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (studentId) {
            fetchBookings();
        }
    }, [studentId]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full">Loading bookings...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    // Ensure bookings is an array before mapping
    const bookingsToRender = Array.isArray(bookings) ? bookings : [];

    if (bookingsToRender.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <p className="text-gray-500 text-lg mb-4">You don't have any lessons booked yet.</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                    Book a Lesson
                </button>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Date not specified';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString; // Return the original string if formatting fails
        }
    };

    return (
        <div className="overflow-y-auto h-full p-2">
            {bookingsToRender.map((booking, index) => {
                // Extract date from lesson_statuses if available
                const lessonStatus = booking.lesson_statuses && booking.lesson_statuses.length > 0 
                    ? booking.lesson_statuses[0] 
                    : null;
                
                const lessonDate = lessonStatus?.date || booking.date || null;
                
                // Get time slots from lesson status or booking
                const startTime = lessonStatus?.start_time || booking.startTime || booking.start_time || '';
                const endTime = lessonStatus?.end_time || booking.endTime || booking.end_time || '';
                
                return (
                    <div key={booking.id || `booking-${index}`} className="mb-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-lg text-black">{booking.subject || booking.title || 'Untitled Lesson'}</h3>
                                <p className="text-gray-600">{booking.tutorName || booking.tutor?.name || 'Tutor'}</p>
                            </div>
                            <div className="text-right text-black">
                                <p className="font-medium">
                                    {formatDate(lessonDate)}
                                </p>
                                <p className="text-gray-600">
                                    {startTime}
                                    {startTime && endTime ? ' - ' : ''}
                                    {endTime}
                                </p>
                            </div>
                        </div>
                        
                        {(booking.notes || booking.description) && (
                            <div className="mt-2 pt-2 border-t text-gray-600">
                                <p>{booking.notes || booking.description}</p>
                            </div>
                        )}
                        
                        <div className="mt-3 flex justify-end gap-2">
                            <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                                Reschedule
                            </button>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Join Lesson
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MyLessons;