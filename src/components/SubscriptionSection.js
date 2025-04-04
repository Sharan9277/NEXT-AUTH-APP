import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

const SubscriptionSection = () => {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch bookings for the student
  useEffect(() => {
    if (!id) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/students/${id}/bookings`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();

        console.log("Fetched Bookings:", data.bookings); // ✅ Debugging
        setBookings(data.bookings || []); // ✅ Ensure `bookings` is always an array
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [id]);

  // ✅ Handle Subscribe button click
  const handleSubscribe = (tutorId) => {
    router.push(`/bookings/${tutorId}/subscription`);
  };

  // ✅ Handle Find Tutors button click
  const handleFindTutors = () => {
    router.push("/find-tutors");
  };

  if (loading || status === "loading") return <p className="text-center mt-10">Loading...</p>;

  // Group bookings by tutor to avoid duplicates
  const tutorBookings = bookings.reduce((acc, booking) => {
    const tutorId = booking.tutor_id?.user_id || booking.tutor_id;
    
    // If we don't have this tutor yet, or the current booking is a subscription
    // (we prioritize subscription bookings)
    if (!acc[tutorId] || booking.booking_type === "subscription") {
      acc[tutorId] = booking;
    }
    
    return acc;
  }, {});

  // Convert back to array
  const uniqueTutorBookings = Object.values(tutorBookings);

  return (
    <div className="self-stretch flex flex-col items-start justify-start gap-6 text-[27.38px] font-inter">
      <div className="self-stretch relative tracking-[0.32px] leading-[36px] font-medium flex items-center h-9 shrink-0">
        Subscriptions
      </div>

      {/* If bookings exist, show two-column layout, else show single column */}
      <div className={`grid ${uniqueTutorBookings.length > 0 ? "grid-cols-2 gap-6" : "grid-cols-1"} w-full`}>
        {/* Subscription Cards - One per tutor */}
        {uniqueTutorBookings.length > 0 ? (
          uniqueTutorBookings.map((booking) => {
            const isSubscription = booking.booking_type === "subscription";
            const tutor = booking.tutor_id || {}; // ✅ Ensures `tutor_id` exists

            return (
              <div
                key={tutor.user_id || booking.booking_id}
                className="relative rounded bg-white border-gainsboro border-solid border-[1px] box-border w-full p-4"
              >
                <Image
                  className="rounded w-24 h-24 object-cover"
                  width={96}
                  height={96}
                  alt="Tutor"
                  src={tutor.profile_image && tutor.profile_image.trim() !== "" 
                      ? tutor.profile_image 
                      : "/20171206_01.jpg"} // ✅ Default image when `profile_image` is empty
                />

                {/* Subscription Status Badge */}
                <div
                  className={`absolute top-[17px] right-[17px] px-2 py-1 rounded text-xs font-semibold ${
                    isSubscription ? "bg-green-500 text-white" : "bg-[#CCE2FF] text-black"
                  }`}
                >
                  {isSubscription ? "Subscribed" : "Not Active"}
                </div>

                {/* Booking Details */}
                <div className="mt-4 text-[20px] font-semibold">
                  Want to continue learning with {tutor.name || "Tutor"}?
                </div>
                <div className="mt-1 text-[16px] font-regular">
                  {isSubscription 
                    ? "You have an active subscription with this tutor" 
                    : "Start a monthly subscription and set up your schedule"}
                </div>

                {/* Subscribe Button (Only if not subscribed) */}
                {!isSubscription && (
                  <div
                    onClick={() => handleSubscribe(tutor.user_id)}
                    className="mt-4 rounded-lg border-gray border-solid border-[2px] box-border h-10 text-center cursor-pointer flex items-center justify-center"
                  >
                    <span className="tracking-[0.17px] leading-[20px] font-semibold text-[14px]">Subscribe</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-[14px] mb-4">No bookings found.</p>
        )}

        {/* Find Another Tutor Card */}
        <div className="relative rounded bg-white border-gainsboro border-solid border-[1px] box-border w-full p-4 flex flex-col justify-between h-full">
          {/* Tutor Image */}
          <Image className="rounded w-24 h-24 object-cover" width={96} height={96} alt="Tutor" src="/india.png" />

          {/* Heading */}
          <div className="mt-4 text-[16px] font-semibold">Want to find another tutor?</div>

          {/* Description */}
          <div className="mt-1 text-[16px] font-regular">
            Try different teaching styles to choose your perfect tutor match.
          </div>

          {/* Find Tutors Button - Always at the Bottom */}
          <div
            onClick={handleFindTutors}
            className="mt-4 rounded-lg border-gray border-solid border-[2px] box-border h-10 text-center cursor-pointer flex items-center justify-center"
          >
            <span className="tracking-[0.17px] leading-[20px] font-semibold text-[14px]">Find Another Tutor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;