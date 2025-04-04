"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import StudentNavbar from "@/components/StudentNavbar";
import Topbar from "@/components/Topbar";

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const { tutor_id } = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState(null);
  const [tutorReviews, setTutorReviews] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(3); // Default to 3 lessons per week (Popular)
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch Tutor Details and Generate Subscription Plans
  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tutors/${tutor_id}`);
        const data = await res.json();
        setTutor(data);
        
        // Generate subscription plans based on tutor's hourly rate
        if (data && data.hourly_rate) {
          // Calculate price per lesson (for 50 min lessons)
          const pricePerLesson = (data.hourly_rate);
          
          // Generate subscription plans array
          const plans = [
            {
              id: 1,
              title: "1 lesson per week",
              totalLessons: 4,
              price: (pricePerLesson * 4).toFixed(2),
              pricePerLesson: pricePerLesson.toFixed(2),
              period: "4 weeks"
            },
            {
              id: 2,
              title: "2 lessons per week",
              totalLessons: 8,
              price: (pricePerLesson * 8).toFixed(2),
              pricePerLesson: pricePerLesson.toFixed(2),
              period: "4 weeks"
            },
            {
              id: 3,
              title: "3 lessons per week",
              totalLessons: 12,
              price: (pricePerLesson * 12).toFixed(2),
              pricePerLesson: pricePerLesson.toFixed(2),
              period: "4 weeks",
              isPopular: true
            },
            {
              id: 4,
              title: "4 lessons per week",
              totalLessons: 16,
              price: (pricePerLesson * 16).toFixed(2),
              pricePerLesson: pricePerLesson.toFixed(2),
              period: "4 weeks"
            },
            {
              id: 5,
              title: "5 lessons per week",
              totalLessons: 20,
              price: (pricePerLesson * 20).toFixed(2),
              pricePerLesson: pricePerLesson.toFixed(2),
              period: "4 weeks"
            }
          ];
          
          setSubscriptionPlans(plans);
        }
        
        // Fetch reviews if available
        if (data.reviews && data.reviews.length > 0) {
          // If reviews are already populated in tutor data
          setTutorReviews(data.reviews);
        } else {
          // If we need to fetch reviews separately
          try {
            const reviewsRes = await fetch(`/api/tutors/${tutor_id}/reviews`);
            const reviewsData = await reviewsRes.json();
            setTutorReviews(reviewsData);
          } catch (reviewError) {
            console.error("Error fetching reviews:", reviewError);
            setTutorReviews([]);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tutor data:", error);
        setLoading(false);
      }
    };

    if (tutor_id) {
      fetchTutorData();
    }
  }, [tutor_id]);

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!tutorReviews || tutorReviews.length === 0) return 0;
    const sum = tutorReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / tutorReviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();
  const reviewCount = tutorReviews ? tutorReviews.length : 0;

  // Handle continue to checkout
  const handleContinueToCheckout = () => {
    const selectedPlanDetails = subscriptionPlans.find(plan => plan.id === selectedPlan);
    if (!selectedPlanDetails) return;
    
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Create booking details object with the required structure for the API
    const bookingDetails = {
      tutor_id: tutor_id,
      student_id: session?.user?.id,
      day: today.toLocaleDateString('en-US', { weekday: 'long' }), // Current weekday
      date: formattedDate, // Current date in YYYY-MM-DD format
      start_time: "09:00", // Default start time
      end_time: "09:50", // Default end time (50 min lesson)
      amount: selectedPlanDetails.price,
      booking_type: "subscription"
    };
    
    console.log("✅ Booking Details:", bookingDetails);
    
    // Save booking details to localStorage
    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
    
    // Redirect to Checkout Page
    router.push("/checkout");
  };

  if (loading || !tutor || subscriptionPlans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <StudentNavbar />
      <Topbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
          {/* Header section */}
          <div className="p-6 flex items-start gap-4 border-b">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Time to make real progress!</h2>
              <p className="text-gray-600">Subscribe to a monthly plan. Prices are for our standard lesson time of 50 mins.</p>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row">
              {/* Left side - Plan options */}
              <div className="w-full lg:w-3/5 lg:pr-6">
                <div className="space-y-4">
                  {subscriptionPlans.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`border rounded-lg p-4 cursor-pointer relative ${
                        selectedPlan === plan.id ? "border-2 border-blue-500" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{plan.title}</h3>
                          <p className="text-sm text-gray-600">
                            {plan.totalLessons} lessons · €{parseFloat(plan.price).toFixed(2)} every {plan.period} · €{parseFloat(plan.pricePerLesson).toFixed(2)} per lesson
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border ${
                          selectedPlan === plan.id 
                            ? "border-blue-500 bg-blue-500" 
                            : "border-gray-300"
                        } flex items-center justify-center`}>
                          {selectedPlan === plan.id && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                      {plan.isPopular && (
                        <div className="absolute right-4 top-4 bg-pink-500 text-white text-xs font-medium px-2 py-1 rounded">
                          Popular
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Plan details */}
              <div className="w-full lg:w-2/5 lg:pl-6 mt-8 lg:mt-0">
                <div className="bg-gray-50 p-6 rounded-lg">
                  {/* Header with title and link on same line */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Your learning plan</h3>
                    <a href="#" className="text-sm text-blue-600 hover:underline">See how our plans work</a>
                  </div>
                  
                  {/* Divider line */}
                  <div className="border-b border-gray-200 mb-6"></div>
                  
                  <div>
                    {/* Larger font for plan title */}
                    <h4 className="text-3xl font-bold text-gray-900">{selectedPlan} lessons per week</h4>
                    <p className="text-gray-600 mt-1">
                      That's {subscriptionPlans.find(p => p.id === selectedPlan)?.totalLessons} lessons every 4 weeks at €{parseFloat(subscriptionPlans.find(p => p.id === selectedPlan)?.price).toFixed(2)}.
                    </p>
                    
                    <div className="mt-4 bg-blue-50 inline-flex items-center px-3 py-1 rounded-full">
                      <span className="text-blue-800 text-sm">Flexible plan</span>
                    </div>
                    
                    {/* Features section */}
                    <div className="mt-6 space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <p className="mt-2">
                          Schedule your <span className="font-bold">{subscriptionPlans.find(p => p.id === selectedPlan)?.totalLessons} lessons for any time</span> during the 4 week period.
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </div>
                        <p className="mt-2">Change your tutor <span className="font-bold">for free at any time</span>.</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                        </div>
                        <p className="mt-2">Cancel your plan <span className="font-bold">at any time</span>.</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </div>
                        <p className="mt-2">Change the duration of your classes <span className="font-bold">at any time</span>.</p>
                      </div>
                    </div>
                    
                    {/* Divider line */}
                    <div className="border-b border-gray-200 my-6"></div>
                    
                    {/* Tutor profile */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                        <Image 
                          src={tutor.profile_image || "/default-avatar.png"}
                          width={48} 
                          height={48} 
                          alt={tutor.name || "Tutor"} 
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-lg">{tutor.name}</h5>
                          <span className="text-sm">★ {averageRating} ({reviewCount} reviews)</span>
                        </div>
                        {tutor.isVerified && (
                          <div className="text-xs flex items-center gap-1">
                            <div className="bg-gray-100 p-1 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            </div>
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom action button */}
            <div className="mt-8">
              <button
                onClick={handleContinueToCheckout}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Continue to checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}