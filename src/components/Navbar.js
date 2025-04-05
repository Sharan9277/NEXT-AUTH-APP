"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    pages: false,
    resources: false,
    localization: false
  });
  const [activeMenu, setActiveMenu] = useState("home");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  
  // Create refs for dropdown menus
  const pagesRef = useRef(null);
  const resourcesRef = useRef(null);
  const localizationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { data: session } = useSession();
  const router = useRouter();

  // Load language and currency preferences from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    const savedCurrency = localStorage.getItem("selectedCurrency");
    
    if (savedLanguage) setSelectedLanguage(savedLanguage);
    if (savedCurrency) setSelectedCurrency(savedCurrency);
  }, []);

  // Add click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if any dropdown is open and if the click was outside of it
      if (dropdownOpen.pages && pagesRef.current && !pagesRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, pages: false }));
      }
      
      if (dropdownOpen.resources && resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, resources: false }));
      }
      
      if (dropdownOpen.localization && localizationRef.current && !localizationRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, localization: false }));
      }
    }
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleProfileClick = () => {
    if (session?.user) {
      router.push(`/dashboard/${session.user.role}/${session.user.id}`);
    }
  };

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

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    localStorage.setItem("selectedLanguage", language);
  };

  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    setSelectedCurrency(currency);
    localStorage.setItem("selectedCurrency", currency);
  };

  const toggleDropdown = (dropdown) => {
    setDropdownOpen((prev) => {
      const newState = { ...prev };
      // Only for desktop - mobile doesn't use dropdowns anymore
      if (!isOpen) {
        // For desktop, toggle the specific dropdown
        if (dropdown === Object.keys(prev).find(key => prev[key] === true)) {
          newState[dropdown] = !prev[dropdown];
        } else {
          // Close all dropdowns first
          Object.keys(newState).forEach(key => {
            newState[key] = key === dropdown ? !prev[key] : false;
          });
        }
      }
      return newState;
    });
  };

  // Direct navigation function - critical for mobile
  const navigateToPage = (path) => {
    setIsOpen(false);
    setDropdownOpen({
      pages: false,
      resources: false,
      localization: false
    });
    router.push(path);
  };

  // Handle FAQ click to scroll to section
  const handleFaqClick = () => {
    setIsOpen(false);
    setDropdownOpen(prev => ({ ...prev, pages: false }));
    
    // Small timeout to allow menu to close first
    setTimeout(() => {
      const faqSection = document.getElementById("faq");
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="bg-white">
      <nav className="bg-at-light-orange py-4 text-white m-0 relative z-20">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <div onClick={() => navigateToPage("/")} className="cursor-pointer">
            <img 
              src="/Final Assign Tutor logo 1.png" 
              alt="AssignTutor Logo" 
              className="h-10 w-auto" 
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 rounded-md hover:bg-[#c75835]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle mobile menu"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Home Menu */}
            <Link
              href="/"
              onClick={() => setActiveMenu("home")}
              className={`${
                activeMenu === "home" ? "text-black" : "text-gray-500"
              } hover:text-black px-4 py-2 rounded`}
            >
              Home
            </Link>

            {/* Pages Dropdown */}
            <div className="relative" ref={pagesRef}>
              <button
                onClick={() => toggleDropdown("pages")}
                className={`${
                  activeMenu === "pages" ? "text-black" : "text-gray-500"
                } hover:text-black flex items-center`}
              >
                Pages <FontAwesomeIcon icon={dropdownOpen.pages ? faChevronUp : faChevronDown} className="ml-1" />
              </button>
              {dropdownOpen.pages && (
                <div className="absolute bg-white text-black rounded-lg shadow-md mt-2 z-20 min-w-[200px] w-max">
                  <Link
                    href="/about-us"
                    onClick={() => setActiveMenu("pages")}
                    className="block px-6 py-2 hover:bg-gray-200"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/How-we-work"
                    onClick={() => setActiveMenu("pages")}
                    className="block px-6 py-2 hover:bg-gray-200"
                  >
                    How we work
                  </Link>
                  <button
                    onClick={() => {
                      const faqSection = document.getElementById("faq");
                      if (faqSection) {
                        faqSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="block px-6 py-2 hover:bg-gray-200 text-left w-full"
                  >
                    FAQ
                  </button>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => toggleDropdown("resources")}
                className={`${
                  activeMenu === "resources" ? "text-black" : "text-gray-500"
                } hover:text-black flex items-center`}
              >
                Resources <FontAwesomeIcon icon={dropdownOpen.resources ? faChevronUp : faChevronDown} className="ml-1" />
              </button>
              {dropdownOpen.resources && (
                <div className="absolute bg-white text-black rounded shadow-md mt-2 z-20">
                  <Link
                    href="/assignment"
                    onClick={() => setActiveMenu("resources")}
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Assignment
                  </Link>
                </div>
              )}
            </div>

            {/* Contact Us */}
            <Link
              href="/contact-us"
              onClick={() => setActiveMenu("pricing")}
              className={`${
                activeMenu === "pricing" ? "text-black" : "text-gray-500"
              } hover:text-black px-4 py-2 rounded`}
            >
              Contact Us
            </Link>

            {/* Currency and Language Selector */}
            <div className="relative" ref={localizationRef}>
              <button
                className={`${
                  activeMenu === "localization" ? "text-black" : "text-gray-500"
                } hover:text-black flex items-center`}
                onClick={() => toggleDropdown("localization")}
              >
                {selectedLanguage}, {selectedCurrency} <FontAwesomeIcon icon={dropdownOpen.localization ? faChevronUp : faChevronDown} className="ml-1" />
              </button>
              {dropdownOpen.localization && (
                <div className="absolute bg-white text-black rounded shadow-md mt-2 z-20 p-4 min-w-[240px]">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select 
                      className="w-full border border-gray-300 rounded py-2 px-3"
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                    >
                      <option value="English">English</option>
                      <option value="Español">Español</option>
                      <option value="Français">Français</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select 
                      className="w-full border border-gray-300 rounded py-2 px-3"
                      value={selectedCurrency}
                      onChange={handleCurrencyChange}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Login / Logout */}
            {session ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleProfileClick}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login-selection"
                className="bg-[#ED6C43] text-white px-4 py-2 rounded hover:opacity-80 ml-4"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Completely Redesigned - Items shown directly without dropdown */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 flex flex-col">
          <div className="bg-white text-black p-4 w-full h-auto max-h-screen overflow-y-auto" ref={mobileMenuRef}>
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200"
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            
            {/* Home Link */}
            <button 
              className="block px-4 py-3 mb-2 bg-gray-100 rounded-md w-full text-left font-medium hover:bg-gray-200 cursor-pointer"
              onClick={() => navigateToPage("/")}
            >
              Home
            </button>
            
            {/* Pages Section - No Dropdown */}
            <div className="mb-3">
              <div className="px-4 py-2 bg-gray-100 rounded-t-md font-medium">
                Pages
              </div>
              <div className="bg-gray-50 rounded-b-md py-1">
                <button
                  className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                  onClick={() => navigateToPage("/about-us")}
                >
                  About Us
                </button>
                <button
                  className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left" 
                  onClick={() => navigateToPage("/How-we-work")}
                >
                  How We Work
                </button>
                <button
                  className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                  onClick={handleFaqClick}
                >
                  FAQ
                </button>
              </div>
            </div>
            
            {/* Resources Section - No Dropdown */}
            <div className="mb-3">
              <div className="px-4 py-2 bg-gray-100 rounded-t-md font-medium">
                Resources
              </div>
              <div className="bg-gray-50 rounded-b-md py-1">
                <button
                  className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                  onClick={() => navigateToPage("/assignment")}
                >
                  Assignment
                </button>
              </div>
            </div>
            
            {/* Contact Us */}
            <button
              className="block px-4 py-3 mb-3 bg-gray-100 rounded-md w-full text-left font-medium hover:bg-gray-200 cursor-pointer"
              onClick={() => navigateToPage("/contact-us")}
            >
              Contact Us
            </button>
            
            {/* Language and Currency Selector - No Dropdown */}
            <div className="mb-4">
              <div className="px-4 py-2 bg-gray-100 rounded-t-md font-medium">
                {selectedLanguage}, {selectedCurrency}
              </div>
              <div className="p-4 bg-gray-50 rounded-b-md">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select 
                    className="w-full border border-gray-300 rounded py-2 px-3"
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                  >
                    <option value="English">English</option>
                    <option value="Español">Español</option>
                    <option value="Français">Français</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select 
                    className="w-full border border-gray-300 rounded py-2 px-3"
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Login/Profile for Mobile */}
            {session ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleProfileClick();
                    setIsOpen(false);
                  }}
                  className="bg-red-500 text-white py-3 rounded-md font-medium hover:bg-red-600"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="bg-gray-500 text-white py-3 rounded-md font-medium hover:bg-gray-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="w-full bg-[#ED6C43] text-white py-3 rounded-md font-medium hover:opacity-80"
                onClick={() => navigateToPage("/login-selection")}
              >
                Login
              </button>
            )}
          </div>
          
          {/* Tinted backdrop that closes menu when clicked */}
          <div 
            className="flex-grow"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}