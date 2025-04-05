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

export default function AssignmentSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const adminId = session?.user?.id || "default";

  // Define menu items with icons
  const menuItems = [
    { name: "Assignments", path: `/dashboard/assignment/${adminId}/assignments`, icon: <MdAssignment size={20} /> },

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
