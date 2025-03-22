"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { HomeIcon, ClipboardIcon, TrashIcon, ChatBubbleLeftIcon, CogIcon, } from "@heroicons/react/24/outline";




export default function Sidebar() {
  const { data: session } = useSession();
  const tutorId = session?.user?.id || "default"; // Get tutor ID from session
  const pathname = usePathname();
  const menuItems = [
  
    { name: "Dashboard", path: `/dashboard/tutor/${tutorId}`, icon: HomeIcon },
    { name: "My Assignment", path: `/dashboard/tutor/${tutorId}/assignments`, icon: ClipboardIcon },
    { name: "My Earnings", path: `/dashboard/tutor/${tutorId}/earnings`, icon: TrashIcon },
    { name: "Message", path: `/dashboard/tutor/${tutorId}/messages`, icon: ChatBubbleLeftIcon },
    { name: "My Schedule", path: `/dashboard/tutor/${tutorId}/schedule`, icon: ClipboardIcon },
    { name: "Settings", path: `/dashboard/tutor/${tutorId}/profilesettings`, icon: CogIcon },
  ];


  return (
    <div className="w-64 bg-bluee text-white p-5">
      <div className="text-xl font-bold mb-8">Logo</div>
      <nav className="mb-16">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <Link key={name} href={path} className={`flex items-center space-x-3 p-3 rounded-md mb-2 
            ${pathname === path ? "bg-at-button-light" : "hover:bg-gray-700"}`}>
            <Icon className="w-6 h-6" />
            <span>{name}</span>
          </Link>
        ))}
      </nav>
      <div className="flex justify-center">
        <button className="bg-at-button-light text-white w-auto p-2 rounded text-md pr-5 pl-5">Refer a Friend</button>
      </div>
    </div>
  );
}
