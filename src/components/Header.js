"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const images = [
    "/Frame 1272637872.png",
    "/Frame 1272637870.png",
    "/Frame 1272637873.png",
  ];
  const [currentIndex, setCurrentIndex] = useState(1); // Center image by default
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      rotateImages();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  const rotateImages = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // For mobile and desktop
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Calculate positions for desktop carousel
  const getImagePositions = () => {
    const positions = [
      { position: "left", zIndex: 0, top: 50 },
      { position: "center", zIndex: 10, top: 0 },
      { position: "right", zIndex: 0, top: 50 },
    ];
    
    // Rotate positions based on currentIndex
    const rotated = [...positions];
    for (let i = 0; i < currentIndex; i++) {
      rotated.push(rotated.shift());
    }
    
    return rotated;
  };

  const imagePositions = getImagePositions();

  return (
    <div className="w-full bg-at-light-orange py-10 px-4 text-preplycom-black">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Section - Heading and Buttons */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-semibold md:text-[72px] leading-snug md:leading-[90px]">
            Adapting and Thriving in a Changing World
          </h1>
          <div className="flex justify-center md:justify-start gap-4 mt-6">
            <Link href="/get-started">
              <button className="bg-at-off-white text-black font-semibold py-2.5 px-8 rounded-lg shadow">
                Get Started
              </button>
            </Link>
            <button className="bg-at-button-light text-at-off-white font-semibold py-2.5 px-8 rounded-lg shadow">
              Become a Tutor
            </button>
          </div>
        </div>

        {/* Right Section - Desktop Image Carousel */}
        <div className="relative w-[541px] h-[372px] hidden md:block">
          {images.map((src, index) => {
            const pos = imagePositions[index];
            
            // Set appropriate styles based on position
            let positionClass = "";
            let width = 190;
            let height = 272;
            
            if (pos.position === "left") {
              positionClass = "left-0";
            } else if (pos.position === "center") {
              positionClass = "left-[152px]";
              width = 251;
              height = 372;
            } else {
              positionClass = "right-0";
            }
            
            return (
              <div 
                key={index}
                className={`absolute transition-all duration-500 ease-in-out ${positionClass}`}
                style={{ top: `${pos.top}px`, zIndex: pos.zIndex }}
              >
                <Image
                  className="rounded-xl object-cover shadow-md"
                  width={width}
                  height={height}
                  alt={`Carousel Image ${index}`}
                  src={src}
                />
              </div>
            );
          })}
          
          {/* Carousel Navigation */}
        </div>

        {/* Mobile Image Carousel */}
        <div className="relative w-full md:hidden flex flex-col items-center">
          <div className="relative w-[300px] h-[400px]">
            {images.map((src, idx) => (
              <Image
                key={idx}
                className={`rounded-xl object-cover shadow-md absolute top-0 left-0 transition-opacity duration-500 ease-in-out ${
                  currentIndex === idx ? 'opacity-100' : 'opacity-0'
                }`}
                width={300}
                height={400}
                alt={`Current Image ${idx}`}
                src={src}
              />
            ))}
          </div>
          
          {/* Mobile Dots */}
          <div className="flex gap-2 mt-4">
            {images.map((_, index) => (
              <button 
                key={index}
                className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-black' : 'bg-gray-400'}`}
                onClick={() => {
                  if (!isAnimating) {
                    setCurrentIndex(index);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Design Guidelines Section */}
      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-at-off-white rounded-xl p-6 shadow-md text-left">
            <h2 className="text-[20px] font-medium font-[500]">Design Guideline</h2>
            <p className="text-[16px] mt-2">
              Consistency is key to effective design. Establishing consistent visual elements.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;