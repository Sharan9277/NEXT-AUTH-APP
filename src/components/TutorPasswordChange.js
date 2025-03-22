import { useState } from "react";

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Handle Password Update
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setLoading(true);

        // Simulating API call delay
        setTimeout(() => {
            setSuccess("Password updated successfully!");
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className=" bg-white shadow-lg rounded-lg p-6 ">
            <h2 className="text-lg font-bold mb-4 text-black font-inter">Change Password</h2>

            {error && <p className="text-red-600 mb-2">{error}</p>}
            {success && <p className="text-green-600 mb-2">{success}</p>}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                    <label className="block font-semibold text-gray-700">Current Password</label>
                    <input
                        type="password"
                        value={formData.oldPassword}
                        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-300"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-300"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold text-gray-700">Confirm New Password</label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-300"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}
