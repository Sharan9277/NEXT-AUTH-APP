import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Requirement from "@/components/Requirement";
import Header from "@/components/Header";
import Sections from "@/components/Sections";
import Sectionss from "@/components/Sectionss";

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
      <Sectionss/>
      </div>
      
      
      
    </main>
    <Footer />
    
    
    </div>
    </div>
  );
}
