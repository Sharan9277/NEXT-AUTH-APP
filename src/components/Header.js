"use client";
import Image from "next/image";
import { useState } from "react";

const Header = () => {
    const images = [
      "/Frame 1272637872.png",
      "/Frame 1272637870.png",
      "/Frame 1272637873.png",
    ];
    const [currentIndex, setCurrentIndex] = useState(1); // Center image by default
  
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
              <button className="bg-at-off-white text-black font-semibold py-2.5 px-8 rounded-lg shadow">
                Get Started
              </button>
              <button className="bg-at-button-light text-at-off-white font-semibold py-2.5 px-8 rounded-lg shadow">
                Become a Tutor
              </button>
            </div>
          </div>
  
          {/* Right Section - Image Carousel */}
          <div className="relative w-[541px] h-[372px] hidden md:block">
            <Image
              className="absolute top-[50px] left-0 rounded-xl object-cover shadow-md z-0"
              width={190}
              height={272}
              alt="Side Image 1"
              src={images[0]}
            />
            <Image
              className="absolute top-0 left-[152px] rounded-xl object-cover shadow-md z-10"
              width={251}
              height={372}
              alt="Center Image"
              src={images[1]}
            />
            <Image
              className="absolute top-[50px] right-0 rounded-xl object-cover shadow-md  z-0"
              width={190}
              height={272}
              alt="Side Image 2"
              src={images[2]}
            />
          </div>
  
          {/* Mobile Image Carousel */}
          <div className="relative w-full md:hidden flex justify-center">
            <Image
              className="rounded-xl object-cover shadow-md"
              width={300}
              height={400}
              alt="Current Image"
              src={images[currentIndex]}
            />
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
