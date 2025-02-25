"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TutorDashboard() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-4xl font-bold text-gray-800">Coming Soon</h1>
        <p className="text-lg text-gray-600 mt-4">
          We are working hard to bring you an awesome Tutor Dashboard. Stay tuned!
        </p>
      </div>
      <Footer />
    </div>
  );
}
