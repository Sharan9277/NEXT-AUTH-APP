"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function TutorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
    const { data: session, status } = useSession();
    
	useEffect(() => {
		if (status === "loading") return; // ✅ Wait for session to load before checking
		if (session?.user?.id) {
		  router.push(`/dashboard/tutor/${session.user.id}`); // ✅ Redirect to dynamic ID
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
	
		if (res?.error) {
		  setError("Invalid credentials");
		} else {
		  // ✅ Fetch user details from session after login
		  const response = await fetch("/api/auth/session");
		  const sessionData = await response.json();
	
		  if (sessionData?.user?.id) {
			router.push(`/dashboard/tutor/${sessionData.user.id}`);
		  } else {
			setError("Failed to retrieve user ID");
		  }
		}
	  };
	

 return (
	 <>
	   <Navbar />
	   <div className="w-full bg-white relative flex flex-col items-center justify-center text-center text-base text-preplycom-black font-inter p-4 md:p-16">
		 <div className="w-full max-w-md md:max-w-2xl rounded-2xl flex flex-col items-center justify-center py-0 px-4 md:px-8 box-border gap-6 md:gap-8">
		   <div className="self-stretch overflow-hidden flex flex-col items-center justify-center gap-4 text-2xl md:text-4xl">
			 <b className="self-stretch relative leading-[120%]">Sign In</b>
			 <div
			   className="self-stretch relative text-sm md:text-lg [text-decoration:underline] leading-[150%] cursor-pointer"
			   onClick={() => router.push("/signup/tutor")}
			 >
			   Don't Have An Account?
			 </div>
		   </div>
		   <div className="self-stretch flex flex-col items-center justify-center gap-5 text-left text-midnightblue-100">
			 <form
			   onSubmit={handleLogin}
			   className="self-stretch flex flex-col items-center justify-start gap-6"
			 >
			   {error && <p className="text-red-500">{error}</p>}

			   
			   <input
				 type="email"
				 placeholder="Enter Your Email"
				 value={email}
				 onChange={(e) => setEmail(e.target.value)}
				 className="self-stretch rounded-lg border-midnightblue-200 border-[1px] border-solid flex flex-row items-center justify-start p-3"
				 required
			   />
			   <input
				 type="password"
				 placeholder="Enter Your Password"
				 value={password}
				 onChange={(e) => setPassword(e.target.value)}
				 className="self-stretch rounded-lg border-midnightblue-200 border-[1px] border-solid box-border h-[50px] flex flex-row items-center justify-start py-2 px-3"
				 required
			   />
			   <div className="self-stretch flex flex-row items-start justify-center text-[14px] text-midnightblue-200">
				 <div className="flex-1 rounded flex flex-row items-center justify-start gap-2">
				   <input type="checkbox" id="rememberMe" className="w-6 h-6" />
				   <label htmlFor="rememberMe" className="relative leading-[150%]">
					 Remember me
				   </label>
				 </div>
			   </div>
			   <div className="self-stretch rounded-full bg-at-button-light border-at-button-light border-[1px] border-solid flex flex-row items-center justify-center py-3 px-8">
				 <button type="submit" className="relative leading-[150%]">
				   Sign In
				 </button>
			   </div>
			 </form>
			 <div className="self-stretch flex flex-col items-center justify-center gap-5 text-white">
			   <div className="self-stretch flex flex-row items-center justify-center gap-2 text-at-blue-again">
				 <div className="w-[189.5px] relative border-at-blue-again border-t-[1px] border-solid box-border h-px" />
				 <div className="relative leading-[150%] text-center">
				   or continue with
				 </div>
				 <div className="w-[189.5px] relative border-at-blue-again border-t-[1px] border-solid box-border h-px" />
			   </div>
			   <div className="self-stretch rounded-[56px] flex flex-col md:flex-row items-center justify-center gap-4 text-preplycom-black">
				 <button
				   onClick={() => signIn("google")}
				   className="flex-1 rounded-full border-preplycom-black border-[1px] border-solid flex flex-row items-center justify-center py-3 px-8 gap-3"
				 >
				   <Image
					 className="w-6 relative h-6 overflow-hidden shrink-0"
					 width={24}
					 height={24}
					 alt=""
					 src="/google.svg"
				   />
				   <div className="relative leading-[150%]">Google</div>
				 </button>
				 <button
				   onClick={() => signIn("facebook")}
				   className="flex-1 rounded-full border-preplycom-black border-[1px] border-solid flex flex-row items-center justify-center py-3 px-8 gap-3"
				 >
				   <Image
					 className="w-6 relative h-6 overflow-hidden shrink-0"
					 width={24}
					 height={24}
					 alt=""
					 src="/facebook.svg"
				   />
				   <div className="relative leading-[150%]">Facebook</div>
				 </button>
				 <button
				   onClick={() => signIn("apple")}
				   className="flex-1 rounded-full border-preplycom-black border-[1px] border-solid flex flex-row items-center justify-center py-3 px-8 gap-3"
				 >
				   <Image
					 className="w-6 relative h-6 overflow-hidden shrink-0"
					 width={24}
					 height={24}
					 alt=""
					 src="/apple.svg"
				   />
				   <div className="w-11 relative leading-[150%] inline-block shrink-0">
					 Apple
				   </div>
				 </button>
			   </div>
			 </div>
		   </div>
		   <div className="flex flex-col items-center justify-center text-center text-sm md:text-base">
			 <div className="relative leading-[150%]">
			   By clicking Sign In or Continue with, you agree to AssignTutors
			 </div>
			 <div className="flex flex-wrap items-center justify-center gap-1.5">
			   <b className="relative [text-decoration:underline] leading-[150%] cursor-pointer">
				 Terms of Use,
			   </b>
			   <div className="relative leading-[150%]">including</div>
			   <b className="relative [text-decoration:underline] leading-[150%] cursor-pointer">
				 Subscription Terms
			   </b>
			   <div className="relative leading-[150%]">and</div>
			   <b className="relative [text-decoration:underline] leading-[150%] cursor-pointer">
				 Privacy Policy
			   </b>
			 </div>
		   </div>
		 </div>
	   </div>
	   <Footer />
	 </>
   );
}
