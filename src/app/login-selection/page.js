"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginSelection() {
  const router = useRouter();

  return (
    <>
    <Navbar />
    <div className="flex flex-row items-center justify-center min-h-screen gap-20">
      <h1 className="text-2xl font-bold mb-6">Login as</h1>
        <div className="flex flex-col items-center gap-4">
            <button
            onClick={() => router.push("/login/student")}
            className="bg-blue-500 text-white px-6 py-2 rounded w-60"
            >
            Login as Student
            </button>
            <button
            onClick={() => router.push("/login/tutor")}
            className="bg-green-500 text-white px-6 py-2 rounded w-60"
            >
            Login as Tutor
            </button>
            {/* <button
            onClick={() => router.push("/login/admin")}
            className="bg-red-500 text-white px-6 py-2 rounded w-60"
            >
            Admin Login
            </button> */}
        </div>
    </div>
    </>
  );
}
