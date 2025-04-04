"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TutorCard from "@/components/TutorCard";
import TutorsByQues from "@/components/tutorsbyques";
import Navbar from "@/components/Navbar";
import Select from "react-select";

const subjectOptions = [
  { value: '', label: 'Select Subject' },
  { value: 'Math', label: 'Math' },
  { value: 'Science', label: 'Science' },
];

const rateOptions = [
  { value: '', label: 'Price per lesson' },
  { value: '2', label: '€2+' },
  { value: '10', label: '€10+' },
];

const countryOptions = [
  { value: '', label: 'Country of birth' },
  { value: 'USA', label: 'USA' },
  { value: 'India', label: 'India' },
];

const availabilityOptions = [
  { value: '', label: "I'm available" },
  { value: 'Any time', label: 'Any time' },
  { value: 'Monday', label: 'Monday' },
];

export default function FindTutors() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <FindTutorsContent />
      </Suspense>
    </div>
  );
}

function FindTutorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL
  const [filters, setFilters] = useState({
    subject: searchParams.get("subject") || "",
    minRate: searchParams.get("minRate") || "",
    maxRate: searchParams.get("maxRate") || "",
    country: searchParams.get("country") || "",
    availability: searchParams.get("availability") || "",
    specialties: searchParams.getAll("specialties") || [],
    languages: searchParams.getAll("languages") || [],
    sortBy: searchParams.get("sortBy") || "",
    search: searchParams.get("search") || "",
  });

  const [tutors, setTutors] = useState([]);

  // Update URL and fetch tutors whenever filters change
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else if (value) {
            params.append(key, value);
          }
        });

        const res = await fetch(`/api/tutors/find-tutors?${params.toString()}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

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
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // For multi-select values (specialties, languages)
    if (e.target.multiple) {
      const options = Array.from(e.target.selectedOptions, (option) => option.value);
      setFilters((prev) => ({ ...prev, [name]: options }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="container mx-auto bg-white px-4 md:px-8 lg:px-16 flex flex-col items-center">
      <TutorsByQues className="mb-12 border-b border-gray-300" />

      {/* Filters Section */}
      <div id="tutors-section" className="w-full max-w-7xl p-4 mb-6">
        {/* First row: filters - stack on mobile, grid on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Subject Dropdown */}
          <Select
            name="subject"
            options={subjectOptions}
            value={subjectOptions.find(option => option.value === filters.subject)}
            onChange={(selectedOption) => handleFilterChange({ target: { name: 'subject', value: selectedOption.value } })}
            className="w-full text-black"
            classNamePrefix="react-select"
          />

          {/* Price per lesson Dropdown */}
          <Select
            name="minRate"
            options={rateOptions}
            value={rateOptions.find(option => option.value === filters.minRate)}
            onChange={(selectedOption) => handleFilterChange({ target: { name: 'minRate', value: selectedOption.value } })}
            className="w-full text-black"
            classNamePrefix="react-select"
          />

          {/* Country of Birth Dropdown */}
          <Select
            name="country"
            options={countryOptions}
            value={countryOptions.find(option => option.value === filters.country)}
            onChange={(selectedOption) => handleFilterChange({ target: { name: 'country', value: selectedOption.value } })}
            className="w-full text-black"
            classNamePrefix="react-select"
          />

          {/* Availability Dropdown */}
          <Select
            name="availability"
            options={availabilityOptions}
            value={availabilityOptions.find(option => option.value === filters.availability)}
            onChange={(selectedOption) => handleFilterChange({ target: { name: 'availability', value: selectedOption.value } })}
            className="w-full text-black"
            classNamePrefix="react-select"
          />
        </div>

        {/* Second row: more filters and search - stack on mobile, grid on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Specialties Multi-select */}
          <div className="relative">
            <Select
              isMulti
              name="specialities"
              options={[
                { value: 'Maths', label: 'Maths' },
                { value: 'English', label: 'English' },
                // Add more options
              ]}
              value={filters.specialties.map((specialty) => ({ value: specialty, label: specialty }))}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map((option) => option.value);
                setFilters((prev) => ({ ...prev, specialties: selectedValues }));
              }}
              className="w-full text-black"
            />
          </div>

          {/* Languages Multi-select */}
          <div className="relative">
            <Select
              isMulti
              name="languages"
              options={[
                { value: 'English', label: 'English' },
                { value: 'Spanish', label: 'Spanish' },
                // Add more options
              ]}
              value={filters.languages.map((language) => ({ value: language, label: language }))}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map((option) => option.value);
                setFilters((prev) => ({ ...prev, languages: selectedValues }));
              }}
              className="w-full text-black"
            />
          </div>

          {/* This div creates space in desktop layout */}
          <div className="hidden lg:block"></div>

          {/* Sort and Search - takes full width on mobile */}
          <div className="flex flex-col sm:flex-row gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
            <select 
              name="sortBy" 
              value={filters.sortBy} 
              onChange={handleFilterChange} 
              className="p-3 border rounded w-full mb-2 sm:mb-0"
            >
              <option value="">Sort by: Our top picks</option>
              <option value="priceLow">Price Low to High</option>
              <option value="priceHigh">Price High to Low</option>
            </select>
            <input
              type="text"
              name="search"
              placeholder="Search"
              value={filters.search}
              onChange={handleFilterChange}
              className="p-3 border rounded w-full text-black"
            />
          </div>
        </div>
      </div>

      {/* Tutors List */}
      <div className="w-full max-w-7xl">
        {tutors.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No tutors available at the moment.</p>
        ) : (
          <div className="w-full">
            {tutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}