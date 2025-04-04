import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaQuestionCircle, FaBookmark, FaBell, FaGlobe, FaChevronDown } from "react-icons/fa";

const StudentNavbar = ({ className = "" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [languageCurrencyOpen, setLanguageCurrencyOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("EUR");
  
  const dropdownRef = useRef(null);
  const langCurrencyRef = useRef(null);
  const { data: session } = useSession();
  const router = useRouter();
  const studentId = session?.user?.id || "default";
  
  const getUserInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words.length >= 2
      ? (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
      : words[0].charAt(0).toUpperCase();
  };

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
            setUserName(data.name || "User");
            setProfileImage(data.profile_image || null);
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

  const userInitial = getUserInitials(userName);

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
  
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    // Logic to change website language would go here
    console.log(`Language changed to ${lang}`);
  };
  
  const handleCurrencyChange = (curr) => {
    setCurrency(curr);
    // Logic to change website currency would go here
    console.log(`Currency changed to ${curr}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (langCurrencyRef.current && !langCurrencyRef.current.contains(event.target)) {
        setLanguageCurrencyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`w-auto h-[86px] bg-[rgba(85,119,209,0.23)] max-w-full shrink-0 flex flex-col items-center justify-center leading-[normal] tracking-[normal] z-[999] mq1250:h-auto ${className}`}
    >
      <div
        className={`self-stretch bg-[rgba(255,97,82,0)] p-8 flex flex-row items-center justify-between max-w-full text-left text-[14px] text-black font-inter mq450:flex-wrap ${className}`}
      >
        <Image
          className="h-[49.71px] w-[186px] relative object-cover"
          loading="lazy"
          width={186}
          height={50}
          alt=""
          src="/logo123.png"
        />
        <button
          className="block md:hidden text-[#121117] text-2xl"
          onClick={() => setHamburgerOpen(!hamburgerOpen)}
        >
          ☰
        </button>
        <div className="text-black font-inter hidden md:flex flex-row items-center justify-end py-[0px] px-[20px] box-border gap-[20px] max-w-full">
          <button
            onClick={() =>
              router.push(`/dashboard/student/${session?.user?.id}/subscription`)
            }
            className="cursor-pointer font-semibold text-[12px] border-[#121117] border-solid border-[2px] py-[7px] px-[16px] bg-[transparent] rounded-[8px] flex flex-row items-center justify-center hover:bg-[rgba(69,69,74,0.09)] hover:border-[#45454a]"
          >
            Subscribe
          </button>
          <button className="cursor-pointer font-semibold text-[12px] border-[#121117] border-solid border-[2px] py-[7px] px-[16px] bg-[transparent] rounded-[8px] flex flex-row items-center justify-center hover:bg-[rgba(69,69,74,0.09)] hover:border-[#45454a]">
            Balance: {session?.user?.wallet_balance ?? 0}
          </button>
          <button
            className="cursor-pointer font-semibold text-[12px] border-gray-400 border-solid border-[2px] py-[7px] px-[16px] bg-[transparent] rounded-[8px] flex flex-row items-center justify-center hover:bg-[rgba(69,69,74,0.09)] hover:border-[#45454a]"
          >
            Refer a Friend
          </button>
          
          {/* Language & Currency Dropdown */}
          <div className="relative" ref={langCurrencyRef}>
            <button 
              onClick={() => setLanguageCurrencyOpen(!languageCurrencyOpen)}
              className="flex items-center justify-center gap-1 cursor-pointer font-semibold text-[12px] border-gray-400 border-solid border-[2px] py-[7px] px-[16px] bg-[transparent] rounded-[8px] hover:bg-[rgba(69,69,74,0.09)] hover:border-[#45454a]"
            >
              <FaGlobe className="text-[#121117] text-sm" />
              <span>{language}, {currency}</span>
              <FaChevronDown className="text-[#121117] text-xs" />
            </button>
            
            {languageCurrencyOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <FaEnvelope className="text-[#121117] text-xl cursor-pointer" />
          <FaQuestionCircle className="text-[#121117] text-xl cursor-pointer" />
          <FaBookmark className="text-[#121117] text-xl cursor-pointer" />
          <FaBell className="text-[#121117] text-xl cursor-pointer" />
          <div className="relative z-[100]" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
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
                <span className="text-lg text-gray-500 font-inter">{userInitial}</span>
              )}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <Link href={`/dashboard/student/${studentId}`} className="block px-4 py-2 text-black hover:bg-gray-100">
                  Home
                </Link>
                <a href={`/dashboard/student/${studentId}/messages`} className="block px-4 py-2 text-black hover:bg-gray-100">
                  Messages
                </a>
                <a href={`/dashboard/student/${studentId}/assignments`} className="block px-4 py-2 text-black hover:bg-gray-100">
                  Assignments
                </a>
                <a href={`/dashboard/student/${studentId}/lessons`} className="block px-4 py-2 text-black hover:bg-gray-100">
                  My Lessons
                </a>
                <a href={`/dashboard/student/${studentId}/settings`} className="block px-4 py-2 text-black hover:bg-gray-100">
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hamburger Menu */}
      {hamburgerOpen && (
        <div className="fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg z-50">
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={() => setHamburgerOpen(false)}
          >
            ✕
          </button>
          <div className="flex flex-col items-start p-4">
            <a href={`/dashboard/student/${studentId}`} className="block px-4 py-2 text-black hover:bg-gray-100">
              Home
            </a>
            <a href={`/dashboard/student/${studentId}/messages`} className="block px-4 py-2 text-black hover:bg-gray-100">
              Messages
            </a>
            <a href={`/dashboard/student/${studentId}/assignments`} className="block px-4 py-2 text-black hover:bg-gray-100">
              Assignments
            </a>
            <a href={`/dashboard/student/${studentId}/lessons`} className="block px-4 py-2 text-black hover:bg-gray-100">
              My Lessons
            </a>
            <a href={`/dashboard/student/${studentId}/settings`} className="block px-4 py-2 text-black hover:bg-gray-100">
              Settings
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
            >
              Logout
            </button>
            
            {/* Language & Currency options in mobile menu */}
            <div className="w-full px-4 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

StudentNavbar.propTypes = {
  className: PropTypes.string,
};

export default StudentNavbar;