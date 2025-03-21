"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedAmount, setEditedAmount] = useState("");
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [assigningAssignment, setAssigningAssignment] = useState(null);

  // Fetch assignments
  const fetchData = async () => {
    try {
      const res = await fetch("/api/assignments");
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      alert("Failed to load assignments.");
    }
  };

  const fetchTutors = async () => {
    try {
      const response = await fetch("/api/tutors");
      const data = await response.json();
      setTutors(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching tutors:", error);
      setTutors([]); // Fallback to empty array on error
    }
  };

  useEffect(() => {
    fetchData();
    fetchTutors();
  }, []);

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setAssignments(assignments.map(a => a._id === id ? { ...a, status: newStatus } : a));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // Enable inline editing for price
  const handleEditClick = (id, currentAmount) => {
    setEditingId(id);
    setEditedAmount(currentAmount);
  };

  // Save updated amount
  const handleSaveAmount = async (id) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: editedAmount }),
      });
      if (!res.ok) throw new Error("Failed to update amount");

      setAssignments(assignments.map(a => a._id === id ? { ...a, price: { $numberDecimal: editedAmount } } : a));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating amount:", error);
      alert("Failed to update amount.");
    }
  };

  // Handle assignment download
  const handleDownload = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop();
    link.click();
  };

  const handleAssignTutor = async (assignmentId) => {
    if (!selectedTutor) return alert("Please select a tutor");
  
    try {
      const response = await fetch(`/api/assignments/${assignmentId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutor_id: selectedTutor }),
      });
  
      if (!response.ok) throw new Error("Failed to assign tutor");
  
      const updatedAssignment = await response.json(); // Get the updated assignment from API response
  
      // ✅ Update the assignment in state instead of reloading
      setAssignments(
        assignments.map((a) =>
          a._id === assignmentId ? { ...a, assigned_to: updatedAssignment.assignment.assigned_to } : a
        )
      );
  
      setAssigningAssignment(null); // Close the dropdown
      alert("Tutor assigned successfully!");
    } catch (error) {
      console.error("Error assigning tutor:", error);
      alert("Failed to assign tutor.");
    }
  };
  

  return (
        <div className="bg-gray-100 min-h-screen">
          {/* Navbar */}
          <AdminNavbar />
    
          {/* Main Content with Sidebar and Dashboard Section */}
          <div className="flex gap-6 p-6">
            {/* Sidebar */}
            <div className="w-60">
              <AdminSidebar />
            </div>
    

      <div className="flex-1 bg-white shadow-md rounded-lg p-6 text-black font-inter">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Assignment Title</th>
              <th className="border px-4 py-2">Student Name</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Payment Status</th>
              <th className="border px-4 py-2">Assigned To</th>
              <th className="border px-4 py-2">Download</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment._id} className="border">
                <td className="border px-4 py-2">Assignment {assignment._id.slice(-4)}</td>
                <td className="border px-4 py-2">{assignment.student_id?.name || "Unknown"}</td>

                {/* Assignment Status Dropdown */}
                <td className="border px-4 py-2">
                  <select
                    className="border p-1 rounded"
                    value={assignment.status}
                    onChange={(e) => handleStatusChange(assignment._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>

                {/* Editable Amount Field */}
                <td className="border px-4 py-2 flex items-center">
                  {editingId === assignment._id ? (
                    <input
                      type="number"
                      value={editedAmount}
                      onChange={(e) => setEditedAmount(e.target.value)}
                      className="border p-1 w-16"
                    />
                  ) : (
                    <span>₹{assignment.price?.$numberDecimal || "0"}</span>
                  )}

                  {editingId === assignment._id ? (
                    <button
                      className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm"
                      onClick={() => handleSaveAmount(assignment._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      onClick={() => handleEditClick(assignment._id, assignment.price?.$numberDecimal)}
                    >
                      Edit
                    </button>
                  )}
                </td>

                {/* Payment Status */}
                <td className="border px-4 py-2">{assignment.payment_status}</td>

                {/* Assigned To Logic */}
                <td className="border px-4 py-2">
                    {assignment.assigned_to ? (
                        <span>{assignment.assigned_to.name}</span>
                    ) : assignment.payment_status === "paid" ? (
                        assigningAssignment === assignment._id ? (
                        <div className="flex gap-2">
                            <select className="border px-2 py-1" onChange={(e) => setSelectedTutor(e.target.value)}>
                            <option value="">Select Tutor</option>
                            {Array.isArray(tutors) &&
                                tutors.map((tutor) => (
                                <option key={tutor._id} value={tutor._id}>
                                    {tutor.name}
                                </option>
                                ))}
                            </select>
                            <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleAssignTutor(assignment._id)}>
                            Confirm
                            </button>
                        </div>
                        ) : (
                        <button className="bg-indigo-500 text-white px-2 py-1 rounded text-sm" onClick={() => setAssigningAssignment(assignment._id)}>
                            Assign Tutor
                        </button>
                        )
                    ) : (
                        "Not Assigned"
                    )}
                    </td>


                {/* Download Icon */}
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleDownload(assignment.file_url)}
                  >
                    ⬇ Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
