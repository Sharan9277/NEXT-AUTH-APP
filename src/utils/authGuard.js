"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children, allowedRoles }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (!session) {
      router.push("/login-selection"); // Redirect if not logged in
    } else if (!allowedRoles.includes(session.user.role)) {
      router.push("/unauthorized"); // Redirect if role is not allowed
    }
  }, [session, status, router, allowedRoles]);

  if (status === "loading" || !session) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return children;
}
