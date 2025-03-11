"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import TutorNavbar from "@/components/TutorNavbar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function TutorProfileSettings() {
  const { id } = useParams();
  const router = useRouter();

  // ✅ State for form data
  const [formData, setFormData] = useState({
    profile_image: "",
    name: "",
    bio: "",
    about_me: "",
    qualifications: [],
    subject_expertise: [],
    specialties: [],
    hourly_rate: 0,
    monthly_rate: 0,
    languages_spoken: [],
    resume: "",
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
          bio: data.bio || "",
          about_me: data.about_me || "",
          qualifications: Array.isArray(data.qualifications) ? data.qualifications : [],
          subject_expertise: Array.isArray(data.subject_expertise) ? data.subject_expertise : [],
          specialties: Array.isArray(data.specialties) ? data.specialties : [],
          hourly_rate: data.hourly_rate ?? 0,
          monthly_rate: data.monthly_rate ?? 0,
          languages_spoken: Array.isArray(data.languages_spoken) ? data.languages_spoken : [],
          resume: data.resume || "",
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

  // ✅ Handle file upload (Profile Image & Resume)
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({ ...formData, [field]: reader.result }); // ✅ Store Base64 file
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
    <div className="flex bg-[#F1f1f1] h-screen">
        <Sidebar active="Profile Settings" />
    <div className="mx-auto w-full">
      <TutorNavbar />
        <div className="flex-grow p-6">
          <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Profile Image */}
              <div>
                <label className="block font-semibold">Profile Image</label>
                {formData.profile_image && (
                  <Image
                    src={formData.profile_image}
                    width={100}
                    height={100}
                    alt="Tutor Profile"
                    className="rounded-full border mb-2"
                  />
                )}
                <input type="file" onChange={(e) => handleFileUpload(e, "profile_image")} className="border p-2 w-full rounded" />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block font-semibold">Resume Upload</label>
                <input type="file" onChange={(e) => handleFileUpload(e, "resume")} className="border p-2 w-full rounded" />
              </div>

              {/* Name */}
              <div>
                <label className="block font-semibold">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              {/* Bio */}
              <div>
                <label className="block font-semibold">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              {/* About Me */}
              <div>
                <label className="block font-semibold">About Me</label>
                <textarea name="about_me" value={formData.about_me} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save Changes</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
