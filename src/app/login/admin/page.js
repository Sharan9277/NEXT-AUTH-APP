"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
    const { data: session, status } = useSession();
    
    useEffect(() => {
      if (status === "loading") return; // ✅ Wait for session to load before checking
      if (status === "authenticated" && session?.user?.id) {
        router.push(`/dashboard/admin/${session.user.id}`); // ✅ Only redirect if actually logged in
      }
    }, [session, status, router]);
    
    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
    
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // ✅ Prevent automatic redirect (we handle it manually)
      });
    
      if (!res.ok) {
        setError("Invalid credentials");
      } else {
        // ✅ Use session instead of localStorage for authentication
        router.push(`/dashboard/admin/${session.user.id}`); // ✅ Redirect to dashboard after successful login
      }
    };

    return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-white text-preplycom-black  gap-[67px]  ">
      
		{/* Logo Section */}
		<div className="flex justify-center items-center w-[228px]">
		  <Image src="/Final Assign Tutor logo 1.png" width={688} height={50} alt="Logo" />
		</div>
  
		{/* Login Section */}
		<div className="flex flex-col items-center">
		  {/* Welcome Text */}
		  <h2 className="text-[30px] font-bold font-inter">Welcome Back!</h2>
  
		  {/* Login Form */}
		  <form onSubmit={handleLogin} className="w-80 mt-6 flex flex-col gap-4">
			{error && <p className="text-red-500">{error}</p>}
  
			{/* Email Input */}
			<input
			  type="email"
			  placeholder="Enter Your Email"
			  value={email}
			  onChange={(e) => setEmail(e.target.value)}
			  className="w-full p-3 border border-gray-300 rounded-lg"
			  required
			/>
  
			{/* Password Input with Toggle Eye Icon */}
			<div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg pr-10"
              required
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-black"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </button>
          	</div>
  
			{/* Login Button */}
			<button type="submit" className="w-full bg-[#27AE60] text-white p-3 rounded-full">
			  Log In
			</button>
  
			{/* Forgot Password */}
			<p
			  className="text-sm text-blue-500 text-center cursor-pointer"
			  onClick={() => router.push("/forgot-password")}
			>
			  Forgot Password?
			</p>
		  </form>
		</div>
		
	  </div>
);
}
