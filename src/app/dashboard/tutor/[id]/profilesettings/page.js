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

  // ✅ State for form data
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

  // ✅ Fetch tutor data from API
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

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle file upload (Profile Image)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({ ...formData, profile_image: reader.result });
    };
  };

  // ✅ Handle form submission
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
    <div className="flex flex-row bg-[#F1f1f1] h-full">
      <Sidebar active="Profile Settings"/>
      <div className="flex flex-col flex-grow">
        <TutorNavbar />
        <div className="p-6">
        <div className="max-w-7xl mx-auto  rounded-lg relative">
  {/* Profile Image Upload - Positioned Properly */}


  <h1 className="text-[24px] font-inter text-black font-bold text-left pb-6">Account Settings</h1>
  <form onSubmit={handleSubmit} className="space-y-6 bg-white text-black shadow-lg rounded-lg p-6">
    
    {/* Basic Information */}
    <div className="grid grid-cols-3 gap-4 items-center">
      <div>
        <label className="block font-semibold">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full rounded" />
      </div>
      <div>
        <label className="block font-semibold">Phone Number</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="border p-2 w-full rounded" />
      </div>
      <div className="flex flex-col items-center">
      <div className="relative group w-28 h-28">
      <Image
        src={formData.profile_image || "/default-profile.png"}
        width={112}
        height={112}
        alt="Tutor Profile"
        className="rounded-lg border shadow-md object-cover w-full h-full"
      />
      <label className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center text-sm py-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        Change Image
        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "profile_image")} />
      </label>
    </div>
  </div>
    </div>

    {/* Bio & About Me */}
    <div>
      <label className="block font-semibold">Bio</label>
      <textarea name="bio" value={formData.bio} onChange={handleChange} className="border p-2 w-full rounded" />
    </div>

    <div>
      <label className="block font-semibold">About Me</label>
      <textarea name="about_me" value={formData.about_me} onChange={handleChange} className="border p-2 w-full rounded" />
    </div>

    {/* Professional Details */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block font-semibold">Qualifications</label>
        <input
        type="text"
        name="qualifications"
        value={Array.isArray(formData.qualifications) ? formData.qualifications.join(", ") : ""}
        onChange={(e) => setFormData({ ...formData, qualifications: e.target.value.split(",").map(item => item.trim()) })}
        className="border p-2 w-full rounded"
        placeholder="Comma separated values"
      />
      </div>
      <div>
        <label className="block font-semibold">Specialties</label>
        <input
        type="text"
        name="specialties"
        value={Array.isArray(formData.specialties) ? formData.specialties.join(", ") : ""}
        onChange={(e) => setFormData({ ...formData, specialties: e.target.value.split(",").map(item => item.trim()) })}
        className="border p-2 w-full rounded"
        placeholder="Comma separated values"
      />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block font-semibold">Languages Spoken</label>
        <input
        type="text"
        name="languages_spoken"
        value={Array.isArray(formData.languages_spoken) ? formData.languages_spoken.join(", ") : ""}
        onChange={(e) => setFormData({ ...formData, languages_spoken: e.target.value.split(",").map(item => item.trim()) })}
        className="border p-2 w-full rounded"
        placeholder="Comma separated values"
      />
      </div>
      <div>
        <label className="block font-semibold">Country</label>
        <input type="text" name="country" value={formData.country} onChange={handleChange} className="border p-2 w-full rounded" />
      </div>
    </div>

    {/* Subject & Pricing */}
    <div>
      <label className="block font-semibold">Subject Expertise</label>
      <input
        type="text"
        name="subject_expertise"
        value={Array.isArray(formData.subject_expertise) ? formData.subject_expertise.join(", ") : ""}
        onChange={(e) => setFormData({ ...formData, subject_expertise: e.target.value.split(",").map(item => item.trim()) })}
        className="border p-2 w-full rounded"
        placeholder="Comma separated values"
      />

    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block font-semibold">Hourly Rate</label>
        <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} className="border p-2 w-full rounded" />
      </div>
      <div>
        <label className="block font-semibold">Monthly Rate</label>
        <input type="number" name="monthly_rate" value={formData.monthly_rate} onChange={handleChange} className="border p-2 w-full rounded" />
      </div>
    </div>

    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">Save Changes</button>

  </form>
  <div className="flex flex-row gap-6 mt-6">
  <div className="flex-1 max-w-md">
    <ChangePassword />
  </div>
  <div className="flex-1 max-w-md">
    <TutorEmailSettings />
  </div>
</div>
 
</div>

        </div>
      </div>
    </div>
  );
}
