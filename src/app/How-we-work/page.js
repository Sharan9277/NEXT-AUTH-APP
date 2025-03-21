import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";
import Section2 from "@/components/Section2";


export default function Home() {
  return (
    <div className="w-100">
    <div className="bg-white justify-center items-center"> 
    <Navbar />
    {/* Header */}
    <main className="flex flex-col items-center justify-center space-y-8">   
    <div className="self-stretch px-[540px] py-40 inline-flex flex-col justify-center items-center bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url('/background3.png')" }}>
    <div className="w-[840px] max-w-[840px] p-12 inline-flex justify-center items-start">
        <div className="text-center justify-center text-color-white-solid text-[72px] font-bold font-inter leading-[72px] [text-shadow:_0px_0px_10px_rgb(0_0_0_/_0.30)]">How We Work</div>
        </div>
    </div>
    </main>
    <div className="flex flex-col items-center px-10 py-10">
  {/* Section Title */}
  <h2 className="text-center text-black text-[48px] font-bold font-inter leading-[52.80px] mx-4">
    Potentials of Our Company
  </h2>

  {/* One-liner */}
  <p className="text-center text-gray-600 text-base font-normal font-inter max-w-screen mb-8 mt-2">
    The main goal of <span className="font-bold">Askmeassignment.com</span> is to offer academic writing assistance to all students, anywhere in the globe, for a fee in accordance with our criteria.
  </p>

  {/* How We Work Heading */}
  <h3 className="text-center text-black text-[36px] font-bold font-inter leading-10 mb-6">
    How We Work
  </h3>

  {/* Work Process - Responsive Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-[1280px]">
    {/* Step 1 */}
    <div className="bg-white rounded-[20px]  px-6">
      <h4 className="text-lg font-bold text-[#00384F] mb-4">
        1. Associated with the best expert writers
      </h4>
      <p className="text-gray-600 text-base">
        Writers have to go through both written and verbal tests followed by an interview to get hired. We ensure that only specialized writers come along.
      </p>
    </div>

    {/* Step 2 */}
    <div className="bg-white rounded-[20px]  px-6">
      <h4 className="text-lg font-bold text-[#00384F] mb-4">
        2. Two months training program
      </h4>
      <p className="text-gray-600 text-base">
        Every fresher has to go through a two-month training program. We provide the required assistance to make them specialized academic writers.
      </p>
    </div>

    {/* Step 3 (Add More If Needed) */}
    <div className="bg-white rounded-[20px]  px-6">
      <h4 className="text-lg font-bold text-[#00384F] mb-4">
        3. Quality assurance process
      </h4>
      <p className="text-gray-600 text-base">
        Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
      </p>
    </div>

    <div className="bg-white rounded-[20px]  px-6">
      <h4 className="text-lg font-bold text-[#00384F] mb-4">
        4. Quality assurance process
      </h4>
      <p className="text-gray-600 text-base">
        Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
      </p>
    </div>
    <div className="bg-white rounded-[20px]  px-6">
      <h4 className="text-lg font-bold text-[#00384F] mb-4">
        4. Quality assurance process
      </h4>
      <p className="text-gray-600 text-base">
        Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
      </p>
    </div>
    <div className="bg-white rounded-[20px]  px-6">
      <h4 className="text-lg font-bold text-[#00384F] mb-4">
        4. Quality assurance process
      </h4>
      <p className="text-gray-600 text-base">
        Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
      </p>
    </div>
    <div className="bg-white rounded-[20px]  px-6">
      <h4 className="text-lg font-bold text-[#00384F] mb-4">
        4. Quality assurance process
      </h4>
      <p className="text-gray-600 text-base">
        Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
      </p>
    </div>
    <div className="bg-white rounded-[20px]  px-6">
      <h4 className="text-lg font-bold text-[#00384F] mb-4">
        4. Quality assurance process
      </h4>
      <p className="text-gray-600 text-base">
        Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
      </p>
    </div>

  </div>
</div>
<Section2 />
<div className="flex flex-col items-center bg-at-light-orange  px-8 py-10 text-center">
  {/* Main Heading */}
  <h2 className="text-black text-[48px] font-bold font-inter leading-[1.2]  max-w-4xl mb-4">
    Are You Struggling With SOP And Looking for Professional SOP Writers?
  </h2>

  {/* Support Button */}
  <a 
                href="https://wa.me/yourwhatsapplink" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cursor-pointer"
                >
  <div className="mt-4">
    <button className="flex items-center gap-2 bg-at-button-light text-white text-lg px-6 py-3 rounded-full underline">
    <FaWhatsapp className="text-center justify-center text-color-white-solid font-regular font-inter"/> Chat Support is Active 24x7
    </button>
  </div>
  </a>
</div>






    <Footer /> 
    </div>
    </div>
  );
}
