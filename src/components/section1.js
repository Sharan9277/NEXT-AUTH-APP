'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';

const images = [
  { id: 1, src: '/untitled-400-x-530-px.png.png', alt: 'Large Image' },
  { id: 2, src: '/untitled-270-x-245-px.png.png', alt: 'Small Image 1' },
  { id: 3, src: '/untitled-400-x-530-px-1.png.png', alt: 'Small Image 2' },
];

export default function Section() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-8">
      {/* Left Column */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h2 className="text-[19px] md:text-[29px] font-bold text-gray-900">Lowest Prices for the Best Quality Assignments</h2>
        <p className="mt-4 text-gray-700 text-lg">
        We are offering the best assignment writing service in low prices. We provide high-quality, plagiarism and AI-free assistance across all subjects. From statistics assignment helpers to finance assignment experts, we cater to diverse academic needs. Our assignment writing service ensures timely delivery, affordable pricing, and expert guidance. Experience the easiest and most stress-free way to achieve academic success with our best assignment helpers
        today.
        </p>
        <button className="mt-6 px-6 py-3 bg-green-500 flex flex-row items-center justify-center gap-2 text-white rounded-lg text-lg shadow-md hover:bg-green-600">
          <FaWhatsapp size={30} />
          Contact Us
        </button>
      </div>

      {/* Right Column - Image Carousel */}
      <div className="w-full lg:w-1/2 relative">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center lg:flex-row lg:items-stretch gap-4"
        >
          {/* Large Image */}
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            width={500}
            height={500}
            className="rounded-lg shadow-lg w-full lg:w-[60%] h-auto lg:h-[500px] object-cover"
          />

          {/* Small Images - Only for Desktop */}
          <div className="hidden lg:flex flex-col justify-between w-[35%] gap-4">
            {images.filter((_, index) => index !== currentIndex).map((image) => (
              <Image
                key={image.id}
                src={image.src}
                alt={image.alt}
                width={200}
                height={250}
                className="rounded-lg shadow-md w-full h-[48%] object-cover cursor-pointer"
                onClick={() => setCurrentIndex(image.id - 1)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
