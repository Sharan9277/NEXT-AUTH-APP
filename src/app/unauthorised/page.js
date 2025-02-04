"use client";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
      <p>You don't have permission to access this page.</p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
      >
        Go to Home
      </button>
    </div>
  );
}
