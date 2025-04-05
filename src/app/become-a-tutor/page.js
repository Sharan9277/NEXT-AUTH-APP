"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Book, Calendar, Users } from 'lucide-react';
import StudentReviews from '@/components/StudentReviews';

export default function BecomeTutor() {
    const [currentImage, setCurrentImage] = useState(0);
    const [transition, setTransition] = useState(true);
  const tutorImages = [
    "/Background-1.png",
    "/Background-2.png",
    "/Background-3.png",
    "/Background-4.png",
  ];

  const imagesToShow = [...tutorImages, ...tutorImages]; // Duplicate for looping

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => prev + 1);
      setTransition(true);
    }, 0);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentImage === tutorImages.length) {
      const timeout = setTimeout(() => {
        setTransition(false);
        setCurrentImage(0);
      }, 500); // match transition duration

      return () => clearTimeout(timeout);
    }
  }, [currentImage]);
  
  const duplicatedImages = [...tutorImages, ...tutorImages]; // Duplicate to create loop



  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", 
    "English", "History", "Computer Science", "Languages", 
    "Music", "Art"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      
      <main className="flex-grow">
        {/* 1. Heading with Image Carousel */}
        <h1 className="text-[28px] md:text-[68px] font-inter text-at-bg  font-bold text-center py-10 md:mx-[500px] leading-none">
          Brilliant tutors who bring every subject to life.
          </h1>
        <section className="relative overflow-hidden pb-16">

          
          <div className="w-full overflow-hidden">
            <div className="flex animate-scroll w-max">
                {duplicatedImages.map((img, index) => (
                <div
                    key={index}
                    className="min-w-[419px] h-[419px] shrink-0"
                >
                    <img
                    src={img}
                    alt={`Tutor ${index + 1}`}
                    className="w-full h-full object-cover"
                    />
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* 2. Two Column Section with Metrics */}
        <section className="py-16 px-6 md:px-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-[30px] md:text-[48px] text-center md:text-left font-medium mb-2 leading-[60px]">Tracking Progress and Milestones</h2>
              <p className="text-lg text-gray-700 text-center md:text-left">
                Effective progress tracking and milestone setting are critical components of...
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <p className="text-[48px] font-medium text-gray-800 text-center">22+</p>
                <p className=" text-gray-600 text-center">Years of Experience</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <p className="text-[48px] font-medium text-gray-800 text-center">700+</p>
                <p className=" text-gray-600 text-center">Total Courses</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <p className="text-[48px] font-medium text-gray-800 text-center">1K+</p>
                <p className=" text-gray-600 text-center">Satisfied Customer</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <p className="text-[48px] font-medium text-gray-800 text-center">100+</p>
                <p className=" text-gray-600 text-center">Certificates and Awards</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Box with Two Rows & Buttons */}
        <section className="rounded-xl py-12 px-6 md:px-6 md:w-7xl max-w-7xl mx-auto bg-at-light-orange">
          <div className=" p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:items-center ">
              <h3 className=" font-semibold font-inter text-[58px] leading-none text-at-blue-again text-center md:text-left md:mr-20 ">Specialists across every subject and at every level.</h3>
              <p className="text-sm text-gray-700 text-center md:text-left ml-0 md:ml-[200px]">
              Our tutors cover 300 subjects at every stage and exam level from Primary to A-level and beyond. They all have at least two years’ experience and know how to deliver online lessons that connect with and inspire students.
              </p>
            </div>
            
            <hr className="border-gray-300 my-6" />
            

            <div className="md:w-1/2 justify-center md:justify-start flex flex-wrap gap-2 md:gap-4">
            {subjects.map((subject) => (
                <div key={subject}>
                    <button 
                    className="bg-blue-500 text-white font-medium py-5 px-4 rounded-full text-center hover:bg-blue-600 transition-colors"
                    >
                    {subject}
                    </button>
                </div>
                ))}

            </div>
            </div>
        </section>

        {/* 4. Heading and Description */}
        <section className="pt-16 px-6 md:px-10 max-w-6xl mx-auto text-center">
          <h2 className="font-inter font-medium md:mx-2xl mx-xl  leading-none md:text-[58px] text-[38px] font-bold mb-6">Individual skills to support each student's needs.</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          As well as subject knowledge, every one of our 30k+ tutors will have individual skills or experience to help you to meet a certain need, unlock a particular exam paper, or understand a specific school or university entry requirement.
          </p>
        </section>

        {/* 5. Reviews Component Placeholder */}
        <section className="py-12 px-6 md:px-10 max-w-7xl mx-auto">
          <StudentReviews />
        </section>

        {/* 6. Colored Section with Two Rows */}
        <section className="py-8 md:py-16 px-4 md:px-6 lg:px-10 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12 lg:mb-16 md:items-center">
            <h3 className="font-medium font-inter text-3xl sm:text-4xl lg:text-5xl xl:text-[58px] leading-tight lg:leading-none text-at-blue-again text-center md:text-left">Only the best, background-checked tutors.</h3>
            <p className="text-sm md:text-base text-gray-700 text-center md:text-left md:ml-0 lg:ml-6 xl:ml-12 max-w-lg mx-auto md:mx-0">
              Our tutors cover 300 subjects at every stage and exam level from Primary to A-level and beyond. They all have at least two years' experience and know how to deliver online lessons that connect with and inspire students.
            </p>
          </div>
          
          {/* Icons section */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-16 mt-4">
            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="bg-[#E4CBFC] p-10 sm:p-12 md:p-16 lg:p-20 rounded-[30px] md:rounded-[50px] flex items-center justify-center mb-4">
                <Users size={40} className="text-white" />
              </div>
              <p className="text-sm md:text-base text-gray-600">Sign up and showcase your expertise, experience, and teaching style.</p>
            </div>
            
            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="bg-at-blue-again p-10 sm:p-12 md:p-16 lg:p-20 rounded-[30px] md:rounded-[50px] flex items-center justify-center mb-4">
                <Users size={40} className="text-white" />
              </div>
              <p className="text-sm md:text-base text-gray-600">Sign up and showcase your expertise, experience, and teaching style.</p>
            </div>

            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="bg-at-button-light p-10 sm:p-12 md:p-16 lg:p-20 rounded-[30px] md:rounded-[50px] flex items-center justify-center mb-4">
                <Users size={40} className="text-white" />
              </div>
              <p className="text-sm md:text-base text-gray-600">Sign up and showcase your expertise, experience, and teaching style.</p>
            </div>
          </div>
        </div>
      </section>

        {/* 7. Section with Background Image */}
        <section 
        className="relative py-16 px-6 md:px-10 bg-contain bg-no-repeat bg-center min-h-[800px]" 
        style={{ backgroundImage: "url('/Container (1).png')" }}
        >
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center"> 
            <div className="max-w-5xl pt-8 text-center">
            <h2 className="text-3xl md:text-[68px] font-inter font-medium leading-none mb-4 text-at-blue-again">
                Ready to Transform Lives Through Education?
            </h2>
            <p className="text-lg text-black mb-8">
                Take the first step in your tutoring journey. Join our platform today and start making a difference.
            </p>
            <Link href="/signup/tutor">
            <button className="mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center">
                Become A Tutor
                <ArrowRight className="ml-2" size={20} />
            </button>
            </Link>
            </div>
        </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}