"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function StudentSignup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "student" }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
    } else {
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => router.push("/login/student"), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Sign Up as Student</h1>

      {/* Manual Signup Form */}
      <form onSubmit={handleSignup} className="w-80 bg-white p-6 rounded shadow-md">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
          Sign Up
        </button>
      </form>

      {/* Social Signup */}
      <p className="mt-4">Or sign up with:</p>
      <button onClick={() => signIn("google")} className="bg-red-500 text-white w-80 p-2 rounded mb-2">
        Sign Up with Google
      </button>
      <button onClick={() => signIn("facebook")} className="bg-blue-700 text-white w-80 p-2 rounded mb-2">
        Sign Up with Facebook
      </button>
      <button onClick={() => signIn("apple")} className="bg-black text-white w-80 p-2 rounded">
        Sign Up with Apple
      </button>

      <p className="mt-4">
        Already have an account?{" "}
        <button onClick={() => router.push("/login/student")} className="text-blue-500 underline">
          Login as Student
        </button>
      </p>
    </div>
  );
}
