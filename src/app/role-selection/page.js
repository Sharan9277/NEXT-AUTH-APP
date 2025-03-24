"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RoleSelection() {
  const { data: session, status } = useSession();
  const [selectedRole, setSelectedRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "default") {
      // If role already exists, redirect user
      router.push(`/dashboard/${session.user.role}/${session.user.id}`);
    }
  }, [status, session, router]);

  const handleRoleSelect = async (role) => {
    try {
      const res = await fetch("/api/auth/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email: session.user.email }),
      });

      if (res.ok) {
        router.push(`/dashboard/${role}`);
      } else {
        console.error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold mb-4">Select Your Role</h2>
      <button onClick={() => handleRoleSelect("student")} className="px-6 py-3 bg-blue-500 text-white rounded-md">Student</button>
      <button onClick={() => handleRoleSelect("tutor")} className="px-6 py-3 bg-green-500 text-white rounded-md mt-2">Tutor</button>
    </div>
  );
}
