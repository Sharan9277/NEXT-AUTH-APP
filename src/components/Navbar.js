"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

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
      
      // Close mobile menu when clicking outside
      if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, isOpen]);

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

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsOpen(false);
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    localStorage.setItem("selectedLanguage", language);
    // Here you would implement logic to change the language of the application
  };

  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    setSelectedCurrency(currency);
    localStorage.setItem("selectedCurrency", currency);
    // Here you would implement logic to change the currency throughout the application
  };

  const toggleDropdown = (dropdown) => {
    setDropdownOpen((prev) => {
      const newState = { ...prev };
      // Close all dropdowns first
      Object.keys(newState).forEach(key => {
        newState[key] = key === dropdown ? !prev[key] : false;
      });
      return newState;
    });
  };

  return (
    <div className="bg-white">
      <nav className="bg-at-light-orange py-4 text-white m-0 relative z-20">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <img 
              src="/Final Assign Tutor logo 1.png" 
              alt="AssignTutor Logo" 
              className="h-10 w-auto" 
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Home Menu */}
            <Link
              href="/"
              onClick={() => handleMenuClick("home")}
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
                Pages <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
              </button>
              {dropdownOpen.pages && (
              <div className="absolute bg-white text-black rounded-lg shadow-md mt-2 z-20 min-w-[200px] w-max">
                <Link
                  href="/about-us"
                  onClick={() => handleMenuClick("pages")}
                  className="block px-6 py-2 hover:bg-gray-200"
                >
                  About Us
                </Link>
                <Link
                  href="/How-we-work"
                  onClick={() => handleMenuClick("pages")}
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
                Resources <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
              </button>
              {dropdownOpen.resources && (
                <div className="absolute bg-white text-black rounded shadow-md mt-2 z-20">
                  <Link
                    href="/assignment"
                    onClick={() => handleMenuClick("resources")}
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Assignment
                  </Link>
                  <Link
                    href="/guides"
                    onClick={() => handleMenuClick("resources")}
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Guides
                  </Link>
                  <Link
                    href="/webinars"
                    onClick={() => handleMenuClick("resources")}
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Webinars
                  </Link>
                </div>
              )}
            </div>

            {/* Pricing */}
            <Link
              href="/pricing"
              onClick={() => handleMenuClick("pricing")}
              className={`${
                activeMenu === "pricing" ? "text-black" : "text-gray-500"
              } hover:text-black px-4 py-2 rounded`}
            >
              Pricing
            </Link>

            {/* Currency and Language Selector */}
            <div className="relative" ref={localizationRef}>
              <button
                className={`${
                  activeMenu === "localization" ? "text-black" : "text-gray-500"
                } hover:text-black flex items-center`}
                onClick={() => toggleDropdown("localization")}
              >
                {selectedLanguage}, {selectedCurrency} <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white text-black p-4 z-20" ref={mobileMenuRef}>
          <Link
            href="/"
            onClick={() => handleMenuClick("home")}
            className={`block ${
              activeMenu === "home" ? "text-black" : "text-gray-500"
            } hover:text-black px-4 py-2 rounded`}
          >
            Home
          </Link>
          <div className="relative">
            <button
              onClick={() => toggleDropdown("pages")}
              className={`block ${
                activeMenu === "pages" ? "text-black" : "text-gray-500"
              } hover:text-black flex items-center px-4 py-2 rounded`}
            >
              Pages <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
            </button>
            {dropdownOpen.pages && (
              <div className="bg-white text-black rounded shadow-md mt-2 z-20">
                <Link
                  href="/about-us"
                  onClick={() => handleMenuClick("pages")}
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => handleMenuClick("pages")}
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Contact Us
                </Link>
                <button
                onClick={() => {
                  const faqSection = document.getElementById("faq");
                  if (faqSection) {
                    faqSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="block px-4 py-2 hover:bg-gray-200 text-left w-full"
              >
                FAQ
              </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => toggleDropdown("resources")}
              className={`block ${
                activeMenu === "resources" ? "text-black" : "text-gray-500"
              } hover:text-black flex items-center px-4 py-2 rounded`}
            >
              Resources <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
            </button>
            {dropdownOpen.resources && (
              <div className="bg-white text-black rounded shadow-md mt-2 z-20">
                <Link
                  href="/blog"
                  onClick={() => handleMenuClick("resources")}
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Blog
                </Link>
                <Link
                  href="/guides"
                  onClick={() => handleMenuClick("resources")}
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Guides
                </Link>
                <Link
                  href="/webinars"
                  onClick={() => handleMenuClick("resources")}
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Webinars
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/pricing"
            onClick={() => handleMenuClick("pricing")}
            className={`block ${
              activeMenu === "pricing" ? "text-black" : "text-gray-500"
            } hover:text-black px-4 py-2 rounded`}
          >
            Pricing
          </Link>
          
          {/* Mobile Language and Currency Selector */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("localization")}
              className={`block ${
                activeMenu === "localization" ? "text-black" : "text-gray-500"
              } hover:text-black flex items-center px-4 py-2 rounded w-full justify-between`}
            >
              <span>{selectedLanguage}, {selectedCurrency}</span>
              <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
            </button>
            {dropdownOpen.localization && (
              <div className="bg-white text-black rounded shadow-md mt-2 z-20 p-4 w-full">
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
          
          {/* Login/Profile for Mobile */}
          {session ? (
            <div className="flex flex-col space-y-2 mt-4">
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
              className="block bg-[#ED6C43] text-white px-4 py-2 rounded hover:opacity-80 mt-4 text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
}