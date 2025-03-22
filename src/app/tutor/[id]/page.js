"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import StudentNavbar from "@/components/StudentNavbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TutorProfile() {
  const { id } = useParams(); // Get tutor ID from URL
  const { data: session } = useSession(); // Get logged-in user session
  const router = useRouter();
  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverallRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tutor data
  useEffect(() => {
    
    const fetchTutorData = async () => {
      try {
        const res = await fetch(`/api/tutors/${id}`);
        const data = await res.json();
        setTutor(data);
      } catch (error) {
        console.error("Error fetching tutor data:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/fetch/${id}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");

        const data = await response.json();
        setReviews(data.reviews || []);
        setOverallRating(data.overall_rating || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReviews();

    fetchTutorData();
  }, [id]);


  

    // ✅ Handle Booking Button Click
    const handleBooking = () => {
      if (!session) {
        alert("Please sign in to book a lesson.");
        router.push("/login/student"); // Redirect to student login
        return;
      }
  
      if (session.user.role !== "student") {
        alert("Only students can book a lesson.");
        return;
      }
  
      // ✅ Redirect to tutor slot selection page
      router.push(`/bookings/${id}`);
    };

  if (!tutor) return <p className="text-center mt-10">Loading Tutor Profile...</p>;

  return (
    <div className="w-full bg-white flex flex-col relative ">
      {session ? (
        session.user.role === "student" ? (
          <StudentNavbar />
        ) : (
          <Navbar />
        )
      ) : (
        <Navbar />
      )}
    <div className="container mx-auto flex flex-col md:flex-row gap-6 items-start min-h-screen w-full pt-6 ">

      {/* Left Column (Fixed) */}
      <div className="w-full md:w-3/5 bg-white p-6  rounded-lg ">
        <div className="flex items-center gap-4">
          <Image
            src={tutor.profile_image || "/default-avatar.png"}
            width={100}
            height={100}
            alt="Tutor Profile"
            className="rounded-full border"
          />
          <div>
            <h1 className="text-2xl font-bold">{tutor.name}</h1>
            <p className="text-gray-600">{tutor.bio}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-500 text-lg">⭐ {overallRating || "N/A"} / 5</span>
              {tutor.isVerified && (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Verified</div>
              )}
            </div>
          </div>
        </div>

        {/* Verified Tutor Section */}
        {tutor.isVerified && (
          <div className="mt-4 p-4 border-l-4 border-green-500 bg-green-100 rounded">
            <h3 className="text-green-700 font-bold">Verified Tutor</h3>
            <p className="text-gray-600">
              This tutor has been verified by AssignTutors.{" "}
              <a href="#" className="text-blue-500 underline">Learn More</a>
            </p>
          </div>
        )}

        {/* About Me */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">About Me</h2>
          <p className="text-gray-700">{tutor.about_me || "No information provided."}</p>
        </div>

        {/* Languages Spoken */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Languages Spoken</h2>
          <p className="text-gray-700">
            {Array.isArray(tutor.languages_spoken) ? tutor.languages_spoken.join(", ") : "No languages specified"}
          </p>
        </div>

        {/* Reviews */}
        <div className="mt-6">
      <h2 className="text-xl font-semibold">Reviews</h2>

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="border p-4 rounded-lg shadow">
                <p className="text-gray-800">{review.review}</p>
                <p className="text-sm text-gray-600 mt-1">
                  ⭐ {review.rating} / 5 -{" "}
                  {review.student?.name || "Anonymous"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      )}
    </div>

        {/* Resume (if uploaded) */}
        {tutor.resume && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Resume</h2>
            <a href={tutor.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              View Resume
            </a>
          </div>
        )}

        {/* Specialties */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Specialties</h2>
          <p className="text-gray-700">
            {Array.isArray(tutor.specialties) ? tutor.specialties.join(", ") : "No specialties listed"}
          </p>
        </div>
      </div>

      {/* Right Column (Fixed) */}
      <div className="w-full md:w-2/5 flex-shrink-0">
      <div
        id="tutor-details"
        className="sticky top-20 p-6 bg-white border-2 border-red-500 z-50 shadow-lg rounded-lg max-h-[90vh]"
      >
        <h2 className="text-xl font-semibold text-center">Tutor Details</h2>
        <p className="text-center text-gray-600">⭐ Overall Rating: {overallRating || "N/A"}</p>
        <p className="text-center text-gray-600">📚 Lessons Taken: {tutor.lessons_taken || 0}</p>
        <p className="text-center text-gray-600">💰 Hourly Rate: ${tutor.hourly_rate || "N/A"}</p>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col gap-3">
          <button onClick={handleBooking} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Book a Trial Lesson
          </button>
          <button className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600">
            Send a Message
          </button>
          <button className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600">
            Save to My List
          </button>
        </div>
      </div>
    </div>
    </div>
    <Footer/>
    </div>
  );
}
