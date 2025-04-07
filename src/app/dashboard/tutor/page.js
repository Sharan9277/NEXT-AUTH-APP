"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useState("Authenticating...");

  useEffect(() => {
    if (status === "authenticated") {
      const userId = session?.user?.id;

      if (userId) {
        setLoadingMessage("Redirecting to your dashboard...");
        router.push(`/dashboard/tutor/${userId}`);
      } else {
        setLoadingMessage("Unable to find tutor ID.");
      }
    }
  }, [session, status, router]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Loading...</h1>
        <p className="text-gray-600">{loadingMessage}</p>
      </div>
      <Footer />
    </div>
  );
}
