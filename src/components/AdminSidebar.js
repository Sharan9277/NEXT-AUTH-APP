"use client";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  MdDashboard, 
  MdPeople, 
  MdSchool, 
  MdAssignment, 
  MdBarChart, 
  MdAdminPanelSettings, 
  MdHelp 
} from "react-icons/md"; // Importing icons

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const adminId = session?.user?.id || "default";

  // Define menu items with icons
  const menuItems = [
    { name: "Dashboard", path: `/dashboard/admin/${adminId}`, icon: <MdDashboard size={20} /> },
    { name: "Students", path: `/dashboard/admin/${adminId}/students`, icon: <MdPeople size={20} /> },
    { name: "Tutors", path: `/dashboard/admin/${adminId}/tutors`, icon: <MdSchool size={20} /> },
    { name: "Assignments", path: `/dashboard/admin/${adminId}/assignments`, icon: <MdAssignment size={20} /> },
    { name: "Reports", path: `/dashboard/admin/${adminId}/reports`, icon: <MdBarChart size={20} /> },
    { name: "Administration", path: `/dashboard/admin/${adminId}/administration`, icon: <MdAdminPanelSettings size={20} /> },
    { name: "Help", path: `/dashboard/admin/${adminId}/help`, icon: <MdHelp size={20} /> },
  ];

  return (
    <div className="bg-white shadow-lg rounded-[10px] p-4 w-full">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition ${
                pathname === item.path
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 text-black"
              }`}
              onClick={() => router.push(item.path)}
            >
                <div className="w-6">{item.icon}</div> {/* Fixed width for icons */}
                <span>{item.name}</span> {/* Text stays left-aligned */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
