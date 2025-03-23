import React from 'react';

const Sections = () => {
	return (
		<div >

<section className="bg-white py-10 px-5 max-w-screen">
      <div className="max-w-screen mx-auto text-center space-y-6">
        <h1 className="text-black text-2xl md:text-3xl lg:text-[50px] font-inter font-bold">
          Hive Learning Platform
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-xs sm:text-sm md:text-base">
          Fast track your learning journey through our easy-to-use learning platform designed to help you succeed. Sign up today to be a part of the revolution and unlock your potential.
        </p>
      </div>

  <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center text-center sm:text-left mt-10">
  {/* Left Column (Hidden on Mobile) */}
  <div className="hidden sm:flex flex-col space-y-6 w-fit">
    {[
      { label: "Students", value: "462+" },
      { label: "Savings Made", value: "£10,080" },
      { label: "Hive Matches Made", value: "824" },
      { label: "Free Webinars", value: "37" },
    ].map((item, index) => (
      <div key={index} className="flex flex-col items-start">
        <img src="/Component4.svg" alt={item.label} className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
        <h1 className="text-[#2A2E37] text-[40px] font-inter font-bold">{item.value}</h1>
        <p className="text-gray-600 text-sm">{item.label}</p>
      </div>
    ))}
  </div>

  {/* Center Image */}
  <div className="flex justify-center items-center w-full sm:w-fit relative">
    <img src="/Vector.svg" alt="Background" className="absolute w-2/4 sm:w-full" />
    <img src="/Component 4_1.png" alt="Mobile Mockup" className="relative w-2/4 sm:w-full object-contain rounded-3xl" />
  </div>

  {/* Right Column (Hidden on Mobile) */}
  <div className="hidden sm:flex flex-col space-y-6 w-fit text-right">
    {[
      { label: "Tutors", value: "137+" },
      { label: "Subjects Taught", value: "37" },
      { label: "Lessons Taught", value: "1,249" },
      { label: "Available Spaces", value: "670" },
    ].map((item, index) => (
      <div key={index} className="flex flex-col items-end">
        <img src="/Component4.svg" alt={item.label} className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
        <h1 className="text-[#2A2E37] text-[40px] font-inter font-bold">{item.value}</h1>
        <p className="text-gray-600 text-sm">{item.label}</p>
      </div>
    ))}
  </div>
</div>



    </section>


<section className="bg-white py-10 overflow-hidden">
  <h2 className="text-black text-[45px] font-bold text-center mb-6">Assignment Help Services Across the Globe!</h2>
  <div className="w-full flex justify-center overflow-hidden">
    <div className="w-[600px] overflow-hidden">
      <div className="flex animate-scroll gap-4 items-center">
        <img src="/uk-3051b9d5.png.png" alt="UK Flag" className="w-20 h-20 object-contain" />
        <img src="/ireland.png" alt="Ireland Flag" className="w-20 h-20 object-contain" />
        <img src="/canada.png" alt="Canada Flag" className="w-20 h-20 object-contain" />
        <img src="/singapore.png" alt="Singapore Flag" className="w-20 h-20 object-contain" />
        <img src="/india.png" alt="India Flag" className="w-20 h-20 object-contain" />
        <img src="/australia.png" alt="Australia Flag" className="w-20 h-20 object-contain" />
      </div>
    </div>
  </div>
</section>

	  </div> 
	  );
	};

export default Sections;
