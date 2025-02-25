import React from 'react';

const Sections = () => {
	return (
		<div >
		<section className="bg-white py-10 px-5">
  <div className="max-w-7xl mx-auto text-center space-y-6">
    <h1 className="text-black text-[50px] font-inter font-bold">Hive Learning Platform</h1>
    <p className="text-gray-600 max-w-3xl mx-auto">
      Fast track your learning journey through our easy-to-use learning platform designed to help you succeed. Sign up today to be a part of the revolution and unlock your potential.
    </p>
  </div>

  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mt-10">

    {/* Left Column - Image on Left */}
    <div className="space-y-6 text-left">
      <div>
        <img src="/Component4.svg" alt="Mobile Mockup" className="w-10 h-10 mb-2" />
        <h2 className="text-[#2A2E37] text-[48px] font-outfit font-extrabold leading-[56px] tracking-[-0.5px]">462+</h2>
        <p className="text-gray-600">Students</p>
      </div>
      <div>
        <img src="/Component4.svg" alt="Mobile Mockup" className="w-10 h-10 mb-2" />
        <h2 className="text-[#2A2E37] text-[48px] font-outfit font-extrabold leading-[56px] tracking-[-0.5px]">£10,080</h2>
        <p className="text-gray-600">Savings Made</p>
      </div>
      <div>
        <img src="/Component4.svg" alt="Mobile Mockup" className="w-10 h-10 mb-2" />
        <h2 className="text-[#2A2E37] text-[48px] font-outfit font-extrabold leading-[56px] tracking-[-0.5px]">824</h2>
        <p className="text-gray-600">Hive Matches Made</p>
      </div>
      <div>
        <img src="/Component4.svg" alt="Mobile Mockup" className="w-10 h-10 mb-2" />
        <h2 className="text-[#2A2E37] text-[48px] font-outfit font-extrabold leading-[56px] tracking-[-0.5px]">37</h2>
        <p className="text-gray-600">Free Webinars</p>
      </div>
    </div>

{/* Center Image */}
<div className="relative h-full flex justify-center items-center">  
  {/* Mobile Mockup */}
  <img src="/Vector.svg" alt="Background" className="absolute" />
  <img src="/Component 4_1.png" alt="Mobile Mockup" className="relative  object-contain rounded-3xl" />
</div>



    {/* Right Column - Image on Right */}
    <div className="space-y-6 text-right">
      <div className="flex flex-col items-end">
        <img src="/Component4.svg" alt="Mobile Mockup" className="w-10 h-10 mb-2" />
        <h2 className="text-[#2A2E37] text-[48px] font-outfit font-extrabold leading-[56px] tracking-[-0.5px]">137+</h2>
        <p className="text-gray-600">Tutors</p>
      </div>
      <div className="flex flex-col items-end">
        <img src="/Component4.svg" alt="Mobile Mockup" className="w-10 h-10 mb-2" />
        <h2 className="text-[#2A2E37] text-[48px] font-outfit font-extrabold leading-[56px] tracking-[-0.5px]">37</h2>
        <p className="text-gray-600">Subjects Taught</p>
      </div>
      <div className="flex flex-col items-end">
        <img src="/Component4.svg" alt="Mobile Mockup" className="w-10 h-10 mb-2" />
        <h2 className="text-[#2A2E37] text-[48px] font-outfit font-extrabold leading-[56px] tracking-[-0.5px]">1,249</h2>
        <p className="text-gray-600">Lessons Taught</p>
      </div>
      <div className="flex flex-col items-end">
        <img src="/Component4.svg" alt="Mobile Mockup" className="w-10 h-10 mb-2" />
        <h2 className="text-[#2A2E37] text-[48px] font-outfit font-extrabold leading-[56px] tracking-[-0.5px]">670</h2>
        <p className="text-gray-600">Available Spaces</p>
      </div>
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
