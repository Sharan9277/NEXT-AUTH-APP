"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TutorCard({ tutor }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showFullAbout, setShowFullAbout] = useState(false);

  // ✅ Limit about_me text to 30 words
  const aboutMePreview = tutor.about_me?.split(" ").slice(0, 30).join(" ") + "...";

  // ✅ Handle Booking
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
    router.push(`/bookings/${tutor.user_id._id}/trial`); // ✅ Using `user_id._id`
  };

  // ✅ Handle Message
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
  
      // ✅ 1️⃣ Check if a chat already exists between the student and tutor
      const existingChatResponse = await fetch(`/api/get-message?sender_id=${studentId}&recipient_id=${tutorId}`);
      const existingChatData = await existingChatResponse.json();
      console.log("Chat already exists:", existingChatData.chat);
      if (existingChatData.chat) {
        // ✅ 2️⃣ Redirect to the existing chat
        router.push(`/dashboard/student/${studentId}/messages/${existingChatData.chat._id}`);
        return;
      }
  
      // ✅ 3️⃣ If no chat exists, create a new one
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
    <div className="w-full relative flex flex-col items-start justify-start px-[56px] leading-[normal] tracking-[normal] text-left text-[26.6px] text-[#121117] font-inter mq975:pl-[28px] mq975:pr-[28px]">
    <section className="w-full flex flex-row items-start justify-start mb-[16px] pb-[0px] pl-[0px] pr-[32px] gap-[16px] max-w-full text-left text-[16px] text-[#121117] font-inter mq975:h-auto">
      <div className="w-full flex flex-col items-center justify-start gap-[24px] max-w-full">
        <div className="w-full h-auto flex flex-row items-start justify-start mb-[16px] border-2 border-gray-300 max-w-full">
          <div className="rounded-[4px] bg-[#fff] overflow-hidden flex flex-row items-start justify-start pt-[16px] pb-[24px] pl-[24px] pr-[12px] gap-[16px] max-w-full">
            
            {/* Profile Image */}
            <div className="flex flex-col items-start justify-start">
              <div className="w-[160px] h-[160px] rounded-[4px] overflow-hidden relative">
                <Image
                  className="h-full w-full absolute top-0 right-0 bottom-0 left-0 rounded-[4px] object-cover"
                  loading="lazy"
                  width={160}
                  height={160}
                  alt=""
                  src={tutor.profile_image}
                />
              </div>
            </div>
  
            {/* Tutor Info */}
            <div className="flex flex-col items-start justify-start gap-[16px] max-w-full">
              <div className="w-full text-[20px] font-inter">
                <a className="text-[inherit] font-medium">{tutor.name}</a>
              </div>
              <div className="w-full text-[#4d4c5c]">
                <p>{tutor.subject}</p>
                <p>{tutor.active_students} active students | {tutor.lessons} lessons</p>
              </div>
              <div className="w-full text-[#4d4c5c]">
                <p>Speaks: {tutor.languages_spoken?.length > 0 ? tutor.languages_spoken.join(", ") : "Not specified"}</p>
              </div>
  
              {/* About Me Section */}
              <div className="w-full flex flex-col items-start justify-start pt-[8px] px-[0px] pb-[0px]">
                <div className="relative leading-[22.9px]">
                  {showFullAbout ? tutor.about_me : aboutMePreview}
                </div>
                <button
                  className="text-blue-500"
                  onClick={() => setShowFullAbout(!showFullAbout)}
                >
                  {showFullAbout ? "Show less" : "Read more"}
                </button>
              </div>
            </div>
  
            {/* Actions */}
            <div className="flex flex-col items-start justify-start gap-[20px]">
              <div className="flex flex-row items-start justify-start gap-[16px]">
                <div className="flex flex-col items-start justify-start">
                  <p className="text-[#4d4c5c]">${tutor.hourly_rate} Per Hour</p>
                </div>
              <div className="flex items-center justify-center">
                <button 
                  className="text-[#ff4d4d] hover:text-[#ff1a1a]" 
                  aria-label="Add to favorites"
                >
                  ❤️
                </button>
              </div>
              <div className="flex items-center gap-[8px]">
                  <p className="text-[#4d4c5c] font-semibold">Total Rating:</p>
                  <span className="text-[#f1c40f]">{tutor.total_rating} ★</span>
                  <p className="text-[#4d4c5c] font-semibold">Total Reviews:</p>
                  <span className="text-[#4d4c5c]">{tutor.total_reviews}</span>
                </div>

              </div>
  
              <div className="flex flex-col items-start justify-start gap-[16px]">
                <button
                  className="cursor-pointer bg-[#5577d1] w-[244px] h-[48px] rounded-[8px] flex items-center justify-center text-white"
                  onClick={handleBooking}
                >
                  Book trial lesson
                </button>
                <button
                  className="cursor-pointer border-[#dcdce5] border-[2px] w-[244px] h-[48px] rounded-[8px] flex items-center justify-center text-[#121117]"
                  onClick={handleMessage}
                >
                  Send message
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