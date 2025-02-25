"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function StudentSignup(){
  	
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
    
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "student", profile_image }),
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
      <>
      <Navbar/>
    		<div className="w-full bg-white relative flex flex-row items-center justify-center text-center text-base text-preplycom-black font-inter p-16">
      			<div className="w-[765px] rounded-2xl  flex flex-col items-center justify-center py-0 px-[34px] box-border gap-[27px]">
        				<div className="self-stretch overflow-hidden flex flex-col items-center justify-center gap-4 text-[48px]">
          					<b className="self-stretch relative leading-[120%]">Sign Up</b>
          					<div className="self-stretch relative text-[18px] [text-decoration:underline] leading-[150%] cursor-pointer" onClick={() => router.push("/login/student")}>Already Have An Account?</div>
            						</div>
            						<div className="self-stretch flex flex-col items-center justify-center gap-5 text-left text-midnightblue-100">
              							<form onSubmit={handleSignup} className="self-stretch flex flex-col items-center justify-start gap-6">
                            {error && <p className="text-red-500">{error}</p>}
                            {success && <p className="text-green-500">{success}</p>}
                                <div className="self-stretch flex flex-row items-start justify-start gap-6">
                  									<input type="text" placeholder="Enter Your First Name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 rounded-lg border-midnightblue-200 border-[1px] border-solid flex flex-row items-center justify-start p-3" required/>                  									
                                    {/* <input type="text" placeholder="Enter Your Last Name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 rounded-lg border-midnightblue-200 border-[1px] border-solid flex flex-row items-center justify-start p-3" required/>                  									 */}
                								</div>
                								<input type="email" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className="self-stretch rounded-lg border-midnightblue-200 border-[1px] border-solid flex flex-row items-center justify-start p-3" required/>
                							
                                <input type="password" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} className="self-stretch rounded-lg border-midnightblue-200 border-[1px] border-solid box-border h-[50px] flex flex-row items-center justify-start py-2 px-3 gap-[189px]" required/>
                							
                								<div className="self-stretch flex flex-row items-start justify-center text-[14px] text-midnightblue-200">
                                <div className="flex-1 rounded flex flex-row items-center justify-start gap-2">
                                  <input type="checkbox" id="rememberMe" className="w-6 h-6" />
                                  <label htmlFor="rememberMe" className="relative leading-[150%]">Remember me</label>
                                </div>
                              </div>
                                <div className="self-stretch rounded-full bg-at-button-light border-at-button-light border-[1px] border-solid flex flex-row items-center justify-center py-3 px-8">
                  									<button type="submit" className="relative leading-[150%]">Sign Up</button>
                								</div>
              							</form>
              							<div className="self-stretch flex flex-col items-center justify-center gap-5 text-white">
                								<div className="self-stretch flex flex-row items-center justify-center gap-2 text-at-blue-again">
                  									<div className="w-[189.5px] relative border-at-blue-again border-t-[1px] border-solid box-border h-px" />
                  									<div className="relative leading-[150%]">or continue with</div>
                  									<div className="w-[189.5px] relative border-at-blue-again border-t-[1px] border-solid box-border h-px" />
                								</div>
                								<div className="self-stretch rounded-[56px] flex flex-row items-center justify-center gap-4 text-preplycom-black">
                  									<button onClick={() => signIn("google")} className="flex-1 rounded-full border-preplycom-black border-[1px] border-solid flex flex-row items-center justify-center py-3 px-8 gap-3">
                    										<Image className="w-6 relative h-6 overflow-hidden shrink-0" width={24} height={24} alt="" src="/google.svg" />
                    										<div className="relative leading-[150%]">Google</div>
                  									</button>
                  									<button onClick={() => signIn("facebook")} className="flex-1 rounded-full border-preplycom-black border-[1px] border-solid flex flex-row items-center justify-center py-3 px-8 gap-3">
                    										<Image className="w-6 relative h-6 overflow-hidden shrink-0" width={24} height={24} alt="" src="/facebook.svg" />
                    										<div className="relative leading-[150%]">Facebook</div>
                  									</button>
                  									<button onClick={() => signIn("apple")} className="flex-1 rounded-full border-preplycom-black border-[1px] border-solid flex flex-row items-center justify-center py-3 px-8 gap-3">
                    										<Image className="w-6 relative h-6 overflow-hidden shrink-0" width={24} height={24} alt="" src="/apple.svg" />
                    										<div className="w-11 relative leading-[150%] inline-block shrink-0">Apple</div>
                  									</button>
                								</div>
              							</div>
            						</div>
            						<div className="flex flex-col items-center justify-center">
              							<div className="relative leading-[150%]">By clicking Sign Up or Continue with, you agree to AssignTutor</div>
              							<div className="flex flex-row items-center justify-center gap-1.5">
                								<b className="relative [text-decoration:underline] leading-[150%]">Terms of Use,</b>
                								<div className="relative leading-[150%]">including</div>
                								<b className="relative [text-decoration:underline] leading-[150%]">Subscription Terms</b>
                								<div className="relative leading-[150%]">and</div>
                								<b className="relative [text-decoration:underline] leading-[150%]">Privacy Policy</b>
              							</div>
            						</div>
            						</div>
            						</div>
                        <Footer />
                        </>);
          					};
          					