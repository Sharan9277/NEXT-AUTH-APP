"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import TutorNavbar from "@/components/TutorNavbar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import TutorEmailSettings from "@/components/TutorEmailChange";
import ChangePassword from "@/components/TutorPasswordChange";

export default function TutorProfileSettings() {
  const { id } = useParams();
  const router = useRouter();

  // State for form data
  const [formData, setFormData] = useState({
    profile_image: "",
    name: "",
    phone: "",
    bio: "",
    about_me: "",
    qualifications: [],
    specialties: [],
    languages_spoken: [],
    country: "",
    subject_expertise: [],
    hourly_rate: 0,
    monthly_rate: 0,
  });

  // Fetch tutor data from API
  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const res = await fetch(`/api/tutors/${id}`);
        const data = await res.json();

        setFormData({
          profile_image: data.profile_image || "",
          name: data.name || "",
          phone: data.phone || "",
          bio: data.bio || "",
          about_me: data.about_me || "",
          qualifications: Array.isArray(data.qualifications) ? data.qualifications : [],
          specialties: Array.isArray(data.specialties) ? data.specialties : [],
          languages_spoken: Array.isArray(data.languages_spoken) ? data.languages_spoken : [],
          country: data.country || "",
          subject_expertise: Array.isArray(data.subject_expertise) ? data.subject_expertise : [],
          hourly_rate: data.hourly_rate ?? 0,
          monthly_rate: data.monthly_rate ?? 0,
        });
      } catch (error) {
        console.error("Error fetching tutor data:", error);
      }
    };

    fetchTutorData();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle array input change
  const handleArrayChange = (e, field) => {
    setFormData({ 
      ...formData, 
      [field]: e.target.value.split(",").map(item => item.trim()) 
    });
  };

  // Handle file upload (Profile Image)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({ ...formData, profile_image: reader.result });
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tutors/${id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        router.push(`/dashboard/tutor/${id}`);
      } else {
        console.error("Error updating profile:", await res.json());
      }
    } catch (error) {
      console.error("Error updating tutor profile:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#F1f1f1] min-h-screen">
      {/* Sidebar - hidden on mobile, visible on tablet/desktop */}
      <div className="hidden md:block bg-[#F1f1f1]">
        <Sidebar active="Profile Settings"/>
      </div>
      
      <div className="flex flex-col flex-grow">
        <TutorNavbar />
        <div className="p-3 md:p-6">
          <div className="max-w-7xl mx-auto rounded-lg relative">
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-white text-black shadow-lg rounded-lg p-4 md:p-6">
              {/* Basic Information - Updated UI */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-3/4">
                  <h1 className="text-xl md:text-2xl font-inter text-black font-bold text-left pb-4">Account Settings</h1>
                  
                  {/* Name field */}
                  <div className="mb-4 md:mb-6 font-inter text-sm md:text-base">
                    <label className="block font-semibold mb-2 font-inter">Full name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  {/* Phone Number field */}
                  <div className="mb-4 md:mb-6">
                    <label className="block font-semibold font-medium mb-2 font-inter text-sm md:text-base">Phone Number</label>
                    <div className="flex">
                      <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="Your Phone number..."
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Bio field - Short description */}
                  <div className="mb-4 md:mb-6">
                    <label className="block font-semibold font-medium mb-2 font-inter text-sm md:text-base">Bio</label>
                    <input 
                      type="text" 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleChange} 
                      className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Your title, profession or small biography"
                      maxLength="50"
                    />
                    <div className="text-right font-semibold text-gray-500 mt-1 text-xs md:text-sm">0/50</div>
                  </div>
                  
                  {/* About Me field - Longer text */}
                  <div className="mb-4 md:mb-6">
                    <label className="block font-semibold font-medium mb-2 font-inter text-sm md:text-base">About Me</label>
                    <textarea 
                      name="about_me" 
                      value={formData.about_me} 
                      onChange={handleChange} 
                      className="border border-gray-300 rounded-md p-2 w-full h-24 md:h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your title, profession or small biography"
                    />
                  </div>
                </div>
                
                {/* Profile Image Section */}
                <div className="w-full md:w-1/4">
                  <div className="bg-gray-50 p-4 rounded-lg w-full flex flex-col items-center">
                    <div className="relative group w-40 h-40 md:w-60 md:h-60 mb-4">
                      <Image
                        src={formData.profile_image || "/default-profile.png"}
                        fill
                        alt="Profile"
                        className="rounded-lg object-cover"
                      />
                      <label className="absolute font-inter text-sm bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer transform translate-y-full group-hover:translate-y-0">
                        Upload Photo
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleFileUpload} 
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Image size should be under 1MB and image ratio needs to be 1:1
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Details - Keeping original fields with updated UI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 font-inter text-sm md:text-base">
                <div>
                  <label className="block font-semibold font-medium mb-2">Qualifications</label>
                  <input
                    type="text"
                    name="qualifications"
                    value={Array.isArray(formData.qualifications) ? formData.qualifications.join(", ") : ""}
                    onChange={(e) => handleArrayChange(e, "qualifications")}
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Comma separated values"
                  />
                </div>
                <div>
                  <label className="block font-semibold font-medium mb-2">Specialties</label>
                  <input
                    type="text"
                    name="specialties"
                    value={Array.isArray(formData.specialties) ? formData.specialties.join(", ") : ""}
                    onChange={(e) => handleArrayChange(e, "specialties")}
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Comma separated values"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-inter text-sm md:text-base">
                <div>
                  <label className="block font-semibold font-medium mb-2">Languages Spoken</label>
                  <input
                    type="text"
                    name="languages_spoken"
                    value={Array.isArray(formData.languages_spoken) ? formData.languages_spoken.join(", ") : ""}
                    onChange={(e) => handleArrayChange(e, "languages_spoken")}
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Comma separated values"
                  />
                </div>
                <div>
                  <label className="block font-semibold font-medium mb-2">Country</label>
                  <input 
                    type="text" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              {/* Subject & Pricing */}
              <div className="font-inter text-sm md:text-base">
                <label className="block font-semibold font-medium mb-2">Subject Expertise</label>
                <input
                  type="text"
                  name="subject_expertise"
                  value={Array.isArray(formData.subject_expertise) ? formData.subject_expertise.join(", ") : ""}
                  onChange={(e) => handleArrayChange(e, "subject_expertise")}
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Comma separated values"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-inter text-sm md:text-base">
                <div>
                  <label className="block font-semibold font-medium mb-2">Hourly Rate</label>
                  <input 
                    type="number" 
                    name="hourly_rate" 
                    value={formData.hourly_rate} 
                    onChange={handleChange} 
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block font-semibold font-medium mb-2">Monthly Rate</label>
                  <input 
                    type="number" 
                    name="monthly_rate" 
                    value={formData.monthly_rate} 
                    onChange={handleChange} 
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              {/* Save Button */}
              <button 
                type="submit" 
                className="bg-[#FF6633] hover:bg-[#ff5522] text-white px-4 py-2 md:px-6 md:py-3 rounded-md font-medium w-full md:w-auto"
              >
                Save Changes
              </button>
            </form>
            
            {/* Password and Email settings - stack on mobile, side by side on desktop */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6">
              <div className="flex-1">
                <ChangePassword />
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <TutorEmailSettings />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}