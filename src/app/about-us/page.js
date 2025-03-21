import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";


export default function Home() {
  return (
    <div className="w-100">
    <div className="bg-white justify-center items-center"> 
    <Navbar />
    {/* Header */}
    <main className="flex flex-col items-center justify-center space-y-8">   
    <div className="self-stretch px-[540px] py-40 inline-flex flex-col justify-center items-center bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url('/background3.png')" }}>
    <div className="w-[840px] max-w-[840px] p-12 inline-flex justify-center items-start">
        <div className="text-center justify-center text-color-white-solid text-[72px] font-bold font-inter leading-[72px] [text-shadow:_0px_0px_10px_rgb(0_0_0_/_0.30)]">About Us</div>
        </div>
    </div>
    </main>
    {/* About Us Main Section */}
    <div className=" w-full py-14 bg-color-white-solid inline-flex flex-col justify-center items-center">
    <div className="max-w-[1440px] inline-flex justify-center items-center">
        <div className="flex-1 self-stretch px-12 py-12 inline-flex flex-col justify-center items-start gap-2.5">
            <div className="self-stretch h-11 pb-5 flex flex-col justify-center items-start">
                <div className="self-stretch  flex flex-col justify-start items-start">
                    <div className="self-stretch justify-center text-indigo-500 text-base font-semibold font-inter uppercase leading-relaxed">About assigntutors.com</div>
                </div>
            </div>
            <div className="self-stretch h-20 pb-5 flex flex-col justify-center items-start">
                <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="self-stretch justify-center text-black text-[48px] font-bold font-inter leading-[52.80px]">About Us</div>
                </div>
            </div>
            <div className="self-stretch h-56 pb-5 flex flex-col justify-center items-start">
                <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="self-stretch justify-center"><span className="text-color-azure-15 text-base font-bold font-inter leading-normal">Assigntutors.com</span><span className="text-color-azure-15 text-base font-normal font-inter leading-normal"> is the one-stop solution to all your assignment needs.We provide top-quality plagiarism-free assignment on multiple subjects. We striveon delivering custom academic content in various writing formats. Our serviceshave assisted millions of students in achieving quality grades. We give the highestpriority to deadlines and deliver top-notch content at affordable prices. Our coreprinciple is to respect client privacy and keep your identity safe. We will keep onhelping students achieve good grades and strengthen their academic positions.Summarizing in two words, askmeassignment.com is </span><span className="text-color-azure-15 text-base font-bold font-inter leading-normal">“Quality content”.</span></div>
                </div>
            </div>
            <a 
                href="https://wa.me/yourwhatsapplink" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cursor-pointer"
                >
            <div className="self-stretch h-10 flex flex-col justify-start items-start">
                <div className="px-6 py-3 bg-green-700 rounded-[30px] inline-flex justify-center items-start">

                <div className="flex justify-center items-start gap-[5px]">
                    <div className="self-stretch inline-flex flex-col justify-start items-center">
                    <FaWhatsapp className="text-center justify-center text-color-white-solid text-base font-normal font-['Font_Awesome_5_Brands'] leading-none"/>
                    </div>
                    <div className="self-stretch inline-flex flex-col justify-start items-center">
                    <div className="text-center justify-center text-color-white-solid text-sm font-normal font-inter underline leading-none">Chat Now</div>
                    </div>
                </div>
                
                </div>
            </div>
            </a>
        </div>
        <div className="flex-1 h-[482px] min-h-px p-2.5 flex justify-center items-start">
            <img className="w-[620px] h-[462px] max-w-[620px] relative rounded-[10px]" src="/Earn-With-AMA.jpg.png" />
        </div>
        </div>
    </div>

    {/* Our Team Section */}
    <div className="flex flex-col items-center px-10 pb-16">
  {/* Section Title */}
  <h2 className="text-center text-black text-[48px] font-bold font-inter leading-[52.80px] mb-10">
    Our Team
  </h2>

  {/* Team Cards Container */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1280px]">
    {/* Card 1 */}
    <div className="bg-[#5577D1] rounded-[10px] shadow-lg flex flex-col items-center text-center p-6">
      {/* Profile Image */}
      <img
        className="w-40 h-40 rounded-full border-4 border-white shadow-md -mt-16"
        src="https://placehold.co/160x160"
        alt="Profile"
      />
      {/* Name */}
      <div className="mt-4 text-white text-2xl font-bold font-inter">Shubham Kankaria</div>
      {/* Role */}
      <div className="mt-1 text-white text-base font-semibold font-inter">Founder</div>
      {/* Description */}
      <p className="mt-4 px-6 text-white text-base font-normal font-inter leading-relaxed">
        I am a young Entrepreneur, Founder of Askmeassignment.com and Co-founder of Friscon Solutions. 
        I am a CA dropout and was always eager to start my own company. Along with my fellow partner, 
        co-founder Anuj Goyal, I started Friscon Solutions and never looked back. My strongest belief 
        is that hard work never goes wasted.
      </p>
    </div>

    {/* Card 2 (Replace with Another Member) */}
    <div className="bg-[#5577D1] rounded-[10px] shadow-lg flex flex-col items-center text-center p-6">
      {/* Profile Image */}
      <img
        className="w-40 h-40 rounded-full border-4 border-white shadow-md -mt-16"
        src="https://placehold.co/160x160"
        alt="Profile"
      />
      {/* Name */}
      <div className="mt-4 text-white text-2xl font-bold font-inter">Anuj Goyal</div>
      {/* Role */}
      <div className="mt-1 text-white text-base font-semibold font-inter">Co-Founder</div>
      {/* Description */}
      <p className="mt-4 px-6 text-white text-base font-normal font-inter leading-relaxed">
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
