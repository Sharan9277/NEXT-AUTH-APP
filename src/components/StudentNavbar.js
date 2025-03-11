import Image from "next/image";
import MegaMenu from "./mega-menu";
import PropTypes from "prop-types";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const StudentNavbar = ({ className = "" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(""); // ✅ Store fetched user name
  const [profileImage, setProfileImage] = useState(null); // Profile Image
  const dropdownRef = useRef(null);
  const { data: session } = useSession();
  const router = useRouter();

  // Function to extract initials correctly
  const getUserInitials = (name) => {
    if (!name) return "U"; // Default fallback to "U"
    const words = name.trim().split(" ");
    return words.length >= 2
      ? (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
      : words[0].charAt(0).toUpperCase();
  };

  // Fetch user details from database
  useEffect(() => {
    const fetchStudentData = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/get-student-details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session.user.id }),
          });

          const data = await res.json();
          if (res.ok) {
            setUserName(data.name || "User"); // ✅ Set student name
            setProfileImage(data.profile_image || null); // ✅ Set profile image
          } else {
            console.error("Error fetching student details:", data.message);
          }
        } catch (error) {
          console.error("Error fetching student details:", error);
        }
      }
    };

    fetchStudentData();
  }, [session]);

  const userInitial = getUserInitials(userName); // Get initials

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
    <div
      className={`w-auto h-[86px] bg-[rgba(85,119,209,0.23)]  max-w-full  shrink-0 flex flex-col items-center justify-center leading-[normal] tracking-[normal] mq1250:h-auto ${className}`}
    >
    <div
      className={`self-stretch bg-[rgba(255,97,82,0)] p-2 flex flex-row items-center justify-center gap-[800px] max-w-full text-left text-[14px] text-[#808080] font-inter mq450:gap-[45px] mq750:gap-[90px] mq1250:gap-[180px] mq1250:flex-wrap ${className}`}
    >
      <Image
        className="h-[49.71px] w-[186px] relative object-cover"
        loading="lazy"
        width={186}
        height={50}
        alt=""
        src="/final assign tutor logo 1.png"
      />
      <div className="flex flex-row items-center justify-end py-[0px] px-[20px] box-border gap-[20px] max-w-full mq750:flex-wrap">
        <button className="cursor-pointer border-[#121117] border-solid border-[2px] py-[7px] px-[16px] bg-[transparent] rounded-[8px] flex flex-row items-center justify-center hover:bg-[rgba(69,69,74,0.09)] hover:border-[#45454a] hover:border-solid hover:hover:border-[2px] hover:box-border">
          <a className="[text-decoration:none] h-[20px] w-[65.3px] relative text-[12px] tracking-[0.17px] leading-[20px] font-semibold font-inter text-[#121117] text-center flex items-center justify-center">
            Subscribe
          </a>
        </button>
        <button className="cursor-pointer border-[#121117] border-solid border-[2px] pt-[8px] pb-[6px] pl-[18px] pr-[14px] bg-[transparent] h-[40px] w-[115.6px] rounded-[8px] box-border flex flex-row items-start justify-start hover:bg-[rgba(69,69,74,0.09)] hover:border-[#45454a] hover:border-solid hover:hover:border-[2px] hover:box-border">
          <div className="h-[20px] w-[80px] relative text-[12px] tracking-[0.17px] leading-[20px] font-semibold font-inter text-[#121117] text-center flex items-center justify-center">
            Balance: 0.5
          </div>
        </button>
        <div className="flex flex-row items-center justify-center">
          <div className="hidden flex-row items-center justify-center py-[8px] px-[12px] text-[#000]">
            <div className="relative leading-[20px] font-inter font-semibold">Home</div>
          </div>
          <MegaMenu
            property1="Default"
            text="Refer a friend"
            vector="/vector.svg"
            showVectorIcon={false}
          />
          <div className="hidden flex-row items-center justify-center py-[8px] px-[12px] gap-[10px]">
            <div className="relative leading-[20px] font-inter font-semibold">
              Resources
            </div>
            <Image
              className="w-[20px] relative h-[20px] overflow-hidden shrink-0"
              width={20}
              height={20}
              alt=""
              src="/arrow--chevron-down.svg"
            />
          </div>
          <div className="hidden flex-row items-center justify-center py-[8px] px-[12px]">
            <div className="relative leading-[20px] font-inter font-semibold">Pricing</div>
          </div>
          <MegaMenu
            property1="Default"
            text="English, ₹INR"
            textTextDecoration="unset"
            vector="/vector.svg"
            showVectorIcon
          />
        </div>
        <div className="flex flex-row items-center justify-start gap-[48px]">
          <div className="flex flex-row items-center justify-start gap-[20px]">
            <Image
              className="h-[20px] w-[20px] relative"
              loading="lazy"
              width={20}
              height={20}
              alt=""
              src="/vector-1.svg"
            />
            <Image
              className="h-[20px] w-[14px] relative"
              loading="lazy"
              width={14}
              height={20}
              alt=""
              src="/vector-2.svg"
            />
            <Image
              className="h-[28px] w-[25px] relative"
              loading="lazy"
              width={25}
              height={28}
              alt=""
              src="/39notification.svg"
            />
          </div>
      <div className="relative z-[100]" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} aria-expanded={dropdownOpen}
              aria-haspopup="menu"
              aria-label="User menu"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-white font-semibold"
            >
            {profileImage ? (
                <Image 
                  className="w-12 h-12 rounded-full object-cover" 
                  width={48} 
                  height={48} 
                  alt="User Avatar" 
                  src={profileImage} 
                />
              ) : (
                <span className="text-lg">{userInitial}</span>
              )}              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</a>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
      </div>
        </div>
    </div>
    </div>
  );
};

StudentNavbar.propTypes = {
  className: PropTypes.string,
};

export default StudentNavbar;
