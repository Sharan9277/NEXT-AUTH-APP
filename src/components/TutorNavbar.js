"use client";
import Image from "next/image";
import MegaMenu from "./mega-menu";
import PropTypes from "prop-types";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const TutorNavbar = ({ className = "" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(""); // ✅ Store fetched user name
  const [profileImage, setProfileImage] = useState(null); // ✅ Profile Image
  const dropdownRef = useRef(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [tutor, setTutor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject_expertise: [],
    hourly_rate: "",
  });

  const tutorId = session?.user?.id || "default";

  // ✅ Fetch user details from the correct tutor account
  useEffect(() => {
    const fetchTutor = async () => {
      if (session?.user?.id) { // ✅ Use ID instead of email
        try {
          const res = await fetch(`/api/tutors/${session.user.id}`); // ✅ Fetch by ID
          const data = await res.json();

          if (res.ok && data) {
            setUserName(data.name || "User");
            setProfileImage(data.profile_image && data.profile_image !== "" ? data.profile_image : "/default-avatar.png");
            setTutor(data);
            setFormData({
              name: data.name || "",
              phone: data.phone || "",
              subject_expertise: data.subject_expertise || [],
              hourly_rate: data.hourly_rate || "",
            });
          } else {
            console.error("Error fetching tutor details:", data.message);
          }
        } catch (error) {
          console.error("Error fetching tutor data:", error);
        }
      }
    };

    fetchTutor();
  }, [session]); // ✅ Re-fetch when session changes

  // ✅ Extract initials correctly
  const getUserInitials = (name) => {
    if (!name) return "U"; // Default fallback to "U"
    const words = name.trim().split(" ");
    return words.length >= 2
      ? (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
      : words[0].charAt(0).toUpperCase();
  };

  const userInitial = getUserInitials(userName); // ✅ Extract user initials

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    let loginPath = "/login-selection";

    if (session?.user?.role === "admin") {
      loginPath = "/login/admin";
    } else if (session?.user?.role === "student") {
      loginPath = "/login/student";
    } else if (session?.user?.role === "tutor") {
      loginPath = "/login/tutor";
    }

    signOut({ callbackUrl: loginPath });
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex relative bg-white flex flex-row items-center justify-between py-6 px-10 box-border text-left text-sm text-gray-600 font-body-large-400">
        <div className="flex flex-col items-start justify-start gap-1.5">
          <div className="w-[312px] relative tracking-[-0.01em] leading-[20px] font-medium inline-block">Good Morning</div>
          <div className="w-[312px] relative text-xl leading-[26px] font-semibold text-gray-900 inline-block">
            {tutor?.name || "Tutor"}
          </div>
        </div>
        <div className="flex flex-row items-start justify-start gap-4 text-base text-gray-500">
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
              <Image
                className="w-12 relative rounded-[50%] h-12 object-cover"
                width={48}
                height={48}
                alt="Tutor Profile"
                src={profileImage || "/default-avatar.png"} // ✅ Ensure a valid image source
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <Link href={`/dashboard/tutor/${tutorId}/profilesettings`} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Profile
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

TutorNavbar.propTypes = {
  className: PropTypes.string,
};

export default TutorNavbar;
