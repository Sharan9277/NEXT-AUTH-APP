// app/tutor-profile-setup/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TutorNavbar from "@/components/TutorNavbar";

const steps = [
  { id: 1, name: "About", description: "Basic personal information and contact details." },
  { id: 2, name: "Photo", description: "Upload a professional profile picture that represents you well." },
  { id: 3, name: "Certification", description: "Share your qualifications and professional certifications." },
  { id: 4, name: "Description", description: "Tell students about your teaching style and experience." },
  { id: 5, name: "Pricing", description: "Define your hourly and monthly teaching rates." },
];

export default function TutorProfileSetup() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  
  
  // Form data state
  const [formData, setFormData] = useState({
    // About
    firstName: "",
    lastName: "",
    country: "",
    subject: "",
    languages: [],
    phone: "",
    // Photo
    profileImage: null,
    // Certification
    qualifications: [],
    resume: null,
    // Description
    bio: "",
    about_me: "",
    // Pricing
    hourly_rate: "",
    monthly_rate: "",
  });

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    if (queryEmail) {
      setEmail(queryEmail);
      fetchUserData(queryEmail);
    } else {
      notFound();
    }
  }, [searchParams]);

  const fetchUserData = async (email) => {
    try {
      const res = await fetch("/api/get-user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (res.ok) {
        // Pre-fill any existing data
        if (data.tutor) {
          setFormData(prevData => ({
            ...prevData,
            firstName: data.tutor.name ? data.tutor.name.split(" ")[0] : "",
            lastName: data.tutor.name ? data.tutor.name.split(" ").slice(1).join(" ") : "",
            phone: data.tutor.phone || "",
            // Add other fields as needed
          }));
        }
      } else {
        setError(data.message || "Failed to fetch user data");
      }
    } catch (err) {
      setError("Error fetching user data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentStep = () => {
    const errors = {};
    
    switch (currentStep) {
      case 1: // About
        if (!formData.firstName.trim()) errors.firstName = "First name is required";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required";
        if (!formData.country) errors.country = "Country is required";
        if (!formData.subject) errors.subject = "Subject is required";
        if (!formData.phone.trim()) errors.phone = "Phone number is required";
        if (formData.languages.length === 0) errors.languages = "At least one language is required";
        break;
      case 2: // Photo
        if (!formData.profileImage) errors.profileImage = "Profile image is required";
        break;
      case 3: // Certification
        if (formData.qualifications.length === 0 || !formData.qualifications[0]) 
          errors.qualifications = "Qualifications are required";
        if (!formData.resume) errors.resume = "Resume is required";
        break;
      case 4: // Description
        if (!formData.bio.trim()) errors.bio = "Bio is required";
        if (!formData.about_me.trim()) errors.about_me = "About me is required";
        break;
      case 5: // Pricing
        if (!formData.hourly_rate) errors.hourly_rate = "Hourly rate is required";
        if (!formData.monthly_rate) errors.monthly_rate = "Monthly rate is required";
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    const isValid = validateCurrentStep();
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = {...prev};
        delete updated[name];
        return updated;
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prevData => ({
        ...prevData,
        [name]: files[0],
      }));
      
      // Clear validation error
      if (validationErrors[name]) {
        setValidationErrors(prev => {
          const updated = {...prev};
          delete updated[name];
          return updated;
        });
      }
    }
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    const selectLevel = e.target.parentNode.querySelector('select:nth-child(2)');
    const level = selectLevel ? selectLevel.value : "";
    
    if (language && level) {
      // Find if the language already exists
      const existingLangIndex = formData.languages.findIndex(lang => lang.name === language);
      
      if (existingLangIndex >= 0) {
        // Update existing language
        const updatedLanguages = [...formData.languages];
        updatedLanguages[existingLangIndex] = { name: language, level };
        setFormData(prevData => ({
          ...prevData,
          languages: updatedLanguages,
        }));
      } else {
        // Add new language
        setFormData(prevData => ({
          ...prevData,
          languages: [...prevData.languages, { name: language, level }],
        }));
      }
      
      // Clear validation error
      if (validationErrors.languages) {
        setValidationErrors(prev => {
          const updated = {...prev};
          delete updated.languages;
          return updated;
        });
      }
    }
  };

  const handleLevelChange = (e) => {
    const level = e.target.value;
    const selectLanguage = e.target.parentNode.querySelector('select:first-child');
    const language = selectLanguage ? selectLanguage.value : "";
    
    if (language && level) {
      // Similar to handleLanguageChange
      const existingLangIndex = formData.languages.findIndex(lang => lang.name === language);
      
      if (existingLangIndex >= 0) {
        const updatedLanguages = [...formData.languages];
        updatedLanguages[existingLangIndex] = { name: language, level };
        setFormData(prevData => ({
          ...prevData,
          languages: updatedLanguages,
        }));
      } else {
        setFormData(prevData => ({
          ...prevData,
          languages: [...prevData.languages, { name: language, level }],
        }));
      }
      
      if (validationErrors.languages) {
        setValidationErrors(prev => {
          const updated = {...prev};
          delete updated.languages;
          return updated;
        });
      }
    }
  };

  const handleAddLanguage = () => {
    // This will be handled through UI
  };

  const handleSubmit = async () => {
    const isValid = validateCurrentStep();
    
    if (!isValid) {
      return;
    }
    
    setLoading(true);
    
    // Create FormData object for file uploads
    const submitData = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'profileImage' || key === 'resume') {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      } else if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
        submitData.append(key, JSON.stringify(formData[key]));
      } else if (Array.isArray(formData[key])) {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, formData[key]);
      }
    });
    
    // Add email for identification
    submitData.append('email', email);
    
    try {
      const res = await fetch("/api/tutors/update-profile", {
        method: "POST",
        body: submitData,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Redirect to a success page
        router.push("/tutor-profile-pending");
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Error updating profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Left side info boxes for each step
  const getStepInfo = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    
    // Tips and information for each step
    const stepInfoContent = {
      1: {
        title: "About You",
        tips: [
          "Your profile name will be visible to students.",
          "Adding languages you speak helps connect with international students.",
          "A verified phone number increases trust with potential students."
        ]
      },
      2: {
        title: "Professional Image",
        tips: [
          "Use a high-quality, professional-looking photo.",
          "A clear face shot helps build trust with potential students.",
          "Smile and use good lighting for the best impression."
        ]
      },
      3: {
        title: "Your Credentials",
        tips: [
          "Include all relevant teaching certifications.",
          "List specialized training that relates to your subject.",
          "Your resume helps verify your expertise to students."
        ]
      },
      4: {
        title: "Your Teaching Profile",
        tips: [
          "Your bio appears in search results, keep it concise and impactful.",
          "In your detailed description, explain your teaching methodology.",
          "Share your passion for the subject and teaching experience."
        ]
      },
      5: {
        title: "Your Value",
        tips: [
          "Research market rates for your subject and expertise level.",
          "Consider offering package deals for monthly students.",
          "You can adjust your rates as you gain more experience and reviews."
        ]
      }
    };

    return (
      <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-blue-800 mb-2">{stepInfoContent[stepId].title}</h3>
        <p className="text-gray-600 mb-4">{step.description}</p>
        
        <h4 className="font-semibold text-blue-700 mb-2">Tips:</h4>
        <ul className="list-disc pl-5 space-y-2">
          {stepInfoContent[stepId].tips.map((tip, index) => (
            <li key={index} className="text-gray-700">{tip}</li>
          ))}
        </ul>
        
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="text-sm text-yellow-800">
            <span className="font-bold">Remember:</span> Complete profiles are 80% more likely to attract students!
          </p>
        </div>
      </div>
    );
  };

  // Step content components
  const AboutStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">About</h2>
      <p>Start creating your public tutor profile. Your progress will be automatically saved as you complete each section.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          />
          {validationErrors.firstName && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
          }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Last name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          />
          {validationErrors.lastName && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
          }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Country of birth *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${validationErrors.country ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          >
            <option value="">Choose country...</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
            {/* Add more countries as needed */}
          </select>
          {validationErrors.country && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.country}</p>
          }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject you teach *</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${validationErrors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          >
            <option value="">Choose subject...</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Computer Science">Computer Science</option>
            {/* Add more subjects as needed */}
          </select>
          {validationErrors.subject && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.subject}</p>
          }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Languages you speak *</label>
          <div className="flex space-x-2">
            <select
              className={`mt-1 block w-full border ${validationErrors.languages ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
              onChange={handleLanguageChange}
            >
              <option value="">Language...</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              {/* Add more languages as needed */}
            </select>
            
            <select
              className={`mt-1 block w-full border ${validationErrors.languages ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
              onChange={handleLevelChange}
            >
              <option value="">Level</option>
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Basic">Basic</option>
            </select>
          </div>
          {formData.languages.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700">Added languages:</h4>
              <ul className="ml-4 list-disc">
                {formData.languages.map((lang, index) => (
                  <li key={index} className="text-sm">
                    {lang.name} - {lang.level}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {validationErrors.languages && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.languages}</p>
          }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone number *</label>
          <div className="flex mt-1">
            <div className="w-20 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50">
              <span>+91</span>
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`block w-full border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-r-md shadow-sm p-2`}
              required
            />
          </div>
          {validationErrors.phone && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
          }
        </div>
      </div>
    </div>
  );

  const PhotoStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Photo</h2>
      <p>Upload your professional profile picture</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image *</label>
          <div className="mt-1 flex items-center">
            <span className="inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100">
              {formData.profileImage ? (
                <img 
                  src={URL.createObjectURL(formData.profileImage)} 
                  alt="Profile Preview" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </span>
            <input
              type="file"
              name="profileImage"
              onChange={handleFileChange}
              className={`ml-5 py-2 px-3 border ${validationErrors.profileImage ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50`}
              accept="image/*"
              required
            />
          </div>
          {validationErrors.profileImage && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.profileImage}</p>
          }
        </div>
      </div>
    </div>
  );

  const CertificationStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Certification</h2>
      <p>Upload your qualifications and resume</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Qualifications *</label>
          <textarea
            name="qualifications"
            value={formData.qualifications.join(", ")}
            onChange={(e) => {
              setFormData({...formData, qualifications: e.target.value.split(", ")});
              if (validationErrors.qualifications && e.target.value.trim()) {
                setValidationErrors(prev => {
                  const updated = {...prev};
                  delete updated.qualifications;
                  return updated;
                });
              }
            }}
            className={`mt-1 block w-full border ${validationErrors.qualifications ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            placeholder="Enter your qualifications separated by commas"
            rows="3"
            required
          />
          {validationErrors.qualifications && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.qualifications}</p>
          }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Resume/CV *</label>
          <input
            type="file"
            name="resume"
            onChange={handleFileChange}
            className={`mt-1 py-2 px-3 border ${validationErrors.resume ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50`}
            accept=".pdf,.doc,.docx"
            required
          />
          {validationErrors.resume && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.resume}</p>
          }
        </div>
      </div>
    </div>
  );

  const DescriptionStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Description</h2>
      <p>Tell students about yourself</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio (short introduction) *</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${validationErrors.bio ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            placeholder="A brief introduction about yourself (100-150 characters)"
            rows="2"
            maxLength="150"
            required
          />
          {validationErrors.bio && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.bio}</p>
          }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">About Me (detailed description) *</label>
          <textarea
            name="about_me"
            value={formData.about_me}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${validationErrors.about_me ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            placeholder="Provide a detailed description about your teaching experience, methodology, and what students can expect when learning with you."
            rows="6"
            required
          />
          {validationErrors.about_me && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.about_me}</p>
          }
        </div>
      </div>
    </div>
  );

  const PricingStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pricing</h2>
      <p>Set your hourly and monthly rates</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Hourly Rate ($) *</label>
          <input
            type="number"
            name="hourly_rate"
            value={formData.hourly_rate}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${validationErrors.hourly_rate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            min="0"
            step="0.01"
            required
          />
          {validationErrors.hourly_rate && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.hourly_rate}</p>
          }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Rate ($) *</label>
          <input
            type="number"
            name="monthly_rate"
            value={formData.monthly_rate}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${validationErrors.monthly_rate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            min="0"
            step="0.01"
            required
          />
          {validationErrors.monthly_rate && 
            <p className="mt-1 text-sm text-red-600">{validationErrors.monthly_rate}</p>
          }
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AboutStep />;
      case 2:
        return <PhotoStep />;
      case 3:
        return <CertificationStep />;
      case 4:
        return <DescriptionStep />;
      case 5:
        return <PricingStep />;
      default:
        return <AboutStep />;
    }
  };

  return (
    <>
      <TutorNavbar />
      <div className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Progress indicator */}
          <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">Tutor Profile Setup</h1>
              <div className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}: {steps.find(s => s.id === currentStep).name}
              </div>
            </div>
            
            <div className="mt-4 relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div 
                  style={{ width: `${(currentStep / steps.length) * 100}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          </div>
          
          {/* Two-column layout */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column - Info */}
            <div className="md:w-1/3">
              {getStepInfo(currentStep)}
              
              {/* Support box */}
              <div className="bg-white shadow-sm rounded-lg p-4 mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If you have any questions about setting up your profile, our support team is here to help.
                </p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
                  Contact Support
                </a>
              </div>
            </div>
            
            {/* Right column - Form */}
            <div className="md:w-2/3">
              <div className="bg-white shadow-sm rounded-lg p-6">
                {error && (
                  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}
                
                {renderStepContent()}
                
                {/* Navigation */}
                <div className="mt-8 flex justify-between border-t pt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className={`${currentStep === 1 ? 'invisible' : ''} bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-50`}
                  >
                    Previous
                  </button>
                  
                  {currentStep === steps.length ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-blue-600 text-white rounded-md py-2 px-6 hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Profile"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-blue-600 text-white rounded-md py-2 px-6 hover:bg-blue-700"
                        >
                        Continue
                        </button>
                    )}
                    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}