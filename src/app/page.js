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
    <div className="relative min-h-screen flex flex-col bg-white ">
  <Requirement />
  <div className="bg-white">
    {/* Ensure Navbar is above all content */}
    <Navbar  />
    
    <main className="flex flex-col items-center justify-center space-y-8">
      <Header />
      <div className="w-full max-w-7xl space-y-8 gap-3 overflow-hidden">
        <Sections />
        <FindTheRightTutorForYou />
        <HowPreplyWorks />
        <Root />
        <Section2 />
      </div>
    </main>
    <Footer />
  </div>
</div>
  );
  
}
