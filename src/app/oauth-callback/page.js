"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  console.log("Passing Role:", role); // ✅ Debugging
  const role = localStorage.setItem("signupRole", role);

  useEffect(() => {
    if (role) {

      // ✅ Store role in a cookie (so NextAuth can access it)
      const role = localStorage.setItem("signupRole", role); // Expires in 5 minutes

      // ✅ Do NOT pass a custom "state" parameter → Let NextAuth handle it
      signIn("google", { callbackUrl: "/dashboard" });
    } else {
      router.replace("/auth/signup"); // Redirect if no role
    }
  }, [role, router]);

  return <p>Redirecting...</p>;
}
