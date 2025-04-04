"use client";
import Image from "next/image";
import PropTypes from "prop-types";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";

const TutorNavbar = ({ className = "" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(""); 
  const [profileImage, setProfileImage] = useState(null);
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

  // Fetch user details from the correct tutor account
  useEffect(() => {
    const fetchTutor = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/tutors/${session.user.id}`);
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
  }, [session]);

  // Extract initials correctly
  const getUserInitials = (name) => {
    if (!name) return "U"; // Default fallback to "U"
    const words = name.trim().split(" ");
    return words.length >= 2
      ? (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
      : words[0].charAt(0).toUpperCase();
  };

  const userInitial = getUserInitials(userName);

  // Logout function
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown when clicking outside
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
    <>
      <div className={`flex flex-col w-full ${className}`}>
        <div className="w-full flex relative bg-white flex-row items-center justify-between py-4 md:py-6 px-4 md:px-10 box-border text-left text-sm text-gray-600 font-body-large-400">
          {/* Welcome message - left side */}
          <div className="flex flex-col items-start justify-start gap-1.5">
            <div className="w-[312px] relative tracking-[-0.01em] leading-[20px] font-medium inline-block">Good Morning</div>
            <div className="w-[312px] relative text-xl leading-[26px] font-semibold text-gray-900 inline-block">
              {tutor?.name || "Tutor"}
            </div>
          </div>
          
          {/* Right side with hamburger and profile */}
          <div className="flex flex-row items-center justify-end gap-4 text-base text-gray-500">
            {/* Hamburger menu button - moved to right side */}
            <button 
              className="md:hidden text-gray-700 p-1"
              onClick={toggleMobileMenu}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                <Image
                  className="w-10 md:w-12 relative rounded-[50%] h-10 md:h-12 object-cover"
                  width={48}
                  height={48}
                  alt="Tutor Profile"
                  src={profileImage || "/default-avatar.png"}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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

      {/* Mobile sidebar overlay - only shows when mobile menu is open */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu}></div>
          
          {/* Sidebar */}
          <div className="absolute top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-end p-4">
              <button onClick={toggleMobileMenu}>
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>
            <Sidebar active="Profile Settings" />
          </div>
        </div>
      )}
    </>
  );
};

TutorNavbar.propTypes = {
  className: PropTypes.string,
};

export default TutorNavbar;