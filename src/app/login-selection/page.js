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
      <div className="w-full h-[724px] relative bg-[#fff] overflow-hidden flex flex-col items-center justify-center p-[64px] box-border leading-[normal] tracking-[normal] lg:h-auto lg:px-[32px]">
        <section className="flex flex-col items-center justify-between max-w-[1200px] w-full lg:flex-row sm:flex-col sm:items-center">
          {/* Image (Hidden on small screens) */}
          <div className="flex-1 flex justify-start md:block hidden">
            <Image
              className="w-[565px] max-h-full object-cover"
              loading="lazy"
              width={565}
              height={565}
              alt=""
              src="/Untitled design (11) 1.png"
            />
          </div>
          {/* Buttons */}
          <div className="flex-1 flex flex-col items-center lg:items-center justify-center py-[20px] box-border gap-[20px] max-w-full sm:items-center">
            <button
              className="cursor-pointer border-[#ed6c43] border-solid border-[1px] py-[10px] px-[24px] bg-[#ed6c43] w-[300px] h-[60px] rounded-[500px] flex items-center justify-center hover:bg-[#d45229] hover:border-[#d45229] sm:w-[250px] sm:h-[50px]"
              onClick={() => router.push("/login/student")}
            >
              <div className="text-[20px] sm:text-[18px] font-semibold font-[Inter] text-[#fff]">
                Sign in as Student
              </div>
            </button>
            <button
              className="cursor-pointer border-[#5577d1] border-solid border-[1px] py-[10px] px-[24px] bg-[#5577d1] w-[300px] h-[60px] rounded-[500px] flex items-center justify-center hover:bg-[#6e91eb] hover:border-[#6e91eb] sm:w-[250px] sm:h-[50px]"
              onClick={() => router.push("/login/tutor")}
            >
              <div className="text-[20px] sm:text-[18px] font-semibold font-[Inter] text-[#fff]">
                Sign in as Tutor
              </div>
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
