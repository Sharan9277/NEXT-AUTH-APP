"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Step icons for the left panel
const STEP_ICONS = {
  subject: "/Container.png",
  price: "/Container.png",
  country: "/Container.png",
  availability: "/Container.png",
  specialty: "/Container.png",
};

// Step titles and descriptions
const STEPS = {
  subject: {
    title: "What subject are you looking to learn?",
    description: "Select the main subject you want to be tutored in",
    options: [
      { value: "Math", label: "Math" },
      { value: "Science", label: "Science" },
      { value: "English", label: "English" },
      { value: "History", label: "History" },
      { value: "Programming", label: "Programming" },
    ],
  },
  price: {
    title: "What's your budget for tutoring?",
    description: "Select your preferred price range per hour",
    options: [
      { value: "2", label: "€2+" },
      { value: "10", label: "€10+" },
      { value: "20", label: "€20+" },
      { value: "30", label: "€30+" },
      { value: "50", label: "€50+" },
    ],
  },
  country: {
    title: "Do you have a preference for your tutor's country?",
    description: "Select a country if you have a preference",
    options: [
      { value: "USA", label: "USA" },
      { value: "India", label: "India" },
      { value: "UK", label: "UK" },
      { value: "Canada", label: "Canada" },
      { value: "Australia", label: "Australia" },
    ],
  },
  availability: {
    title: "When do you need your tutor to be available?",
    description: "Select your preferred availability",
    options: [
      { value: "Any time", label: "Any time" },
      { value: "Monday", label: "Monday" },
      { value: "Tuesday", label: "Tuesday" },
      { value: "Wednesday", label: "Wednesday" },
      { value: "Thursday", label: "Thursday" },
      { value: "Friday", label: "Friday" },
      { value: "Weekend", label: "Weekend" },
    ],
  },
  specialty: {
    title: "Any specific specialties you're looking for?",
    description: "Select specialties that matter to you",
    options: [
      { value: "Maths", label: "Maths" },
      { value: "English", label: "English" },
      { value: "Test Prep", label: "Test Prep" },
      { value: "Coding", label: "Coding" },
      { value: "Physics", label: "Physics" },
    ],
  },
};

export default function GetStartedFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    subject: "",
    minRate: "",
    country: "",
    availability: "",
    specialties: [],
  });

  // Get the current step key
  const stepKeys = Object.keys(STEPS);
  const currentStepKey = stepKeys[currentStep];
  const currentStepData = STEPS[currentStepKey];

  // Handle option selection
  const handleSelect = (value) => {
    let updatedSelections = { ...selections };
    
    // Special handling for specialties which is an array
    if (currentStepKey === "specialty") {
      // For simplicity, we're just storing one specialty in this flow
      updatedSelections.specialties = [value];
    } else if (currentStepKey === "price") {
      updatedSelections.minRate = value;
    } else {
      updatedSelections[currentStepKey] = value;
    }
    
    setSelections(updatedSelections);
  };

  // Handle navigation between steps
  const handleNext = () => {
    if (currentStep < stepKeys.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // On the last step, redirect to find-tutors with parameters
      const params = new URLSearchParams();
      if (selections.subject) params.append("subject", selections.subject);
      if (selections.minRate) params.append("minRate", selections.minRate);
      if (selections.country) params.append("country", selections.country);
      if (selections.availability) params.append("availability", selections.availability);
      selections.specialties.forEach(specialty => {
        params.append("specialties", specialty);
      });
      
      router.push(`/find-tutors?${params.toString()}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/"); // Go to home if on first step and back is pressed
    }
  };

  // Check if current step has a selection (for enabling Next button)
  const hasSelection = () => {
    if (currentStepKey === "specialty") {
      return selections.specialties.length > 0;
    }
    return !!selections[currentStepKey === "price" ? "minRate" : currentStepKey];
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Top/Left Panel - Colored background with icon */}
      <div className="w-full md:w-1/2 bg-at-light-orange flex flex-col items-center justify-center text-white p-6 md:px-8 md:py-0 md:min-h-screen">
        <div className="mb-4 md:mb-8">
          {STEP_ICONS[currentStepKey] && (
            <div className="w-24 h-24 md:w-40 md:h-40 relative">
              <Image 
                src={STEP_ICONS[currentStepKey]}
                alt={`${currentStepKey} icon`}
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
        </div>
        {/* Display progress indicator on mobile */}
        <div className="flex space-x-2 md:hidden mt-2">
          {stepKeys.map((step, index) => (
            <div 
              key={step}
              className={`h-2 w-8 rounded-full ${
                index === currentStep ? 'bg-white' : 'bg-white bg-opacity-30'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom/Right Panel - White background with question and options */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-6 md:px-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-gray-800">{currentStepData.title}</h1>
        <p className="text-gray-600 mb-6">{currentStepData.description}</p>
        
        <div className="grid grid-cols-1 gap-3 md:gap-4 mb-8 md:mb-12">
          {currentStepData.options.map((option) => (
            <button
              key={option.value}
              className={`p-3 md:p-4 rounded-lg text-left border-2 text-black ${
                selections[currentStepKey === "price" ? "minRate" : currentStepKey] === option.value || 
                (currentStepKey === "specialty" && selections.specialties.includes(option.value))
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <span className="text-base md:text-lg font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            className="px-4 md:px-6 py-2 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-100 text-black"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg ${
              hasSelection()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleNext}
            disabled={!hasSelection()}
          >
            {currentStep < stepKeys.length - 1 ? "Next" : "Find Tutors"}
          </button>
        </div>
      </div>
    </div>
  );
}