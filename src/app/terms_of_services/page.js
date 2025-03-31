import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Requirement from "@/components/Requirement";
import TermsOfService from "@/components/TermsOfService";

export default function terms_of_services() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white ">
  <Requirement />
  <div className="bg-white">
    {/* Ensure Navbar is above all content */}
    <Navbar  />
    
    <main className="flex flex-col items-center justify-center space-y-8">
    <TermsOfService />
    </main>
    <Footer />
  </div>
</div>
  );
  
}
