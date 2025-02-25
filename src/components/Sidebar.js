import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ClipboardIcon, TrashIcon, ChatBubbleLeftIcon, CogIcon, } from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Dashboard", path: "/dashboard/tutor", icon: HomeIcon },
  { name: "My Assignment", path: "/dashboard/tutor/assignments", icon: ClipboardIcon },
  { name: "Earning", path: "/dashboard/tutor/earnings", icon: TrashIcon },
  { name: "Message", path: "/dashboard/tutor/messages", icon: ChatBubbleLeftIcon },
  { name: "Settings", path: "/dashboard/tutor/settings", icon: CogIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-bluee text-white p-5">
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
