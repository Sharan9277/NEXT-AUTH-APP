"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StudentNavbar from "@/components/StudentNavbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CldUploadWidget } from 'next-cloudinary';
import Topbar from "@/components/Topbar";
import { PlusCircle, Download, Edit2, Check, AlertCircle, X } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  // Fetch student assignments
  useEffect(() => {
    if (session?.user?.id) {
      fetchAssignments();
    }
  }, [session]);
  
  const fetchAssignments = async () => {
    try {
      if (!session?.user?.id) {
        showNotificationMessage("User not logged in or User ID missing.", "error");
        return;
      }
  
      const res = await fetch(`/api/students/${session.user.id}/assignments`);
      if (!res.ok) throw new Error("Failed to fetch assignments");
  
      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      showNotificationMessage("Failed to load assignments.", "error");
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
      showNotificationMessage("Assignment updated successfully!", "success");
    } catch (error) {
      console.error("Error updating assignment:", error);
      showNotificationMessage("Failed to update assignment.", "error");
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
      showNotificationMessage("Please upload a file before submitting.", "error");
      return;
    }

    if (!name || !email || !description) {
      showNotificationMessage("Please fill in all fields.", "error");
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
      showNotificationMessage("Assignment submitted successfully!", "success");
      setIsOpen(false);
      setName("");
      setEmail("");
      setDescription("");
      setFileUrl(null);
      fetchAssignments(); // Refresh the list
    } catch (error) {
      showNotificationMessage("Submission failed: " + error.message, "error");
    }
    setLoading(false);
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  // Filter assignments by status and search query
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-500";
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <StudentNavbar />
      <Topbar page="Assignments" />

      {/* Notification */}
      {showNotification && (
        <div className={`fixed top-20 right-4 max-w-sm p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
          notificationType === "success" ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"
        }`}>
          {notificationType === "success" ? 
            <Check className="text-green-500 w-5 h-5" /> : 
            <AlertCircle className="text-red-500 w-5 h-5" />
          }
          <p className={`text-sm ${notificationType === "success" ? "text-green-700" : "text-red-700"}`}>
            {notificationMessage}
          </p>
          <button onClick={() => setShowNotification(false)} className="ml-auto">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">My Assignments</h2>
              <p className="text-gray-500 mt-1">Manage and track your academic tasks</p>
            </div>
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsOpen(true)}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              <span>New Assignment</span>
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <input
                type="text"
                placeholder="Search assignments..."
                className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <select
                className="p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Assignments List */}
          <div className="p-0 sm:p-0">
            {assignments.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Assignments yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new assignment.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Submit New Assignment
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 bg-gray-50 border-y border-gray-200">
                      <th className="px-4 py-3 font-medium">Assignment Title</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Assigned Tutor</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Download</th>
                      <th className="px-4 py-3 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                      <tr key={assignment._id} className="hover:bg-gray-50 transition duration-150">
                        {/* Title */}
                        <td className="px-4 py-4">
                          {editingId === assignment._id ? (
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-black"
                            />
                          ) : (
                            <div className="font-medium text-gray-900">{assignment.title}</div>
                          )}
                        </td>
                        
                        {/* Description */}
                        <td className="px-4 py-4 max-w-xs">
                          {editingId === assignment._id ? (
                            <textarea
                              value={editedDescription}
                              onChange={(e) => setEditedDescription(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-black"
                              rows="2"
                            />
                          ) : (
                            <div className="text-sm text-gray-500 truncate">{assignment.description}</div>
                          )}
                        </td>
                        
                        {/* Price */}
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">₹{assignment.price?.$numberDecimal || "0.00"}</div>
                          {parseFloat(assignment.price?.$numberDecimal || 0) > 0 && (
                            <button
                              className="mt-1 text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full hover:bg-green-200 transition"
                              onClick={() => handlePayment(assignment._id)}
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                        
                        {/* Tutor */}
                        <td className="px-4 py-4">
                          {assignment.assigned_to ? (
                            <div 
                              className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                              onClick={() => router.push(`/tutor/${assignment.assigned_to._id}`)}
                            >
                              {assignment.assigned_to.name}
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Not Assigned
                            </span>
                          )}
                        </td>
                        
                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusBadgeClass(assignment.status)}`}>
                            {assignment.status === "in_progress" ? "In Progress" : 
                             assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                        </td>
                        
                        {/* Download */}
                        <td className="px-4 py-4">
                          <button
                            className="flex items-center justify-center p-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            onClick={() => handleDownload(assignment.file_url)}
                          >
                            <Download className="w-4 h-4 text-gray-600" />
                            <span className="ml-1 text-xs text-gray-600">Download</span>
                          </button>
                        </td>
                        
                        {/* Actions */}
                        <td className="px-4 py-4 text-center">
                          {editingId === assignment._id ? (
                            <button
                              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                              onClick={() => handleSaveAssignment(assignment._id)}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Assignment Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-semibold text-white">Submit New Assignment</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Description</label>
                  <textarea
                    placeholder="Please provide details about your assignment..."
                    className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Assignment File</label>
                  <CldUploadWidget
                    signatureEndpoint="/api/sign-cloudinary-params"
                    onSuccess={(result, { widget }) => {
                      setFileUrl(result?.info.secure_url);
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
                        <button 
                          onClick={handleOnClick} 
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <PlusCircle className="w-5 h-5 mr-2 text-gray-400" />
                          Upload File
                        </button>
                      );
                    }}
                  </CldUploadWidget>
                  
                  {fileUrl && (
                    <div className="mt-2 text-sm text-green-600 flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      File uploaded successfully!
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Assignment"}
                </button>
                <button 
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}