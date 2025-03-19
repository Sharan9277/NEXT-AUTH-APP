"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Testimonial data
const testimonials = [
  {
    id: "27913489XXX",
    date: "Oct 2, 2024",
    text: "As a first-time user, I was impressed! This assignment writing service really understands what students need. My assignment writing was on point and delivered before the ...",
    topic: "Sustainable Rainwater Harvesting System for Urban Areas",
  },
  {
    id: "35127643XXX",
    date: "Oct 4, 2024",
    text: "This site saved my semester! English isn't my first language, so their assignment writing help was invaluable. I highly recommend their assignment writing services to any...",
    topic: "General academic support",
  },
  {
    id: "59318274XXX",
    date: "Oct 3, 2024",
    text: "I needed a pro to write my assignment. I am so thankful that this assignment writing service came through! They know how to help students under pressure, and my work turn...",
    topic: "Optimizing Pathfinding Algorithms for Autonomous Vehicle Navigation Systems",
  },
  {
    id: "62847593XXX",
    date: "Oct 5, 2024",
    text: "The quality of work exceeded my expectations. The writers are clearly experts in their fields and provided detailed, well-researched content for my assignment.",
    topic: "Machine Learning Applications in Healthcare",
  },
  {
    id: "71936284XXX",
    date: "Oct 1, 2024",
    text: "Fast turnaround and excellent communication throughout the process. I was kept updated on the progress of my assignment and received it ahead of schedule.",
    topic: "Renewable Energy Solutions for Developing Countries",
  },
]

// Number of testimonials to show per page
const TESTIMONIALS_PER_PAGE = 3

export default function TestimonialSection() {
  const [currentPage, setCurrentPage] = useState(0)

  // Calculate total number of pages
  const totalPages = Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE)

  // Get current testimonials to display
  const currentTestimonials = testimonials.slice(
    currentPage * TESTIMONIALS_PER_PAGE,
    (currentPage + 1) * TESTIMONIALS_PER_PAGE,
  )

  // Handle pagination
  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex)
  }

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#100803] mb-2">EVALUATION OF OUR WORK</h2>
          <p className="text-[#100803] text-lg">Here's what students say about DoMyAssignments.</p>
        </div>
        <button className="mt-4 md:mt-0 bg-[#100803] text-white px-6 py-3 rounded hover:bg-[#2a1e17] transition-colors">
          Check out all reviews
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {currentTestimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-2">
        <button onClick={prevPage} className="p-1 rounded-full hover:bg-gray-100" disabled={currentPage === 0}>
          <ChevronLeft className={`w-5 h-5 ${currentPage === 0 ? "text-gray-300" : "text-gray-600"}`} />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-2.5 h-2.5 rounded-full ${currentPage === index ? "bg-[#100803]" : "bg-[#dedede]"}`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}

          {/* Add extra pagination dots to match design (14 total) */}
          {Array.from({ length: Math.max(0, 14 - totalPages) }).map((_, index) => (
            <div key={`extra-${index}`} className="w-2.5 h-2.5 rounded-full bg-[#dedede]" />
          ))}
        </div>

        <button
          onClick={nextPage}
          className="p-1 rounded-full hover:bg-gray-100"
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRight className={`w-5 h-5 ${currentPage === totalPages - 1 ? "text-gray-300" : "text-gray-600"}`} />
        </button>
      </div>
    </section>
  )
}

// Testimonial Card Component
function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-4">
        <span className="text-[#f8b208] text-4xl font-serif">"</span>
      </div>

      <div className="mb-3 text-sm text-gray-500">
        <p>ID {testimonial.id}</p>
        <p>{testimonial.date}</p>
      </div>

      <p className="text-[#100803] mb-2 flex-grow">
        {testimonial.text}
        <button className="text-[#f8b208] font-medium ml-1 hover:underline">show more</button>
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-[#100803] font-medium">{testimonial.topic}</p>
      </div>
    </div>
  )
}

