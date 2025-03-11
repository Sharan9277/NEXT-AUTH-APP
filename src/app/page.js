import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Requirement from "@/components/Requirement";
import Header from "@/components/Header";
import Sections from "@/components/Sections";
import Section2 from "@/components/Section2";
import HowPreplyWorks from "@/components/HowPreplyWorks";
import FindTheRightTutorForYou from "@/components/FindTheRightTutorForYou";
import Root from "@/components/AssignmentServices";

export default function Home() {
  return (
    <div className="w-100">
    <Requirement />
    <div className="bg-white">
    <Navbar />
    <main className="flex flex-col items-center justify-center space-y-8">   
      <Header />
      <div className="space-y-8 gap-4">    
      <Sections />
      <FindTheRightTutorForYou />
      <HowPreplyWorks />  
      <Root/>  
      <Section2 />
      </div>      
    </main>
    <Footer /> 
    </div>
    </div>
  );
}
