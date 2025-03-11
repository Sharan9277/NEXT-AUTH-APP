// app/verify-email/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation"; // Import for 404

export default function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email");

  useEffect(() => {
    if (queryEmail) {
      setEmail(queryEmail);
      console.log("User email from query:", queryEmail);
    } else {
      // Redirect to 404 if email is missing
      notFound();
    }
  }, [queryEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationCode }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(data.message);

      // Fetch the role directly from the database using email from query
      const roleRes = await fetch("/api/get-user-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // Use email from query
      });

      const roleData = await roleRes.json();
      console.log("Fetched Role:", roleData.role); // Debugging

      // Redirect based on the user role
      if (roleData.role === "student") {
        setTimeout(() => router.push("/login/student"), 2000);
      } else if (roleData.role === "tutor") {
        setTimeout(() => router.push("/login/tutor"), 2000);
      } else {
        setError("Invalid user role. Please sign up again.");
      }
    } else {
      setError(data.message);
    }
  };
  

  const handleResend = async () => {
    setIsResending(true);
    const res = await fetch("/api/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    
    const data = await res.json();
    setIsResending(false);

    if (res.ok) {
      setSuccess(data.message);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4">Enter the verification code sent to your email.</p>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600"
          >
            Verify
          </button>
        </form>

        <button 
          onClick={handleResend} 
          disabled={isResending}
          className="mt-4 text-blue-600 hover:underline"
        >
          {isResending ? "Resending..." : "Resend Verification Code"}
        </button>
      </div>
    </div>
  );
}
