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
    <div className="w-full h-[724px] relative bg-[#fff] overflow-hidden shrink-0 flex flex-col items-center justify-center p-[64px] box-border leading-[normal] tracking-[normal] lg:h-auto lg:pl-[32px] lg:pr-[32px] lg:box-border">
      <section className="flex flex-row items-center justify-center gap-[195px] max-w-full lg:gap-[97px] lg:flex-wrap mq750:gap-[49px] mq450:gap-[24px]">
        <Image
          className="w-[565px] relative max-h-full object-cover max-w-full lg:flex-1"
          loading="lazy"
          width={565}
          height={565}
          alt=""
          src="/Untitled design (11) 1.png"
        />
        <div className="flex flex-col items-start justify-start py-[20px] px-[0px] box-border gap-[25px] max-w-full lg:flex-1 mq750:min-w-full">
          <button
            className="cursor-pointer border-[#ed6c43] border-solid border-[1px] py-[12px] px-[32px] bg-[#ed6c43] w-[449px] h-[84px] rounded-[500px] box-border flex flex-row items-center justify-center hover:bg-[#d45229] hover:border-[#d45229] hover:border-solid hover:hover:border-[1px] hover:box-border"
            onClick={() => router.push("/login/student")}
          >
            <div className="relative text-[24px] leading-[150%] font-semibold font-[Inter] text-[#fff] text-left">
              Sign in as Student
            </div>
          </button>
          <button
            className="cursor-pointer border-[#5577d1] border-solid border-[1px] py-[12px] px-[32px] bg-[#5577d1] w-[449px] h-[84px] rounded-[500px] box-border flex flex-row items-center justify-center hover:bg-[#6e91eb] hover:border-[#6e91eb] hover:border-solid hover:hover:border-[1px] hover:box-border"
            onClick={() => router.push("/login/tutor")}
          >
            <div className="relative text-[24px] leading-[150%] font-semibold font-[Inter] text-[#fff] text-left">
              Sign in as Tutor
            </div>
          </button>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};
