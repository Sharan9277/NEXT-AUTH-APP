"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Remove login flag from local storage

    // Determine the login path based on the user's role
    let loginPath = "/login-selection"; // Default login path

    if (session?.user?.role === "admin") {
      loginPath = "/login/admin";
    } else if (session?.user?.role === "student") {
      loginPath = "/login/student";
    } else if (session?.user?.role === "tutor") {
      loginPath = "/login/tutor";
    }

    signOut({ callbackUrl: loginPath }); // Sign out and redirect to the appropriate login page
  };

  return (
    <>
    <nav className="bg-at-light-orange p-4 text-white m-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Auth App
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        <div className={`md:flex ${isOpen ? "block" : "hidden"}`}>
          {session ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
            >
              Logout
            </button>
          ) : (
            <Link href="/login-selection" className="px-4 py-2 hover:bg-blue-500 rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
    </>
  );
}