"use client";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import StudentNavbar from "@/components/StudentNavbar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

const settingsOptions = [
  { key: "account", label: "Account" },
  { key: "password", label: "Password" },
  { key: "email", label: "Email" },
  { key: "payment_methods", label: "Payment Methods" },
  { key: "payment_history", label: "Payment History" },
  { key: "calendar", label: "Calendar" },
  { key: "notification", label: "Notification" },
  { key: "delete_account", label: "Delete Account" },
];

export default function StudentSettings() {
  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState("account");

  // ✅ Redirect if user is not authenticated or not a student
  if (!session) {
    return <p className="text-center mt-10">Please log in to access settings.</p>;
  }
  if (session.user.role !== "student") {
    return <p className="text-center mt-10">Access Denied. Only students can access this page.</p>;
  }

  return (
    <div className="flex flex-col h-auto bg-white">
      <StudentNavbar />
      <Topbar page="Settings" />
      <div className="flex justify-center  px-[344px] py-[48px]">
        {/* ✅ Left Column: Settings Menu */}
        <div className="w-[200px] h-[328px] bg-white  pt-[8px] text-black">
          <ul className="gap-4 pl-[8px]">
            {settingsOptions.map((option) => (
              <li
                key={option.key}
                className={`cursor-pointer h-[32px] rounded-md flex items-center ${
                  selectedSection === option.key ? "pl-[16px] border-solid rounded-none border-[#ED6C43] border-l-[4px] text-black" : "pl-[16px] hover:text-black"
                }`}
                onClick={() => setSelectedSection(option.key)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Right Column: Selected Section Content */}
        <div className="w-[500px] h-auto p-6 bg-white text-black ml-6">
          {selectedSection === "account" && <AccountSettings />}
          {selectedSection === "password" && <PasswordSettings />}
          {selectedSection === "email" && <EmailSettings />}
          {selectedSection === "payment_methods" && <PaymentMethods />}
          {selectedSection === "payment_history" && <PaymentHistory />}
          {selectedSection === "calendar" && <CalendarSettings />}
          {selectedSection === "notification" && <NotificationSettings />}
          {selectedSection === "delete_account" && <DeleteAccount />}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

// ✅ Individual Settings Components

function AccountSettings() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
      profile_image: "",
      name: "",
      phone: "",
      timezone: "UTC",
      facebook_connected: false,
      google_connected: false,
    });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchAccountDetails = async () => {
        try {
          const res = await fetch(`/api/students/${session?.user?.id}`);
          const data = await res.json();
          setFormData({
            profile_image: data.profile_image || "",
            name: data.name || "",
            phone: data.phone || "",
            timezone: data.timezone || "UTC",
            facebook_connected: data.facebook_connected || false,
            google_connected: data.google_connected || false,
          });
          setLoading(false);
        } catch (error) {
          console.error("Error fetching account details:", error);
          setLoading(false);
        }
      };
  
      if (session?.user?.id) {
        fetchAccountDetails();
      }
    }, [session]);
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
  
      try {
        const res = await fetch(`/api/students/${session?.user?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setSuccess("Profile updated successfully!");
        } else {
          setError(data.message || "Failed to update profile.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        setError("Something went wrong. Please try again.");
      }
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, profile_image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleSocialConnect = async (platform) => {
      // ✅ Simulate social connection toggle
      setFormData((prev) => ({
        ...prev,
        [`${platform}_connected`]: !prev[`${platform}_connected`],
      }));
    };
  
    if (loading) return <p>Loading account details...</p>;
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Account Settings</h2>
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
  
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* ✅ Profile Image Upload */}
          <div className="flex flex-col items-center">
            <Image
              src={formData.profile_image || "/default-avatar.png"}
              width={100}
              height={100}
              alt="Profile"
              className="rounded-full border"
            />
            <input type="file" onChange={handleFileChange} className="mt-2" />
          </div>
  
          {/* ✅ Name */}
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
  
          {/* ✅ Phone */}
          <div>
            <label className="block font-semibold">Phone</label>
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
  
          {/* ✅ Timezone Selection */}
          <div>
            <label className="block font-semibold">Timezone</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="CST">CST</option>
              <option value="MST">MST</option>
              <option value="PST">PST</option>
            </select>
          </div>
  
          {/* ✅ Social Media Connections */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Social Networks</h3>
  
            {/* Facebook Connect */}
            <div className="flex items-center justify-between mt-2">
              <span>Facebook</span>
              <button
                type="button"
                onClick={() => handleSocialConnect("facebook")}
                className={`px-4 py-2 rounded ${
                  formData.facebook_connected ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                }`}
              >
                {formData.facebook_connected ? "Disconnect" : "Connect"}
              </button>
            </div>
  
            {/* Google Connect */}
            <div className="flex items-center justify-between mt-2">
              <span>Google</span>
              <button
                type="button"
                onClick={() => handleSocialConnect("google")}
                className={`px-4 py-2 rounded ${
                  formData.google_connected ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                }`}
              >
                {formData.google_connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
  
          {/* ✅ Save Button */}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            Save Changes
          </button>
        </form>
      </div>
    );
  }

function PasswordSettings() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
  
    const handleUpdatePassword = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
  
      if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
        setError("All fields are required.");
        return;
      }
  
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match.");
        return;
      }
  
      try {
        const res = await fetch(`/api/students/${session?.user?.id}/password`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPassword: formData.oldPassword, newPassword: formData.newPassword }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setSuccess("Password updated successfully!");
          setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } else {
          setError(data.message || "Failed to update password.");
        }
      } catch (error) {
        console.error("Error updating password:", error);
        setError("Something went wrong. Please try again.");
      }
    };
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
  
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block font-semibold">Current Password</label>
            <input
              type="password"
              className="border p-2 w-full rounded"
              value={formData.oldPassword}
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              required
            />
          </div>
  
          <div>
            <label className="block font-semibold">New Password</label>
            <input
              type="password"
              className="border p-2 w-full rounded"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
            />
          </div>
  
          <div>
            <label className="block font-semibold">Confirm New Password</label>
            <input
              type="password"
              className="border p-2 w-full rounded"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
  
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Update Password
          </button>
        </form>
      </div>
    );
}

function EmailSettings() {
    const { data: session, update } = useSession();
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
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Change Email</h2>
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
  
        <p className="mb-4">Current Email: <span className="font-semibold">{session?.user?.email}</span></p>
  
        {!otpSent ? (
          <div>
            <label className="block font-semibold">New Email</label>
            <input
              type="email"
              className="border p-2 w-full rounded"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleSendOTP}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 w-full"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block font-semibold">Enter OTP</label>
              <input
                type="text"
                className="border p-2 w-full rounded"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
  
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
              Verify OTP & Update Email
            </button>
          </form>
        )}
      </div>
    );
  }

function PaymentMethods() {
  return <p className="text-lg">Manage your payment methods.</p>;
}

function PaymentHistory() {
  return <p className="text-lg">View your payment history.</p>;
}

function CalendarSettings() {

  const { data: session } = useSession();
  const [bookedDays, setBookedDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/students/${session?.user?.id}/bookings/calendar`);
        const data = await res.json();
        if (res.ok) {
          setBookedDays(data.bookings || []);
        }
      } catch (error) {
        console.error("Error fetching booked lessons:", error);
      }
    };

    if (session?.user?.id) {
      fetchBookings();
    }
  }, [session]);

  // ✅ Generate calendar days for the current month
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null); // Empty slots for alignment
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(currentYear, currentMonth, i);
      const dayIndex = dateObj.getDay(); // 0 = Sunday, 6 = Saturday

      // ✅ Check if this day index matches any confirmed booking
      const isBooked = bookedDays.some((lesson) => lesson.dayIndex === dayIndex && lesson.status === "Confirmed");

      days.push({ date: i, booked: isBooked });
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Calendar</h2>
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="bg-gray-300 px-3 py-1 rounded">◀</button>
        <h3 className="text-lg font-semibold">
          {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
        <button onClick={handleNextMonth} className="bg-gray-300 px-3 py-1 rounded">▶</button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 border-t border-gray-300 pt-4 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-bold">{day}</div>
        ))}

        {generateCalendar().map((day, index) =>
          day ? (
            <div
              key={index}
              className={`p-4 rounded ${
                day.booked ? "bg-green-500 text-white font-bold" : "bg-gray-100"
              }`}
            >
              {day.date}
            </div>
          ) : (
            <div key={index}></div>
          )
        )}
      </div>
    </div>
  );
}

function NotificationSettings() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    email_notifications: true,
    push_notifications: false,
    lesson_reminders: true,
    promotional_emails: false,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const res = await fetch(`/api/students/${session?.user?.id}/notifications`);
        const data = await res.json();
        setFormData({
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? false,
          lesson_reminders: data.lesson_reminders ?? true,
          promotional_emails: data.promotional_emails ?? false,
        });
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      }
    };

    if (session?.user?.id) {
      fetchNotificationSettings();
    }
  }, [session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/students/${session?.user?.id}/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Notification settings updated successfully!");
      } else {
        setError(data.message || "Failed to update settings.");
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* ✅ Email Notifications */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.email_notifications}
            onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })}
          />
          <label className="font-semibold">Receive Email Notifications</label>
        </div>

        {/* ✅ Push Notifications */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.push_notifications}
            onChange={(e) => setFormData({ ...formData, push_notifications: e.target.checked })}
          />
          <label className="font-semibold">Enable Push Notifications</label>
        </div>

        {/* ✅ Lesson Reminders */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.lesson_reminders}
            onChange={(e) => setFormData({ ...formData, lesson_reminders: e.target.checked })}
          />
          <label className="font-semibold">Send Lesson Reminders</label>
        </div>

        {/* ✅ Promotional Emails */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.promotional_emails}
            onChange={(e) => setFormData({ ...formData, promotional_emails: e.target.checked })}
          />
          <label className="font-semibold">Receive Promotional Emails</label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}


function DeleteAccount() {

  const { data: session } = useSession();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/students/${session?.user?.id}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account deleted successfully. Redirecting...");
        setTimeout(() => {
            router.push("/login/student/");
        }, 2000);
      } else {
        setError(data.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-red-600">Delete Account</h2>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <p className="mb-4 text-gray-700">
        Deleting your account is permanent. You will lose access to all your data, including your bookings and wallet balance.
      </p>

      <form onSubmit={handleDeleteAccount} className="space-y-4">
        {/* ✅ Password Confirmation */}
        <div>
          <label className="block font-semibold">Confirm Password</label>
          <input
            type="password"
            className="border p-2 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
        >
          Delete My Account
        </button>
      </form>
    </div>
  );
}
