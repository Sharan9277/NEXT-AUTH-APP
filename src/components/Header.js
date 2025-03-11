import Image from "next/image";

const Header = () => {
  return (
    <div className="w-full bg-at-light-orange py-10 px-4 box-border text-preplycom-black">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Section - Heading and Buttons */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-semibold md:text-[72px] md:font-semibold leading-snug md:leading-[90px]">
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

        {/* Right Section - Image Gallery */}
        <div className="relative w-[541px] h-[372px]">
          <Image
            className="absolute top-[50px] left-0 rounded-xl object-cover shadow-md"
            width={190}
            height={272}
            alt="Cyclist Image 1"
            src="/Frame 1272637872.png"
          />
          <Image
            className="absolute top-[50px] right-0 rounded-xl object-cover shadow-md"
            width={190}
            height={272}
            alt="Cyclist Image 2"
            src="/Frame 1272637873.png"
          />
          <Image
            className="absolute top-0 left-[152px] rounded-xl object-cover shadow-md"
            width={251}
            height={372}
            alt="Cyclist Image 3"
            src="/Frame 1272637870.png"
          />
        </div>
      </div>

      {/* Design Guidelines Section */}
	  <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-at-off-white rounded-xl p-6 shadow-md text-left"
          >
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
