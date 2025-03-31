import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Requirement from "@/components/Requirement";

import PrivacyPolicy from "@/components/PrivacyPolicy";

export default function privacy_policy() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white ">
  <Requirement />
  <div className="bg-white">
    {/* Ensure Navbar is above all content */}
    <Navbar  />
    
    <main className="flex flex-col items-center justify-center space-y-8">
    <PrivacyPolicy />
    </main>
    <Footer />
  </div>
</div>
  );
  
}
