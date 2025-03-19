import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Requirement from "@/components/Requirement";
import AssignmentHelpFeatures from "@/components/AssignmentHelpFeatures";
import TestimonialSection from "@/components/TestimonialSection";
import Assignment2 from "@/components/Assignment2";
import AssignmentSteps from "@/components/AssignmentSteps";
import AssignmentHeader from "@/components/AssignmentHeader";
import Section2 from "@/components/Section2";

export default function Home() {
  return (
    <div className="w-100">
    <Requirement />
    <div className="bg-white">
    <Navbar />
    <main className="h-full items-center justify-center ">   
        <AssignmentHeader/>
      <AssignmentHelpFeatures/>
      <TestimonialSection/>  
      <Assignment2 />    
      <AssignmentSteps/>
      < Section2/>
    </main>
    <Footer /> 
    </div>
    </div>
  );
}
