"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StudentReviews = () => {
  // Sample student review data
  const reviews = [
    {
      id: 1,
      name: "Bijapur Rakesh",
      date: "2024-11-29",
      content: "I'm very happy with they service and the quality of work 😊 thanks you sir",
      rating: 5,
      verified: true,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "manish neupane",
      date: "2024-11-25",
      content: "Great service",
      rating: 5,
      verified: true,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      name: "Sniya Merin antony",
      date: "2024-11-07",
      content: "Hey, I'm so grateful .... I got my results and I passed for 2 assignments....",
      rating: 5,
      verified: true,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      date: "2024-10-22",
      content: "Excellent materials and responsive support team. Would highly recommend!",
      rating: 5,
      verified: true,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 5,
      name: "Alex Chen",
      date: "2024-10-15",
      content: "The tutoring sessions were incredibly helpful. My grades improved significantly after just three weeks.",
      rating: 5,
      verified: true,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 6,
      name: "Priya Sharma",
      date: "2024-10-03",
      content: "Very professional service. Clear explanations and prompt responses to all my questions.",
      rating: 5,
      verified: true,
      avatar: "/api/placeholder/40/40"
    }
  ];

  // State for managing visible reviews and screen size
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1); // Show only 1 on mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2); // Show 2 on tablets
      } else {
        setVisibleCount(3); // Show 3 on desktop
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation handlers
  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(reviews.length - visibleCount, prev + 1));
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-xl md:text-2xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="py-8 md:py-12 px-4 w-full bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[30px] font-inter md:text-[34px] font-semibold text-center text-black mb-8 md:mb-12">Our Student's Reviews</h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start lg:items-center mb-8">
          {/* Rating summary - centered on mobile, left side on desktop */}
          <div className="w-full md:w-1/4 flex flex-col items-center mb-6 md:mb-0 text-black">
            <div className="text-xl md:text-2xl font-bold mb-2">EXCELLENT</div>
            <div className="flex mb-2">
              {renderStars(4.5)}
            </div>
            <div className="text-sm mb-4">Based on 469 reviews</div>
            <img src="Google_2015_logo.svg.webp" alt="Google Logo" className="h-8 md:h-10" />
          </div>
          
          {/* Reviews carousel - takes full width on mobile */}
          <div className="w-full md:w-3/4 relative">
            <div className="flex space-x-4">
              {reviews.slice(startIndex, startIndex + visibleCount).map(review => (
                <div 
                  key={review.id} 
                  className={`bg-gray-100 rounded-lg p-4 md:p-6 font-inter ${
                    visibleCount === 1 ? 'w-full' : 
                    visibleCount === 2 ? 'w-1/2' : 'w-1/3'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-2 md:mr-3"
                      />
                      <div>
                        <div className="font-semibold text-black text-[10px] md:text-[14px]">{review.name}</div>
                        <div className="text-xs md:text-sm text-gray-500">{review.date}</div>
                      </div>
                    </div>
                    <img src="google_logo-google_icongoogle-512.webp" alt="Google" className="h-4 md:h-5" />
                  </div>
                  
                  <div className="flex items-center mb-2 rounded-full">
                    {renderStars(review.rating)}
                    {review.verified && (
                      <span className="ml-2 text-blue-600 text-xs md:text-sm bg-blue-100 rounded-full p-1">✓</span>
                    )}
                  </div>
                  
                  <p className="text-xs md:text-sm text-black">{review.content}</p>
                </div>
              ))}
            </div>
            
            {/* Navigation buttons */}
            <button 
              onClick={handlePrev}
              disabled={startIndex === 0}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 -ml-3 md:-ml-6 bg-white rounded-full p-1 md:p-2 shadow ${startIndex === 0 ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={handleNext}
              disabled={startIndex >= reviews.length - visibleCount}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 -mr-3 md:-mr-6 bg-white rounded-full p-1 md:p-2 shadow ${startIndex >= reviews.length - visibleCount ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReviews;