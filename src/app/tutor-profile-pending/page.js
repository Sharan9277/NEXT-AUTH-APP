"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TutorProfilePending() {
  const router = useRouter();
  
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Profile Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your tutor profile has been submitted for review. Our team will verify your information
            and approve your account. You'll receive an email notification once your account is approved.
          </p>
          
          <div className="p-4 bg-blue-50 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-700 mb-2">What's Next?</h3>
            <ol className="text-left text-gray-700 list-decimal pl-5 space-y-2">
              <li>Our team will review your profile and qualifications</li>
              <li>You'll receive an email once your profile is approved</li>
              <li>Once approved, you can access your dashboard and start teaching</li>
            </ol>
          </div>
          
          <button
            onClick={() => router.push("/login/tutor")}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Return to Login
          </button>
          
          <p className="mt-4 text-sm text-gray-500">
            If you have any questions, please contact our support team at{" "}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}