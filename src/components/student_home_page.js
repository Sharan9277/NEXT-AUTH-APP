import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import SubscriptionSection from "./SubscriptionSection";

const Container = () => {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      alert("Please sign in to access your dashboard.");
      router.push("/login/student");
    } else if (session.user.role !== "student") {
      alert("Access denied. Only students can access this page.");
      router.push("/");
    } else {
      fetchStudentData();
      fetchSubscriptions();
      fetchTutors();

    }
  }, [session, status]);

  // ✅ Fetch student data
  const fetchStudentData = async () => {
    try {
      const res = await fetch(`/api/students/${id}`);
      if (!res.ok) throw new Error("Failed to fetch student");
      const data = await res.json();
      setStudent(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      router.push("/dashboard/student");
    }
  };

  // ✅ Fetch all active subscriptions
  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`/api/students/${id}/subscriptions`);
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      const data = await res.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]);
    }
  };

  // ✅ Fetch all tutors
  const fetchTutors = async () => {
    try {
      const res = await fetch("/api/tutors/");
      if (!res.ok) throw new Error("Failed to fetch tutors");
      const data = await res.json();
      setTutors(data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/students/${id}/bookings`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        
        console.log("Fetched Bookings:", data.bookings); // ✅ Debugging
        
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [id]);

  // ✅ Button Handlers
  const handleScheduleLessons = (tutorId) => {
    router.push(`/bookings/${tutorId}/individual`);
  };

  const handleSubscribe = (tutorId) => {
    router.push(`/dashboard/student/${id}/subscription?tid=${tutorId}`);
  };

  const handleFindTutors = () => {
    router.push("/find-tutors");
  };

  if (loading || status === "loading") return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="relative w-full flex flex-col md:flex-row items-center justify-center py-[30px] px-4 md:px-0 box-border text-left text-base text-black font-inter">
      <div className="w-full md:w-[620px] flex flex-col items-start justify-start gap-[40px] md:gap-[63px]">
        <div className="self-stretch flex flex-col items-start justify-start gap-4">
          <div className="self-stretch relative leading-[24px] flex items-center h-[19px] shrink-0 text-[18px] md:text-base">
            Hey {student?.name || "Name"},
          </div>
          <div className="self-stretch relative text-[22px] md:text-[27.25px] tracking-[0.32px] leading-[30px] md:leading-[36px] font-medium font-inter flex items-center h-auto shrink-0">
            Continue making progress with your tutors
          </div>
          <div className="self-stretch relative rounded bg-white border-gainsboro border-solid border-[1px] box-border h-auto md:h-[306px] text-[20px] md:text-[26.5px] flex flex-col items-center justify-center p-4 md:p-6">
            {/* If no previous bookings */}
            {Array.isArray(bookings) && bookings.length > 0 && bookings[0]?.tutor_id ? (
              <>
                <Image
                  className="rounded-full w-20 h-20 md:w-24 md:h-24 object-cover"
                  width={96}
                  height={96}
                  alt="Tutor"
                  src={
                    bookings[0]?.tutor_id?.profile_image?.trim()
                      ? bookings[0].tutor_id.profile_image
                      : "/20171206_01.jpg"
                  } // ✅ Default image when profile_image is empty
                />

                <div className="mt-2 text-[18px] md:text-[22px] font-semibold">
                  {bookings[0]?.tutor_id?.name || "Tutor Name"}
                </div>
                <div className="mt-1 text-sm md:text-base text-gray-600 text-center">
                  {bookings[0]?.tutor_id?.specialties?.length > 0
                    ? bookings[0].tutor_id.specialties.join(", ")
                    : "No Specialties Available"}
                </div>

                <div
                  onClick={() => handleScheduleLessons(bookings[0]?.tutor_id?.user_id)}
                  className="mt-4 rounded-lg bg-at-button-light border-at-off-white border-solid border-[2px] box-border w-full md:w-[193.5px] h-10 md:h-12 text-center text-[16px] md:text-[18px] text-at-off-white cursor-pointer flex items-center justify-center"
                >
                  Schedule Lessons
                </div>
              </>
            ) : (
              <>
                <div className="text-[18px] md:text-[22px] font-medium text-center">
                  Book A Trial Lesson Now
                </div>
                <div
                  onClick={handleFindTutors}
                  className="mt-4 rounded-lg bg-blue-500 border-blue-700 border-solid border-[2px] box-border w-full md:w-[193.5px] h-10 md:h-12 text-center text-[16px] md:text-[18px] text-white cursor-pointer flex items-center justify-center"
                >
                  Find Tutors
                </div>
              </>
            )}
          </div>
        </div>

        {/* Subscriptions Section */}
        <SubscriptionSection />
      </div>
    </div>
  );
};

export default Container;
