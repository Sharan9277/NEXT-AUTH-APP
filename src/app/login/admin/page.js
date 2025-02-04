"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const userSession = localStorage.getItem("userSession");
    if (!userSession) {
      router.push("/login/admin");
    }
    else{
      router.push("/dashboard/admin");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res.ok) {
      setError("Invalid credentials");
    } else {
      localStorage.setItem("userSession", JSON.stringify({ email, role: "admin" }));
      router.push("/dashboard/admin");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">admin Login</h1>

      {/* Manual Login Form */}
      <form onSubmit={handleLogin} className="w-80 bg-white p-6 rounded shadow-md">
        {error && <p className="text-red-500">{error}</p>}
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
          Login
        </button>
      </form>

      {/* Social Login */}
      <p className="mt-4">Or sign in with:</p>
      <button onClick={() => signIn("google")} className="bg-red-500 text-white w-80 p-2 rounded mb-2">
        Sign In with Google
      </button>
      <button onClick={() => signIn("facebook")} className="bg-blue-700 text-white w-80 p-2 rounded mb-2">
        Sign In with Facebook
      </button>
      <button onClick={() => signIn("apple")} className="bg-black text-white w-80 p-2 rounded">
        Sign In with Apple
      </button>

    </div>
  );
}
