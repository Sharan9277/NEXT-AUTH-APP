"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function SubscriptionPlanSelection({ onContinue, selectedSlot, duration }) {
  const [selectedPlan, setSelectedPlan] = useState(3); // Default to 3 lessons per week (Popular)
  const [planDetails, setPlanDetails] = useState(null);
  
  // Define all subscription plans
  const subscriptionPlans = [
    {
      id: 1,
      title: "1 lesson per week",
      totalLessons: 4,
      price: 10.80,
      pricePerLesson: 2.70,
      period: "4 weeks"
    },
    {
      id: 2,
      title: "2 lessons per week",
      totalLessons: 8,
      price: 21.60,
      pricePerLesson: 2.70,
      period: "4 weeks"
    },
    {
      id: 3,
      title: "3 lessons per week",
      totalLessons: 12,
      price: 32.40,
      pricePerLesson: 2.70,
      period: "4 weeks",
      isPopular: true
    },
    {
      id: 4,
      title: "4 lessons per week",
      totalLessons: 16,
      price: 43.20,
      pricePerLesson: 2.70,
      period: "4 weeks"
    },
    {
      id: 5,
      title: "5 lessons per week",
      totalLessons: 20,
      price: 54.00,
      pricePerLesson: 2.70,
      period: "4 weeks"
    }
  ];

  // Set plan details when selectedPlan changes
  useEffect(() => {
    const plan = subscriptionPlans.find(plan => plan.id === selectedPlan);
    setPlanDetails(plan);
  }, [selectedPlan]);

  // Handle continue to checkout
  const handleContinue = () => {
    if (!planDetails) return;
    
    // Calculate session amount based on duration and standard rate
    const sessionAmount = (duration / 60) * planDetails.pricePerLesson * 60;
    
    // Create subscription details object
    const subscriptionDetails = {
      plan_id: planDetails.id,
      plan_name: planDetails.title,
      total_lessons: planDetails.totalLessons,
      total_price: planDetails.price,
      price_per_lesson: planDetails.pricePerLesson,
      period: planDetails.period,
      session_amount: sessionAmount,
      session_duration: duration
    };
    
    // Call onContinue with subscription details
    onContinue(subscriptionDetails);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow">
        {/* Header section */}
        <div className="p-6 flex items-start gap-4 border-b">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <Image 
              src="/images/start-icon.png" 
              width={40} 
              height={40} 
              alt="Start Icon" 
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Time to make real progress!</h2>
            <p className="text-gray-600">Subscribe to a monthly plan. Prices are for our standard lesson time of 50 mins.</p>
          </div>
        </div>

        {/* Subscription plans */}
        <div className="p-6">
          <div className="flex">
            <div className="w-3/5 pr-4">
              {/* Plan options */}
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
                          {plan.totalLessons} lessons · €{plan.price.toFixed(2)} every {plan.period} · €{plan.pricePerLesson.toFixed(2)} per lesson
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

            <div className="w-2/5 pl-4">
              {/* Plan details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Your learning plan</h3>
                <div className="flex justify-between">
                  <span>See how our plans work</span>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-2xl font-bold">{selectedPlan} lessons per week</h4>
                  <p className="text-gray-600 mt-1">
                    That's {subscriptionPlans.find(p => p.id === selectedPlan)?.totalLessons} lessons every 4 weeks at €{subscriptionPlans.find(p => p.id === selectedPlan)?.price.toFixed(2)}.
                  </p>
                  
                  <div className="mt-4 bg-blue-50 inline-flex items-center px-3 py-1 rounded-full">
                    <span className="text-blue-800">Flexible plan</span>
                  </div>
                  
                  <div className="mt-6 space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 mt-1 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800">📅</span>
                      </div>
                      <p>Schedule your {subscriptionPlans.find(p => p.id === selectedPlan)?.totalLessons} lessons for any time during the 4 week period.</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 mt-1 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800">👨‍🏫</span>
                      </div>
                      <p>Change your tutor for free at any time.</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 mt-1 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800">❌</span>
                      </div>
                      <p>Cancel your plan at any time.</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 mt-1 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800">⏱️</span>
                      </div>
                      <p>Change the duration of your classes at any time.</p>
                    </div>
                  </div>
                  
                  {/* Tutor profile */}
                  <div className="mt-8 flex items-center gap-4 border-t pt-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                      <Image 
                        src="/images/tutor-avatar.jpg" 
                        width={48} 
                        height={48} 
                        alt="Tutor" 
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h5 className="font-bold">Hari Krishna</h5>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">★ 0 (0 reviews)</span>
                      </div>
                      <div className="text-xs flex items-center gap-1">
                        <span>✓</span> Verified
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom action button */}
          <div className="mt-8">
            <button
              onClick={handleContinue}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Continue to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}