"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginSelection() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="flex flex-row items-center justify-center min-h-screen gap-20 bg-white">
        {/* Illustration on the Left */}
        <div className="w-1/2 flex justify-end">
          <Image
            src="/Untitled design (11) 1.png"
            alt="Teacher and Student"
            width={400}
            height={400}
          />
        </div>

        {/* Buttons on the Right */}
        <div className="w-1/2 flex flex-col items-start gap-4">
          <button
            onClick={() => router.push("/login/student")}
            className="bg-[#ED6C43] text-white px-6 py-3 rounded-full w-60 hover:opacity-80 transition duration-300"
          >
            Sign in as Student
          </button>
          <button
            onClick={() => router.push("/login/tutor")}
            className="bg-[#5577D1] text-white px-6 py-3 rounded-full w-60 hover:opacity-80 transition duration-300"
          >
            Sign in as Tutor
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
}
