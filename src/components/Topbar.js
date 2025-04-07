"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const Topbar = () => {
  const { data: session } = useSession();
  const studentId = session?.user?.id || "default"; // Get student ID from session
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", path: `/dashboard/student/${studentId}` },
    { name: "Messages", path: `/dashboard/student/${studentId}/messages` },
    { name: "Assignments", path: `/dashboard/student/${studentId}/assignments` },
    { name: "My Lessons", path: `/dashboard/student/${studentId}/lessons` },
    { name: "Settings", path: `/dashboard/student/${studentId}/settings` },
  ];

  return (
    <div className="w-full bg-[#fff] border-[#7f7f7f] border-solid border-t-[1px] border-b-[1px] flex flex-col items-start justify-start py-[0px] px-[45px] top-[0] z-50 leading-[normal] tracking-[normal] mq719:pl-[22px] mq719:pr-[22px] mq719:box-border hidden md:block">
      {/* Hidden on small screens (mobile), visible on medium and larger screens */}
      <section className="w-[1348px] flex flex-col items-center justify-center py-[9px] px-[0px] text-left text-[20px] font-inter">
        <div className="self-stretch h-[40px] flex flex-row items-center justify-start gap-[37px] mq405:gap-[18px]">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} className="relative">
              <span
                className={`text-[14px] font-semibold cursor-pointer transition-colors 
                ${
                  pathname === item.path
                    ? "text-[#5577d1] border-b-2 border-[#5577d1] pb-[10px]"
                    : "text-gray-500 hover:text-[#5577d1]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Topbar;