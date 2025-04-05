// app/api/tutor/update-profile/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Tutor from "@/models/Tutor";

// Helper function to handle file uploads
// In a real application, you'd implement file uploads to a service like AWS S3
const handleFileUpload = async (file) => {
  // Mock implementation
  return `/uploads/${Date.now()}-${file.name}`;
};

export async function POST(req) {
  try {
    await connectToDatabase();
    
    // For multipart form data
    const formData = await req.formData();
    const email = formData.get("email");
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Find tutor profile
    const tutor = await Tutor.findOne({ user_id: user._id });
    if (!tutor) {
      return NextResponse.json({ message: "Tutor profile not found" }, { status: 404 });
    }
    
    // Process form data
    const firstName = formData.get("firstName") || "";
    const lastName = formData.get("lastName") || "";
    const name = `${firstName} ${lastName}`.trim();
    const country = formData.get("country") || "";
    const subject = formData.get("subject") || "";
    const phone = formData.get("phone") || "";
    const bio = formData.get("bio") || "";
    const about_me = formData.get("about_me") || "";
    const hourly_rate = parseFloat(formData.get("hourly_rate") || 0);
    const monthly_rate = parseFloat(formData.get("monthly_rate") || 0);
    
    // Handle arrays
    let languages = [];
    try {
      languages = JSON.parse(formData.get("languages") || "[]");
    } catch (e) {
      console.error("Error parsing languages:", e);
    }
    
    let qualifications = [];
    try {
      const qualificationsStr = formData.get("qualifications");
      qualifications = qualificationsStr ? qualificationsStr.split(",").map(q => q.trim()) : [];
    } catch (e) {
      console.error("Error parsing qualifications:", e);
    }
    
    let education = [];
    try {
      education = JSON.parse(formData.get("education") || "[]");
    } catch (e) {
      console.error("Error parsing education:", e);
    }
    
    let availability = [];
    try {
      availability = JSON.parse(formData.get("availability") || "[]");
    } catch (e) {
      console.error("Error parsing availability:", e);
    }
    
    // Handle file uploads
    let profileImagePath = tutor.profile_image;
    const profileImage = formData.get("profileImage");
    if (profileImage && profileImage.size > 0) {
      profileImagePath = await handleFileUpload(profileImage);
    }
    
    let resumePath = tutor.resume;
    const resume = formData.get("resume");
    if (resume && resume.size > 0) {
      resumePath = await handleFileUpload(resume);
    }
    
    // Update tutor profile
    const updatedTutor = await Tutor.findOneAndUpdate(
      { user_id: user._id },
      {
        name,
        country,
        subject_expertise: subject ? [subject] : [],
        phone,
        bio,
        about_me,
        profile_image: profileImagePath,
        resume: resumePath,
        qualifications,
        languages_spoken: languages.map(lang => lang.name),
        hourly_rate,
        monthly_rate,
        isAdminVerified: false,
      },
      { new: true }
    );
    
    return NextResponse.json({ 
      message: "Profile updated successfully",
      tutor: updatedTutor
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ 
      message: "Failed to update profile", 
      error: error.message 
    }, { status: 500 });
  }
}
