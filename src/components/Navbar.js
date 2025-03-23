"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    pages: false,
    resources: false,
  });
  const [activeMenu, setActiveMenu] = useState("home");

  const { data: session } = useSession();
  const router = useRouter();

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

  return (
    <div className="bg-white">
      <nav className="bg-at-light-orange p-4 text-white m-0 relative z-20">
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
            <div className="relative">
              <button
                onClick={() =>
                  setDropdownOpen((prev) => ({
                    ...prev,
                    pages: !prev.pages,
                  }))
                }
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
                  href="/how-we-work"
                  onClick={() => handleMenuClick("pages")}
                  className="block px-6 py-2 hover:bg-gray-200"
                >
                  How we work
                </Link>
                <Link
                  href="/faq"
                  onClick={() => handleMenuClick("pages")}
                  className="block px-6 py-2 hover:bg-gray-200"
                >
                  FAQ
                </Link>
              </div>
            )}

            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setDropdownOpen((prev) => ({
                    ...prev,
                    resources: !prev.resources,
                  }))
                }
                className={`${
                  activeMenu === "resources" ? "text-black" : "text-gray-500"
                } hover:text-black flex items-center`}
              >
                Resources <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
              </button>
              {dropdownOpen.resources && (
                <div className="absolute bg-white text-black rounded shadow-md mt-2 z-20">
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
            <div className="relative">
              <button
                className={`${
                  activeMenu === "currency" ? "text-black" : "text-gray-500"
                } hover:text-black`}
                onClick={() => handleMenuClick("currency")}
              >
                English | $USD <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
              </button>
              <div className="absolute bg-white text-black rounded shadow-md mt-2 hidden z-20">
                <button className="block px-4 py-2 hover:bg-gray-200">
                  English
                </button>
                <button className="block px-4 py-2 hover:bg-gray-200">
                  Español
                </button>
                <button className="block px-4 py-2 hover:bg-gray-200">
                  €EUR
                </button>
                <button className="block px-4 py-2 hover:bg-gray-200">
                  £GBP
                </button>
              </div>
            </div>

            {/* Login / Logout */}
            {session ? (
              <button
                onClick={handleProfileClick}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
              >
                Profile
              </button>
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
        <div className="md:hidden bg-white text-black p-4 z-20">
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
              onClick={() =>
                setDropdownOpen((prev) => ({
                  ...prev,
                  pages: !prev.pages,
                }))
              }
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
                <Link
                  href="/faq"
                  onClick={() => handleMenuClick("pages")}
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  FAQ
                </Link>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() =>
                setDropdownOpen((prev) => ({
                  ...prev,
                  resources: !prev.resources,
                }))
              }
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
          <div className="relative">
            <button
              className={`block ${
                activeMenu === "currency" ? "text-black" : "text-gray-500"
              } hover:text-black px-4 py-2 rounded`}
              onClick={() => handleMenuClick("currency")}
            >
              English | $USD <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
            </button>
            <div className="bg-white text-black rounded shadow-md mt-2 hidden z-20">
              <button className="block px-4 py-2 hover:bg-gray-200">
                English
              </button>
              <button className="block px-4 py-2 hover:bg-gray-200">
                Español
              </button>
              <button className="block px-4 py-2 hover:bg-gray-200">
                €EUR
              </button>
              <button className="block px-4 py-2 hover:bg-gray-200">
                £GBP
              </button>
            </div>
          </div>
          {session ? (
            <button
              onClick={handleProfileClick}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
            >
              Profile
            </button>
          ) : (
            <Link
              href="/login-selection"
              className="bg-[#ED6C43] text-white px-4 py-2 rounded hover:opacity-80 mt-4"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
