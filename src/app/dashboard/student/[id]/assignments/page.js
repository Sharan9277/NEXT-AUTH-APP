"use client";
import { useEffect, useState } from "react";
import { useSession} from "next-auth/react";
import StudentNavbar from "@/components/StudentNavbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CldUploadWidget } from 'next-cloudinary';
import Topbar from "@/components/Topbar";

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resource, setResource] = useState();

  // Fetch student assignments
  useEffect(() => {
    console.log("Session Data:", session); // Debugging
    if (session?.user?.id) {
      fetchAssignments();
    }
  }, [session]);
  
  const fetchAssignments = async () => {
    try {
      if (!session?.user?.id) {
        console.error("User not logged in or User ID missing.");
        return;
      }
  
      const res = await fetch(`/api/students/${session.user.id}/assignments`);
      if (!res.ok) throw new Error("Failed to fetch assignments");
  
      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      alert("Failed to load assignments.");
    }
  };
  

  // Enable Editing Mode
  const handleEditClick = (assignment) => {
    setEditingId(assignment._id);
    setEditedTitle(assignment.title);
    setEditedDescription(assignment.description);
  };

  // Save Edited Assignment Details
  const handleSaveAssignment = async (id) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editedTitle, description: editedDescription }),
      });
      if (!res.ok) throw new Error("Failed to update assignment");

      setAssignments(assignments.map(a => 
        a._id === id ? { ...a, title: editedTitle, description: editedDescription } : a
      ));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert("Failed to update assignment.");
    }
  };

  // Handle Payment (Redirect to Payment Page)
  const handlePayment = (assignmentId) => {
    router.push(`/student/payment/${assignmentId}`);
  };

  // Handle File Download
  const handleDownload = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop();
    link.click();
  };

  const handleSubmit = async () => {
    if (!fileUrl) {
      alert("Please upload a file before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/assignments", {
        name,
        email,
        description,
        file_url: fileUrl,
      });
      alert("Assignment submitted successfully!");
      setIsOpen(false);
      setName("");
      setEmail("");
      setDescription("");
      setFileUrl(null);
    } catch (error) {
      alert("Submission failed: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <StudentNavbar />
      <Topbar page="Assignments" />

      {/* Main Content */}
      <div className="flex flex-col p-6">
        <h2 className="text-2xl font-bold text-black mb-4">My Assignments</h2>

        {assignments.length === 0 ? (
  <div className="text-center p-4">
    <p className="text-gray-500">No Assignments yet.</p>
    
    <button
      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      onClick={() => setIsOpen(true)}
    >
      Want to upload one?
    </button>
  </div>
) : (
  <table className="w-full border-collapse bg-white shadow-md rounded-lg">
    <thead>
      <tr className="bg-gray-200 text-black">
        <th className="border px-4 py-2">Assignment Title</th>
        <th className="border px-4 py-2">Description</th>
        <th className="border px-4 py-2">Price</th>
        <th className="border px-4 py-2">Assigned Tutor</th>
        <th className="border px-4 py-2">Status</th>
        <th className="border px-4 py-2">Download</th>
        <th className="border px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
            {assignments.map((assignment) => (
                <tr key={assignment._id} className="border">
                {/* Editable Assignment Title */}
                <td className="border px-4 py-2 text-black text-center align-middle">
                    {editingId === assignment._id ? (
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="border p-1 w-full text-black"
                    />
                    ) : (
                    <span>{assignment.title}</span>
                    )}
                </td>

                {/* Editable Assignment Description */}
                <td className="border px-4 py-2 text-black text-center align-middle">
                    {editingId === assignment._id ? (
                    <input
                        type="text"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="border p-1 w-full text-black"
                    />
                    ) : (
                    <span>{assignment.description}</span>
                    )}
                </td>

                {/* Assignment Price & Payment */}
                <td className="border px-4 py-2 text-black text-center align-middle">
                    ₹{assignment.price?.$numberDecimal || "0.00"}
                    {parseFloat(assignment.price?.$numberDecimal) > 0 && (
                    <button
                        className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm text-black"
                        onClick={() => handlePayment(assignment._id)}
                    >
                        Pay Now
                    </button>
                    )}
                </td>

                {/* Assigned Tutor */}
                <td className="border px-4 py-2 text-black text-center align-middle">
                    {assignment.assigned_to ? (
                    <button
                        className="text-blue-500 underline"
                        onClick={() => router.push(`/tutor/${assignment.assigned_to._id}`)}
                    >
                        {assignment.assigned_to.name}
                    </button>
                    ) : (
                    <span className="text-gray-500">Not Assigned</span>
                    )}
                </td>

                {/* Assignment Status */}
                <td className="border px-4 py-2 text-center align-middle">
                    <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                        assignment.status === "pending"
                        ? "bg-yellow-500"
                        : assignment.status === "completed"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                    >
                    {assignment.status}
                    </span>
                </td>

                {/* Download Assignment */}
                <td className="border px-4 py-2 text-center align-middle">
                    <button
                    className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleDownload(assignment.file_url)}
                    >
                    ⬇ Download
                    </button>
                </td>

                {/* Actions: Edit & Save */}
                <td className="border px-4 py-2 text-center align-middle">
                    {editingId === assignment._id ? (
                    <button
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                        onClick={() => handleSaveAssignment(assignment._id)}
                    >
                        Save
                    </button>
                    ) : (
                    <button
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                        onClick={() => handleEditClick(assignment)}
                    >
                        Edit
                    </button>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        )}

      </div>
                  {/* Popup Form */}
                  {isOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Submit Your Assignment</h2>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 mb-3 border rounded-md text-black"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-3 border rounded-md text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full p-2 mb-3 border rounded-md text-black"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
      
                  {/* Cloudinary Upload Widget */}
                  <CldUploadWidget
                  signatureEndpoint="/api/sign-cloudinary-params"
                  onSuccess={(result, { widget }) => {
                    setFileUrl(result?.info.secure_url);  // { public_id, secure_url, etc }
                  }}
                  onQueuesEnd={(result, { widget }) => {
                    widget.close();
                  }}
                >
                  {({ open }) => {
                    function handleOnClick() {
                      setResource(undefined);
                      open();
                    }
                    return (
                      <button onClick={handleOnClick} className="w-full bg-[#ed6c43] text-white py-2 rounded-md hover:bg-deepblue transition mt-3">
                        Upload an Image
                      </button>
                    );
                  }}
                </CldUploadWidget>
      
      
                  {fileUrl && (
                    <p className="text-sm text-green-600">File uploaded successfully!</p>
                  )}
      
                  <button
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition mt-3"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                  <button className="w-full mt-2 text-red-500" onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
    </div>
  );
}
