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
    router.push(`/bookings/${tutor.user_id._id}`); // ✅ Using `user_id._id`
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
    <div className="w-full relative flex flex-col items-start justify-start px-[56px] box-border leading-[normal] tracking-[normal] text-left text-[26.6px] text-[#121117] font-inter mq975:pl-[28px] mq975:pr-[28px] mq975:box-border">
      <section className="w-[1312px] h-[300px] flex flex-row items-start justify-start mb-[16px] pb-[0px] pl-[0px] pr-[32px] box-border gap-[16px] max-w-full text-left text-[16px] text-[#121117] font-inter mq975:h-auto">
        <div className="w-[882px] flex flex-col items-center justify-start gap-[24px] max-w-full">
          <div className="self-stretch h-[305px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[304px] box-border max-w-full mq700:pb-[198px] mq700:box-border mq975:h-auto">
            <div className="w-[882px] h-[306.9px] border-[#121117] border-solid border-[2px] box-border flex flex-row items-start justify-start max-w-full mq975:h-auto">
              <div className="rounded-[4px] bg-[#fff] overflow-hidden flex flex-row items-start justify-start pt-[16px] pb-[24px] pl-[24px] pr-[12px] box-border gap-[16px] max-w-full mq975:flex-wrap">
                <div className="flex flex-col items-start justify-start pt-[8px] px-[0px] pb-[0px]">
                  <div className="w-[160px] rounded-[4px] overflow-hidden flex flex-row items-start justify-end pt-[144px] px-[0px] pb-[0px] box-border relative">
                    <Image
                      className="h-full w-full absolute !m-[0] top-[0px] right-[0px] bottom-[0px] left-[0px] rounded-[4px] max-w-full overflow-hidden max-h-full object-cover"
                      loading="lazy"
                      width={160}
                      height={160}
                      alt=""
                      src={tutor.profile_image}
                    />
                    <div className="h-[16px] w-[16px] relative rounded-[2px] bg-[#aeb5bc] border-[#fff] border-solid border-[2px] box-border z-[1]" />
                  </div>
                </div>
                <div className="flex flex-row items-start justify-start gap-[16px] max-w-full mq975:flex-wrap">
                  <div className="flex flex-col items-start justify-start pt-[8px] px-[0px] pb-[0px] box-border max-w-full mq700:min-w-full mq975:flex-1">
                    <div className="flex flex-col items-start justify-start gap-[8px]">
                      <div className="w-[394px] h-[32px] flex flex-col items-start justify-start pt-[0px] px-[0px]  box-border gap-[4px] z-[3] text-[20.1px] font-inter">
                        <div className="w-[394px] h-[32px] flex flex-row items-start justify-start">
                          <div className="overflow-hidden flex flex-row items-start justify-start z-[2]">
                            <a className="[text-decoration:none] relative tracking-[0.3px] leading-[32px] font-medium text-[inherit] mq450:text-[16px] mq450:leading-[26px]">
                              {tutor.name}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="w-[394px] h-[74.8px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[74px] box-border gap-[2px] text-[#4d4c5c]">
                        <div className="w-[394px] h-[24px] flex flex-row items-end justify-start pt-[4px] px-[0px] pb-[0.5px] box-border gap-[8px]">
                          <div className="flex flex-col items-start justify-end pt-[0px] px-[0px] pb-[3.5px]">
                            <Image
                              className="w-[16px] h-[16px] relative overflow-hidden shrink-0"
                              loading="lazy"
                              width={16}
                              height={16}
                              alt=""
                              src="/icon-1.svg"
                            />
                          </div>
                          <a className="[text-decoration:none] w-[52px] relative leading-[24px] text-[inherit] inline-block">
                            {tutor.subject}
                          </a>
                        </div>
                        <div className="w-[394px] h-[24px] flex flex-row items-start justify-start gap-[8px]">
                          <div className="flex flex-col items-start justify-start pt-[4px] px-[0px] pb-[0px]">
                            <Image
                              className="w-[16px] h-[16px] relative overflow-hidden shrink-0"
                              loading="lazy"
                              width={16}
                              height={16}
                              alt=""
                              src="/icon-2.svg"
                            />
                          </div>
                          <div className="h-[24px] flex flex-row items-end justify-start pt-[0px] px-[0px] pb-[0.5px] box-border gap-[2px]">
                            <div className="w-[130px] relative leading-[24px] inline-block shrink-0">
                              {tutor.active_students} active students
                            </div>
                            <div className="flex flex-row items-end justify-start gap-[1.9px] shrink-0 text-[14px] text-[#121117]">
                              <div className="flex flex-col items-start justify-end pt-[0px] px-[0px] pb-[1px]">
                                <div className="w-[7px] relative leading-[20px] inline-block">
                                  •
                                </div>
                              </div>
                              <div className="w-[97px] relative text-[16px] leading-[24px] text-[#4d4c5c] inline-block">
                                {tutor.lessons} lessons
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-[394px] h-[22.9px] flex flex-row items-start justify-start gap-[8px]">
                          <div className="flex flex-col items-start justify-start pt-[3px] px-[0px] pb-[0px]">
                            <Image
                              className="w-[16px] h-[16px] relative overflow-hidden shrink-0"
                              loading="lazy"
                              width={16}
                              height={16}
                              alt=""
                              src="/icon-3.svg"
                            />
                          </div>
                          <div className="h-[22.9px] overflow-hidden flex flex-row items-start justify-start pt-[0px] pb-[0.9px] pl-[0px] pr-[3px] box-border gap-[0.4px] z-[1]">
                            <div className="relative leading-[22.9px]">
                              Speaks
                            </div>
                            <div className="relative leading-[22.9px]">
                            {tutor.languages_spoken?.length > 0 
                              ? tutor.languages_spoken.join(", ") 
                              : "Not specified"}
                          </div>
                          </div>
                        </div>
                      </div>
                      {/* About Me Section */}
                      <div className="w-[394px] flex flex-col items-start justify-start pt-[8px] px-[0px] pb-[0px]">
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
                  </div>
                  <div className="flex flex-col items-start justify-start gap-[98.9px] text-[20.1px] font-inter mq450:gap-[49px] mq975:flex-1">
                    <div className="flex flex-row items-start justify-start gap-[4px] mq450:flex-wrap">
                      <div className="flex flex-col items-start justify-start pt-[8px] px-[0px] pb-[0px]">
                        <div className="flex flex-row items-start justify-start py-[0px] pl-[0px] pr-[33px] gap-[24px]">
                          <div className="h-[52px] w-[65.5px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[51px] box-border">
                            <div className="w-[35px] h-[32px] flex flex-row items-start justify-start gap-[4px]">
                              <div className="flex flex-col items-start justify-start pt-[7px] px-[0px] pb-[0px]">
                                <Image
                                  className="w-[18px] h-[18px] relative overflow-hidden shrink-0"
                                  loading="lazy"
                                  width={18}
                                  height={18}
                                  alt=""
                                  src="/icon-4.svg"
                                />
                              </div>
                              <a className="[text-decoration:none] w-[13px] relative tracking-[0.3px] leading-[32px] font-medium text-[inherit] inline-block mq450:text-[16px] mq450:leading-[26px]">
                                {tutor.rating}
                              </a>
                            </div>
                            <div className="relative text-[14px] tracking-[0.07px] leading-[20px] font-inter text-[#4d4c5c] mt-[-0.5px]">
                              {tutor.reviews} reviews
                            </div>
                          </div>
                          <div className="w-[89.9px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[0.5px] box-border">
                            <div className="flex flex-row items-start justify-start pt-[0px] px-[0px] pb-[0px]">
                              <div className="mb-[-0.5px] flex flex-row items-start justify-start py-[0px] pl-[0px] pr-[2px]">
                                <a className="[text-decoration:none] w-[39px] relative tracking-[0.3px] leading-[32px] font-medium text-[inherit] inline-block mq450:text-[16px] mq450:leading-[26px]">
                                  ${tutor.hourly_rate}
                                </a>
                              </div>
                            </div>
                            <div className="w-[90px] relative text-[14px] tracking-[0.07px] leading-[20px] font-inter text-[#4d4c5c] inline-block">
                              Per Hour
                            </div>
                          </div>
                        </div>
                      </div>
                      <Image
                        className="h-[40px] w-[40px] relative rounded-[8px]"
                        loading="lazy"
                        width={40}
                        height={40}
                        alt=""
                        src="/button--buttonbase-sf5ep-51.svg"
                      />
                    </div>
                    <div className="h-[104px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[103px] box-border gap-[8px] z-[1]">
                      <button
                        className="cursor-pointer border-[#fff] border-solid border-[2px] pt-[8px] pb-[9px] pl-[54px] pr-[51px] bg-[#5577d1] w-[244px] h-[48px] rounded-[8px] box-border flex flex-row items-start justify-start hover:bg-[#6e91eb] hover:border-[#e6e6e6] hover:border-solid hover:hover:border-[2px] hover:box-border"
                        onClick={handleBooking}
                      >
                        <div className="w-[135px] relative text-[16px] tracking-[0.09px] leading-[25.7px] font-semibold font-inter text-[#fff] text-left inline-block">
                          Book trial lesson
                        </div>
                      </button>
                      <button
                        className="cursor-pointer border-[#dcdce5] border-solid border-[2px] pt-[8px] pb-[9px] pl-[62px] pr-[58px] bg-[transparent] w-[244px] h-[48px] rounded-[8px] box-border flex flex-row items-start justify-start hover:bg-[rgba(194,194,204,0.09)] hover:border-[#c2c2cc] hover:border-solid hover:hover:border-[2px] hover:box-border"
                        onClick={handleMessage}
                      >
                        <div className="w-[120px] relative text-[16px] tracking-[0.09px] leading-[25.7px] font-semibold font-inter text-[#121117] text-left inline-block">
                          Send message
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[274.9px] w-[382px] rounded-[4px] bg-[#fff] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[274px] box-border gap-[8px] mq450:pb-[178px] mq450:box-border">
          <div className="w-[382px] h-[218.9px] rounded-[4px] border-[#121117] border-solid border-[2px] box-border overflow-hidden shrink-0 flex flex-row items-start justify-start">
            <div className="w-[378px] rounded-[2px] flex flex-row items-start justify-end pt-[138.9px] px-[16px] pb-[16px] box-border relative">
              <Image
                className="h-full w-full absolute !m-[0] top-[0px] right-[0px] bottom-[0px] left-[0px] max-w-full overflow-hidden max-h-full object-cover"
                loading="lazy"
                width={378}
                height={215}
                alt=""
                src="/image-styles-videothumbnail--uixkh@2x.png"
              />
              <div className="h-[60px] w-[60px] rounded-[300px] bg-[#5577d1] border-[#121117] border-solid border-[2px] box-border flex flex-row items-start justify-start py-[17px] px-[20px] z-[1]">
                <div className="h-[20px] w-[16px] relative border-[#121117] border-solid border-t-[10px] border-b-[10px] border-l-[16px] box-border" />
              </div>
            </div>
          </div>
          <button className="cursor-pointer border-[#121117] border-solid border-[2px] pt-[8px] px-[20px] pb-[9px] bg-[transparent] w-[382px] h-[48px] rounded-[8px] box-border flex flex-row items-start justify-center hover:bg-[rgba(69,69,74,0.09)] hover:border-[#45454a] hover:border-solid hover:hover:border-[2px] hover:box-border">
            <div className="w-[151px] relative text-[16px] tracking-[0.09px] leading-[25.7px] font-semibold font-inter text-[#121117] text-left inline-block">
              View full schedule
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}