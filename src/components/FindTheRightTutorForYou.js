'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const tutors = [
  {
    id: 1,
    name: 'John Doe',
    title: 'Mathematics Expert',
    quote: 'Teaching is the art of assisting discovery.',
    images: ['/Bree-975f02dc03b8de3fd69f2b5f28437893.jpg.png', '/Bree-975f02dc03b8de3fd69f2b5f28437893.jpg.png', '/Bree-975f02dc03b8de3fd69f2b5f28437893.jpg.png'],
  },
  {
    id: 2,
    name: 'Jane Smith',
    title: 'Physics Specialist',
    quote: 'Education is life itself.',
    images: ['/Bree-975f02dc03b8de3fd69f2b5f28437893.jpg.png', '/Bree-975f02dc03b8de3fd69f2b5f28437893.jpg.png', '/Bree-975f02dc03b8de3fd69f2b5f28437893.jpg.png'],
  },
];

export default function FindTheRightTutorForYou() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? tutors.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev === tutors.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative min-h-screen flex flex-col bg-white">
  <header className="w-full flex flex-col items-center justify-start text-center text-[#121117] font-inter px-6 py-6">
    {/* Heading */}
    <div className="w-full max-w-6xl text-[42px] md:text-[64px] lg:text-[81.8px] font-black leading-tight">
      Find the right tutor for you.
    </div>
    {/* Description */}
    <div className="w-full max-w-3xl text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed mt-4">
      With over 30,000 tutors and 1M+ learners, we know language learning.
    </div>
  </header>

  {/* Main Content */}
  <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 pt- md:pt- lg:pt- overflow-hidden">
    {/* Navigation Icons Wrapper */}
    <div className="absolute inset-0 flex justify-between items-center px-2 md:px-6 lg:px-10 pointer-events-none">
      <button onClick={prevSlide} className="p-3 md:p-5 text-black bg-white pointer-events-auto">
        <ChevronLeft size={36} />
      </button>
      <button onClick={nextSlide} className="p-3 md:p-5 text-black bg-white pointer-events-auto">
        <ChevronRight size={36} />
      </button>
    </div>

    {/* Slider Container */}
    <div className="flex flex-col lg:flex-row w-full rounded-lg overflow-hidden p-6 md:p-6 space-y-8 lg:space-y-0">
      {/* Image Column */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center"
        >
          {tutors[currentIndex].images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Tutor"
              className={`absolute rounded-lg shadow-lg transition-all duration-500 ${
                index === 0 ? 'invisible md:invisible lg:visible w-1/3 top-25 left-2' : index === 1 ? 'invisible md:invisible lg:visible w-1/2 top-25 left-10' : 'w-3/4'
              }`}
            />
          ))}
          {/* Name & Title Badges */}
          <div className="absolute bottom-20 right-[40px] md:right-[65px] flex gap-2 items-start">
            <div className="bg-white p-3 text-[10px] md:text-sm rounded shadow-md font-inter text-black">
              {tutors[currentIndex].name}
            </div>
            <div className="bg-at-button-light p-3 text-[10px] md:text-sm rounded shadow-md font-inter text-white">
              {tutors[currentIndex].title}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Text Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 text-center lg:text-left">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[30px] md:text-[35px] font-bold font-inter text-gray-700"
        >
          "{tutors[currentIndex].quote}"
        </motion.p>
        <p className="mt-6 text-2xl md:text-3xl font-semibold text-black">{tutors[currentIndex].name}</p>
        <p className="text-lg md:text-xl text-black">{tutors[currentIndex].title}</p>
        {/* Pagination */}
        <div className="flex justify-center lg:justify-start mt-8 space-x-4">
          {tutors.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
                index === currentIndex ? 'bg-at-button-light rounded-md' : 'bg-gray-300'
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
