import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";
import Section2 from "@/components/Section2";

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
            <div className="w-full max-w-4xl p-4 sm:p-8 md:p-12 flex justify-center items-start">
              <div className="text-center justify-center text-color-white-solid text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold font-inter leading-tight md:leading-[72px] [text-shadow:_0px_0px_10px_rgb(0_0_0_/_0.30)]">
                How We Work
              </div>
            </div>
          </div>
        </main>

        {/* Potentials of Our Company Section - Made Responsive */}
        <div className="flex flex-col items-center px-4 sm:px-6 md:px-10 py-6 sm:py-10 w-full">
          {/* Section Title */}
          <h2 className="text-center text-black text-3xl sm:text-4xl md:text-[48px] font-bold font-inter leading-tight md:leading-[52.80px] mx-4">
            Potentials of Our Company
          </h2>

          {/* One-liner */}
          <p className="text-center text-gray-600 text-sm sm:text-base font-normal font-inter max-w-screen mb-4 sm:mb-8 mt-2">
            The main goal of <span className="font-bold">Askmeassignment.com</span> is to offer academic writing assistance to all students, anywhere in the globe, for a fee in accordance with our criteria.
          </p>

          {/* How We Work Heading */}
          <h3 className="text-center text-black text-2xl sm:text-3xl md:text-[36px] font-bold font-inter leading-tight sm:leading-10 mb-4 sm:mb-6">
            How We Work
          </h3>

          {/* Work Process - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-[1280px] w-full">
            {/* Step 1 */}
            <div className="bg-white rounded-[20px] px-4 sm:px-6 py-4 sm:py-5">
              <h4 className="text-base sm:text-lg font-bold text-[#00384F] mb-2 sm:mb-4">
                1. Associated with the best expert writers
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Writers have to go through both written and verbal tests followed by an interview to get hired. We ensure that only specialized writers come along.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-[20px] px-4 sm:px-6 py-4 sm:py-5">
              <h4 className="text-base sm:text-lg font-bold text-[#00384F] mb-2 sm:mb-4">
                2. Two months training program
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Every fresher has to go through a two-month training program. We provide the required assistance to make them specialized academic writers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-[20px] px-4 sm:px-6 py-4 sm:py-5">
              <h4 className="text-base sm:text-lg font-bold text-[#00384F] mb-2 sm:mb-4">
                3. Quality assurance process
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-[20px] px-4 sm:px-6 py-4 sm:py-5">
              <h4 className="text-base sm:text-lg font-bold text-[#00384F] mb-2 sm:mb-4">
                4. Quality assurance process
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-[20px] px-4 sm:px-6 py-4 sm:py-5">
              <h4 className="text-base sm:text-lg font-bold text-[#00384F] mb-2 sm:mb-4">
                5. Quality assurance process
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
              </p>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-[20px] px-4 sm:px-6 py-4 sm:py-5">
              <h4 className="text-base sm:text-lg font-bold text-[#00384F] mb-2 sm:mb-4">
                6. Quality assurance process
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
              </p>
            </div>

            {/* Step 7 */}
            <div className="bg-white rounded-[20px] px-4 sm:px-6 py-4 sm:py-5">
              <h4 className="text-base sm:text-lg font-bold text-[#00384F] mb-2 sm:mb-4">
                7. Quality assurance process
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
              </p>
            </div>

            {/* Step 8 */}
            <div className="bg-white rounded-[20px] px-4 sm:px-6 py-4 sm:py-5">
              <h4 className="text-base sm:text-lg font-bold text-[#00384F] mb-2 sm:mb-4">
                8. Quality assurance process
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Each assignment undergoes a rigorous quality check to ensure accuracy, originality, and adherence to client requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Section2 Component */}
        <Section2 />

        {/* CTA Section - Made Responsive */}
        <div className="flex flex-col items-center bg-at-light-orange px-4 sm:px-6 md:px-8 py-6 sm:py-10 text-center w-full">
          {/* Main Heading */}
          <h2 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold font-inter leading-tight sm:leading-[1.2] max-w-4xl mb-4">
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
              <button className="flex items-center gap-2 bg-at-button-light text-white text-sm sm:text-base md:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full underline">
                <FaWhatsapp className="text-color-white-solid" /> 
                <span className="text-sm sm:text-base">Chat Support is Active 24x7</span>
              </button>
            </div>
          </a>
        </div>

        <Footer />
      </div>
    </div>
  );
}