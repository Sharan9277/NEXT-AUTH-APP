"use client";
import { useState, useEffect } from "react";
import TutorCard from "@/components/TutorCard";
import TutorsByQues from "@/components/tutorsbyques";
import Navbar from "@/components/Navbar";


export default function FindTutors() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch("/api/tutors");
        const data = await res.json();
        if (Array.isArray(data)) {
          setTutors(data);
        } else {
          console.error("Invalid tutor data format:", data);
          setTutors([]);
        }
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="container mx-auto bg-white lg:px-16 flex flex-col items-center">
        <TutorsByQues />

        {tutors.length === 0 ? (
          <p className="text-center text-gray-600">No tutors available at the moment.</p>
        ) : (
          <div className="mx-auto flex flex-col">
            {tutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

