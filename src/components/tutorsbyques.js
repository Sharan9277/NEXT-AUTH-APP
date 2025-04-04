"use client";
import Image from "next/image";
import PropTypes from "prop-types";

export default function TutorsByQues({ className = "" }) {
  return (
    <div className={`w-full flex flex-col lg:flex-row items-center lg:items-start justify-between p-4 sm:p-6 md:p-8 pb-8 md:pb-12 gap-6 sm:gap-8 lg:gap-16 ${className}`}>
      {/* Left Content Section */}
      <div className="w-full lg:w-3/5 flex flex-col items-start justify-start pt-2 sm:pt-4 md:pt-8">
        {/* Heading */}
        <div className="w-full mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[54px] text-black font-semibold font-inter tracking-tight leading-tight mb-3 sm:mb-4">
            <span className="block">Online English tutors &</span>
            <span className="block">teachers for private lessons</span>
          </h1>
          
          {/* Description with Read More */}
          <div className="relative text-xs sm:text-sm md:text-base text-black font-inter leading-normal">
            <div className="mb-2">
              Looking for an online English tutor? Preply is the leading online language learning platform 
              worldwide. You can choose from 27763 English teachers with an average rating of 4.91 out of 
              5 stars given by 262808 customers.
            </div>
          </div>
        </div>
        
        {/* "Get a personalized choice" Section */}
        <div className="w-full mb-4 sm:mb-6">
          <div className="mb-3">
            <span className="font-bold text-sm sm:text-base font-inter text-black">Get a personalized choice of tutors</span>
            <span className="font-semibold text-sm sm:text-base font-inter text-black"> by answering a few quick questions</span>
          </div>
          
          {/* Selection and Button */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-full sm:flex-grow rounded-lg bg-white border-2 border-[#dcdce5] flex items-center px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex justify-between items-center w-full">
                <span className="font-semibold text-sm sm:text-base text-black font-inter">English</span>
                <Image
                  className="w-2 h-2 sm:w-3 sm:h-2"
                  width={12}
                  height={8}
                  alt="Dropdown arrow"
                  src="/Vector (1).svg"
                />
              </div>
            </div>
            
            <button className="w-full sm:w-[255px] px-2 sm:px-2 py-2 sm:py-3 bg-[#5577d1] text-white font-semibold rounded-lg border border-white flex items-center justify-center">
              <a href="/get-started" className=" text-[12px] sm:text-[15px] lg:text-[16px] pr-2">Get started</a>
              <Image
                className="h-3 w-3 sm:h-5 sm:w-5"
                width={20}
                height={20}
                alt="Arrow"
                src="/Vector (1).svg"
              />
            </button>
          </div>
          
          {/* "Choose by myself" link */}
          <a 
            href="#tutors-section" 
            className="underline font-semibold cursor-pointer text-black text-xs sm:text-sm md:text-base"
          >
            Choose by myself from 27,763 tutors
          </a>
        </div>
      </div>
      
      {/* Right Images Section */}
      <div className="w-full lg:w-2/5 flex justify-center lg:justify-end mt-2 sm:mt-4 lg:mt-0">
        <div className="relative h-48 xs:h-56 sm:h-72 md:h-80 lg:h-[432px] w-full max-w-xs sm:max-w-sm">
          {/* Images with overlapping effect - improved for mobile */}
          <div className="absolute top-0 right-0 z-10 w-4/5 h-full">
            <Image
              className="rounded-lg object-cover h-full w-full"
              width={324}
              height={432}
              alt="Tutor"
              src="/Image [styles-module_image__LAg3H].png"
            />
          </div>
          <div className="absolute top-0 right-8 xs:right-12 sm:right-16 z-20 w-4/5 h-full">
            <Image
              className="rounded-lg object-cover h-full w-full"
              width={324}
              height={432}
              alt="Tutor"
              src="/Image [styles-module_image__LAg3H].png"
            />
          </div>
          <div className="absolute top-0 right-16 xs:right-24 sm:right-32 z-30 w-4/5 h-full">
            <Image
              className="rounded-lg object-cover h-full w-full"
              loading="lazy"
              width={324}
              height={432}
              alt="Tutor"
              src="/Image [styles-module_image__LAg3H].png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

TutorsByQues.propTypes = {
  className: PropTypes.string,
};  