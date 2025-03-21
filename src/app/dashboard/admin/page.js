"use client";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <AdminNavbar />

      {/* Main Content with Sidebar and Dashboard Section */}
      <div className="flex gap-6 p-6">
        {/* Sidebar with Space from Left and Rounded Styling */}
        <div className="w-60">
          <AdminSidebar />
        </div>

        {/* Right Section (Main Dashboard) */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold font-inter text-black">Admin Dashboard</h1>
        <p className="text-center font-inter text-black">Welcome to the Admin Panel. Select an option from the menu.</p>
        </div>
      </div>
    </div>
  );
}
