import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Requirement from "@/components/Requirement";
import Header from "@/components/Header";
import Sections from "@/components/Sections";
import Section2 from "@/components/Section2";
import HowPreplyWorks from "@/components/HowPreplyWorks";
import FindTheRightTutorForYou from "@/components/FindTheRightTutorForYou";
import Root from "@/components/AssignmentServices";
import Section2_copy from "@/components/Section2_copy";
import Student from "@/models/Student";
import StudentReviews from "@/components/StudentReviews";
import ChatBot from "@/components/ChatBot"; // Import the ChatBot component

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white ">
      <Requirement />
      <div className="bg-white">
        {/* Ensure Navbar is above all content */}
        <Navbar />
        
        <main className="flex flex-col items-center justify-center space-y-6">
          <Header />
          <div className="w-full max-w-7xl space-y-8 gap-3 overflow-hidden">
            <Sections />
            <FindTheRightTutorForYou />
            <div id="how-we-work" className="">
              <Section2_copy />
            </div>
            <StudentReviews />
            <HowPreplyWorks />
            <Root />
            <div id="faq">
              <Section2 />
            </div>
          </div>
        </main>
        <Footer />
        
        {/* Add the ChatBot component */}
        <ChatBot />
      </div>
    </div>
  );
}