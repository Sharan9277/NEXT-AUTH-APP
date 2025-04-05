import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";

export default function Home() {
  return (
    <div className="w-full">
      <div className="bg-white justify-center items-center">
        <Navbar />
        
        {/* Header - Made Responsive */}
        <main className="flex flex-col items-center justify-center w-full">
          <div 
            className="w-full py-20 md:py-40 flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat px-4 sm:px-8 md:px-12 lg:px-20"
            style={{ backgroundImage: "url('/Background3.png')" }}
          >
            <div className="w-full max-w-4xl p-4 sm:p-8 md:p-12 inline-flex justify-center items-start">
              <div className="text-center justify-center text-color-white-solid text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold font-inter leading-tight md:leading-[72px] [text-shadow:_0px_0px_10px_rgb(0_0_0_/_0.30)]">
                About Us
              </div>
            </div>
          </div>
        </main>
        
        {/* About Us Main Section - Made Responsive */}
        <div className="w-full py-8 md:py-14 bg-color-white-solid flex flex-col justify-center items-center">
          <div className="max-w-[1440px] w-full flex flex-col lg:flex-row justify-center items-center">
            <div className="w-full lg:flex-1 px-4 sm:px-8 md:px-12 py-6 md:py-12 flex flex-col justify-center items-start gap-2.5">
              <div className="w-full pb-3 md:pb-5 flex flex-col justify-center items-start">
                <div className="w-full flex flex-col justify-start items-start">
                  <div className="w-full justify-center text-indigo-500 text-sm sm:text-base font-semibold font-inter uppercase leading-relaxed">
                    About assigntutors.com
                  </div>
                </div>
              </div>
              <div className="w-full pb-3 md:pb-5 flex flex-col justify-center items-start">
                <div className="w-full flex flex-col justify-start items-start">
                  <div className="w-full justify-center text-black text-3xl sm:text-4xl md:text-[48px] font-bold font-inter leading-tight md:leading-[52.80px]">
                    About Us
                  </div>
                </div>
              </div>
              <div className="w-full pb-5 flex flex-col justify-center items-start">
                <div className="w-full flex flex-col justify-start items-start">
                  <div className="w-full justify-center">
                    <span className="text-color-azure-15 text-sm sm:text-base font-bold font-inter leading-normal">Assigntutors.com</span>
                    <span className="text-color-azure-15 text-sm sm:text-base font-normal font-inter leading-normal"> is the one-stop solution to all your assignment needs. We provide top-quality plagiarism-free assignment on multiple subjects. We strive on delivering custom academic content in various writing formats. Our services have assisted millions of students in achieving quality grades. We give the highest priority to deadlines and deliver top-notch content at affordable prices. Our core principle is to respect client privacy and keep your identity safe. We will keep on helping students achieve good grades and strengthen their academic positions. Summarizing in two words, askmeassignment.com is </span>
                    <span className="text-color-azure-15 text-sm sm:text-base font-bold font-inter leading-normal">"Quality content".</span>
                  </div>
                </div>
              </div>
              <a 
                href="https://wa.me/yourwhatsapplink" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cursor-pointer self-start"
              >
                <div className="flex flex-col justify-start items-start">
                  <div className="px-4 sm:px-6 py-2 sm:py-3 bg-green-700 rounded-[30px] inline-flex justify-center items-center">
                    <div className="flex justify-center items-center gap-[5px]">
                      <FaWhatsapp className="text-color-white-solid text-base" />
                      <div className="text-color-white-solid text-sm font-normal font-inter underline">
                        Chat Now
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className="w-full lg:flex-1 p-4 flex justify-center items-center">
              <img 
                className="w-full max-w-[620px] h-auto rounded-[10px]" 
                src="/Earn-With-AMA.jpg.png" 
                alt="Earn With AMA"
              />
            </div>
          </div>
        </div>

        {/* Our Team Section - Made Responsive */}
        <div className="flex flex-col items-center px-4 sm:px-6 md:px-10 pb-8 md:pb-16 w-full">
          {/* Section Title */}
          <h2 className="text-center text-black text-3xl sm:text-4xl md:text-[48px] font-bold font-inter leading-tight md:leading-[52.80px] mb-6 md:mb-10">
            Our Team
          </h2>

          {/* Team Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1280px] w-full px-4">
            {/* Card 1 */}
            <div className="bg-[#5577D1] rounded-[10px] shadow-lg flex flex-col items-center text-center p-4 md:p-6 mt-16">
              {/* Profile Image */}
              <img
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md -mt-16"
                src="https://placehold.co/160x160"
                alt="Profile"
              />
              {/* Name */}
              <div className="mt-4 text-white text-xl sm:text-2xl font-bold font-inter">Shubham Kankaria</div>
              {/* Role */}
              <div className="mt-1 text-white text-sm sm:text-base font-semibold font-inter">Founder</div>
              {/* Description */}
              <p className="mt-4 px-2 sm:px-6 text-white text-sm sm:text-base font-normal font-inter leading-relaxed">
                I am a young Entrepreneur, Founder of Askmeassignment.com and Co-founder of Friscon Solutions. 
                I am a CA dropout and was always eager to start my own company. Along with my fellow partner, 
                co-founder Anuj Goyal, I started Friscon Solutions and never looked back. My strongest belief 
                is that hard work never goes wasted.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#5577D1] rounded-[10px] shadow-lg flex flex-col items-center text-center p-4 md:p-6 mt-16">
              {/* Profile Image */}
              <img
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md -mt-16"
                src="https://placehold.co/160x160"
                alt="Profile"
              />
              {/* Name */}
              <div className="mt-4 text-white text-xl sm:text-2xl font-bold font-inter">Anuj Goyal</div>
              {/* Role */}
              <div className="mt-1 text-white text-sm sm:text-base font-semibold font-inter">Co-Founder</div>
              {/* Description */}
              <p className="mt-4 px-2 sm:px-6 text-white text-sm sm:text-base font-normal font-inter leading-relaxed">
                Passionate about technology and entrepreneurship, I co-founded Friscon Solutions 
                to revolutionize the way businesses operate. With years of experience, I believe 
                that innovation and persistence drive success.
              </p>
            </div>
          </div>
        </div>

        <Footer /> 
      </div>
    </div>
  );
}