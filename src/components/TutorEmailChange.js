import { useEffect } from "react";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

function TutorEmailSettings() {
    const { data: session } = useSession();
    const [email, setEmail] = useState(session?.user?.email || "");
    const [newEmail, setNewEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // ✅ Handle sending OTP & checking email uniqueness
    const handleSendOTP = async () => {
        setError("");
        setSuccess("");

        if (!session?.user?.id) {
            setError("User not authenticated.");
            return;
        }

        try {
            const res = await fetch("/api/verify/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: newEmail, 
                    action: "send_otp", 
                    user_id: session.user.id  // ✅ Pass user_id to backend
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setOtpSent(true);
                console.log("✅ OTP Sent:", data.otp);
                setSuccess("OTP sent to your new email. Please check your inbox.");
            } else {
                setError(data.message || "Failed to send OTP.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            setError("Something went wrong. Please try again.");
        }
    };

    // ✅ Handle OTP verification and email update
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!session?.user?.id) {
            setError("User not authenticated.");
            return;
        }

        try {
            const res = await fetch(`/api/verify/email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: newEmail, 
                    verificationCode: otp,
                    user_id: session.user.id 
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Email updated successfully!");
                setEmail(newEmail);
                setNewEmail("");
                setOtp("");
                setOtpSent(false);

                // ✅ Force session refresh by signing in again
                await signIn("credentials", { redirect: false });

            } else {
                setError(data.message || "Failed to update email.");
            }
        } catch (error) {
            console.error("Error updating email:", error);
            setError("Something went wrong. Please try again.");
        }
    };
    
    useEffect(() => {
        if (session?.user?.email) {
            setEmail(session.user.email);
        }
    }, [session, newEmail]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-bold mb-4 text-black font-inter">Change Email</h2>
            <p className="text-gray-700 mb-2 text-sm md:text-base">Current Email: <strong>{email}</strong></p>

            <input 
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
                className="border p-2 w-full rounded mb-2"
            />

            <button 
                onClick={handleSendOTP} 
                disabled={otpSent} 
                className={`w-full p-2 rounded text-white ${otpSent ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
            >
                {otpSent ? "OTP Sent" : "Send OTP"}
            </button>

            {otpSent && (
                <div className="mt-4">
                    <input 
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="border p-2 w-full rounded mb-2"
                    />

                    <button 
                        onClick={handleVerifyOTP} 
                        className="w-full p-2 rounded text-white bg-green-500 hover:bg-green-600"
                    >
                        Verify OTP
                    </button>
                </div>
            )}

            {success && <p className="text-green-600 mt-2 text-sm">{success}</p>}
            {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>
    );
}

export default TutorEmailSettings;