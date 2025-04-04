"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TutorCard({ tutor }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showFullAbout, setShowFullAbout] = useState(false);

  // Limit about_me text to 30 words
  const aboutMePreview = tutor.about_me?.split(" ").slice(0, 30).join(" ") + "...";

  // Handle Booking
  const handleBooking = () => {
    if (!session) {
      alert("Please log in as a student to book a lesson.");
      router.push("/login/student");
      return;
    }
    if (session.user.role !== "student") {
      alert("Only students can book a lesson.");
      return;
    }
    router.push(`/bookings/${tutor.user_id._id}/trial`);
  };

  // Handle Message
  const handleMessage = async () => {
    if (!session) {
      alert("Please log in as a student to send a message.");
      router.push("/login/student");
      return;
    }
    if (session.user.role !== "student") {
      alert("Only students can send a message.");
      return;
    }
  
    try {
      const studentId = session.user.id;
      const tutorId = tutor.user_id._id;
  
      // Check if a chat already exists between the student and tutor
      const existingChatResponse = await fetch(`/api/get-message?sender_id=${studentId}&recipient_id=${tutorId}`);
      const existingChatData = await existingChatResponse.json();
      console.log("Chat already exists:", existingChatData.chat);
      if (existingChatData.chat) {
        // Redirect to the existing chat
        router.push(`/dashboard/student/${studentId}/messages/${existingChatData.chat._id}`);
        return;
      }
  
      // If no chat exists, create a new one
      const newChatResponse = await fetch(`/api/messages/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, tutor_id: tutorId }),
      });
  
      const newChatData = await newChatResponse.json();
  
      if (newChatData.chat) {
        router.push(`/dashboard/student/${studentId}/messages/${newChatData.chat._id}`);
      } else {
        alert("Failed to start chat. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error handling message:", error);
      alert("Error starting chat. Please try again.");
    }
  };

  return (
    <div className="w-full relative flex flex-col items-start justify-start px-4 leading-normal text-left text-base text-[#121117] font-inter">
      <section className="w-full flex flex-col items-start justify-start mb-4 max-w-full">
        <div className="w-full flex flex-col items-center justify-start gap-6 max-w-full">
          <div className="w-full border-2 border-gray-300 rounded-md overflow-hidden">
            <div className="bg-white p-4 w-full">
              
              {/* Desktop Layout */}
              <div className="hidden md:flex flex-row gap-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 rounded overflow-hidden relative">
                    <Image
                      className="object-cover"
                      loading="lazy"
                      width={160}
                      height={160}
                      alt={`${tutor.name} profile`}
                      src={tutor.profile_image}
                    />
                  </div>
                </div>
                
                {/* Tutor Info */}
                <div className="flex flex-col flex-grow gap-4">
                  <div className="text-xl font-medium">{tutor.name}</div>
                  <div className="text-[#4d4c5c]">
                    <p>{tutor.subject}</p>
                    <p>{tutor.active_students} active students | {tutor.lessons} lessons</p>
                  </div>
                  <div className="text-[#4d4c5c]">
                    <p>Speaks: {tutor.languages_spoken?.length > 0 ? tutor.languages_spoken.join(", ") : "Not specified"}</p>
                  </div>
                  
                  {/* About Me Section */}
                  <div className="flex flex-col items-start justify-start pt-2">
                    <div className="leading-relaxed  ">
                      {showFullAbout ? tutor.about_me : aboutMePreview}
                    </div>
                    <button
                      className="text-blue-500 mt-1"
                      onClick={() => setShowFullAbout(!showFullAbout)}
                    >
                      {showFullAbout ? "Show less" : "Read more"}
                    </button>
                  </div>
                </div>
                
                {/* Actions - Right Column */}
                <div className="flex flex-col items-start justify-between h-full gap-20">
                  {/* Rating and Price */}
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="text-black font-bold text-2xl">★ {tutor.averageRating || "0"}</span>
                      </div>
                      <p className="text-[#4d4c5c]">{tutor.totalReviews || "0"} reviews</p>
                    </div>
                    
                    <div className="flex flex-col ml-6">
                      <p className="text-black font-bold text-2xl">${tutor.hourly_rate}</p>
                      <p className="text-[#4d4c5c]">60-min lesson</p>
                    </div>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex flex-col gap-4 mt-auto">
                    <button
                      className="cursor-pointer bg-at-blue-again w-60 h-12 rounded-lg flex items-center justify-center text-white"
                      onClick={handleBooking}
                    >
                      Book trial lesson
                    </button>
                    <button
                      className="cursor-pointer border-[#dcdce5] border-2 w-60 h-12 rounded-lg flex items-center justify-center text-[#121117]"
                      onClick={handleMessage}
                    >
                      Send message
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile Layout */}
              <div className="md:hidden flex flex-col gap-4">
                {/* Row 1: Profile Image, Name, Rating */}
                <div className="flex items-start gap-3">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded overflow-hidden relative">
                      <Image
                        className="object-cover"
                        loading="lazy"
                        width={80}
                        height={80}
                        alt={`${tutor.name} profile`}
                        src={tutor.profile_image}
                      />
                    </div>
                  </div>
                  
                  {/* Name and Rating */}
                  <div className="flex flex-col">
                    <div className="text-lg font-medium">{tutor.name}</div>
                    <div className="flex items-center mt-1">
                      <span className="text-black font-bold">★ {tutor.averageRating || "0"}</span>
                      <span className="text-[#4d4c5c] text-sm ml-1">({tutor.totalReviews || "0"} reviews)</span>
                    </div>
                    <div className="mt-1">
                      <p className="text-[#4d4c5c] text-sm">${tutor.hourly_rate} / 60-min</p>
                    </div>
                  </div>
                </div>
                
                {/* Row 2: Students, Lessons, Languages */}
                <div className="flex flex-col gap-1 text-sm text-[#4d4c5c]">
                  <p>{tutor.subject}</p>
                  <p>{tutor.active_students} active students | {tutor.lessons} lessons</p>
                  <p>Speaks: {tutor.languages_spoken?.length > 0 ? tutor.languages_spoken.join(", ") : "Not specified"}</p>
                </div>
                
                {/* Row 3: About Me */}
                <div className="flex flex-col">
                  <div className="text-sm leading-relaxed">
                    {showFullAbout ? tutor.about_me : aboutMePreview}
                  </div>
                  <button
                    className="text-blue-500 text-sm mt-1"
                    onClick={() => setShowFullAbout(!showFullAbout)}
                  >
                    {showFullAbout ? "Show less" : "Read more"}
                  </button>
                </div>
                
                {/* Row 4: Buttons */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="cursor-pointer bg-at-blue-again flex-grow h-10 rounded-lg flex items-center justify-center text-white text-sm"
                    onClick={handleBooking}
                  >
                    Book trial lesson
                  </button>
                  <button
                    className="cursor-pointer border-[#dcdce5] border-2 w-12 h-10 rounded-lg flex items-center justify-center text-[#121117]"
                    onClick={handleMessage}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}