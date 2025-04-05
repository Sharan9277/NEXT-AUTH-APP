"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { FaSearch, FaBell, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

export default function AssignmentNavbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for the right-side menu
  const [searchQuery, setSearchQuery] = useState("");
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/admins/${session.user.id}`);
        const data = await res.json();
        if (res.ok) {
          setAdminData(data);
        } else {
          console.error("Invalid admin ID, redirecting...");
          router.push("/dashboard/admin");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        router.push("/dashboard/admin");
      }
    };

    if (status === "authenticated") {
      fetchAdminData();
    } else if (status === "unauthenticated") {
      alert("Please sign in to access your dashboard.");
      router.push("/login/admin");
    }
  }, [session, status, router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    let loginPath = "/login-selection";
    if (adminData?.role === "admin") {
      loginPath = "/login/admin";
    } else if (adminData?.role === "student") {
      loginPath = "/login/student";
    } else if (adminData?.role === "tutor") {
      loginPath = "/login/tutor";
    }

    signOut({ callbackUrl: loginPath });
  };

  return (
    <nav className="flex items-center justify-between bg-white text-black shadow-md px-8 py-2">
      {/* Left Side: Profile Image, Admin Name */}
      <div className="flex items-center gap-3 relative">
        {/* Profile Image */}
        <Image
          src={adminData?.profileImage || "/default-avatar.png"}
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
          alt="Admin Profile"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        {/* Admin Name */}
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span className="font-semibold">{adminData?.name || "Admin"}</span>
          <FaChevronDown className="text-gray-500" />
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-40 p-2">
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
              onClick={() => router.push("/admin/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
              onClick={() => router.push("/admin/profile")}
            >
              Profile Settings
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-red-100 text-red-500"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="relative flex items-center hidden md:flex">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none"
        />
        <FaSearch className="absolute left-3 text-gray-500" />
      </div>

      {/* Right Side: Notification Icon */}
      <div className="relative cursor-pointer hidden md:block">
        <FaBell className="text-xl text-gray-600" />
      </div>

      {/* Hamburger Menu (Visible on Mobile) */}
      <div className="md:hidden">
        <FaBars className="text-xl cursor-pointer" onClick={() => setMenuOpen(true)} />
      </div>

      {/* Right-Side Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <FaTimes className="text-xl cursor-pointer" onClick={() => setMenuOpen(false)} />
            </div>
            <ul className="space-y-4">
              <li>
                <button className="w-full text-left" onClick={() => router.push(`/dashboard/admin/${session?.user?.id}`)}>
                  Dashboard
                </button>
              </li>
              <li>
                <button className="w-full text-left" onClick={() => router.push(`/dashboard/admin/${session?.user?.id}/students`)}>
                  Students
                </button>
              </li>
              <li>
                <button className="w-full text-left" onClick={() => router.push(`/dashboard/admin/${session?.user?.id}/tutors`)}>
                  Tutors
                </button>
              </li>
              <li>
                <button className="w-full text-left" onClick={() => router.push(`/dashboard/admin/${session?.user?.id}/assignments`)}>
                  Assignments
                </button>
              </li>
              <li>
                <button className="w-full text-left" onClick={() => router.push(`/dashboard/admin/${session?.user?.id}/reports`)}>
                  Reports
                </button>
              </li>
              <li>
                <button className="w-full text-left" onClick={() => router.push(`/dashboard/admin/${session?.user?.id}/administration`)}>
                  Administration
                </button>
              </li>
              <li>
                <button className="w-full text-left" onClick={() => router.push(`/dashboard/admin/${session?.user?.id}/help`)}>
                  Help
                </button>
              </li>
              <li>
                <button className="w-full text-left text-red-500" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}