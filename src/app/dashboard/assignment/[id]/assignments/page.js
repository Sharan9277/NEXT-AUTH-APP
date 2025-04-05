"use client";
import { useEffect, useState } from "react";
import AssignmentNavbar from "@/components/AssignmentNavbar";
import AssignmentSidebar from "@/components/AssignmentSidebar";
import { CldUploadWidget } from 'next-cloudinary';
import { PlusCircle, Download, Check, AlertCircle, X } from "lucide-react";
import axios from "axios";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedAmount, setEditedAmount] = useState("");
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [assigningAssignment, setAssigningAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Submit Assignment Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fetch assignments
  const fetchData = async () => {
    try {
      const res = await fetch("/api/assignments");
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      showNotificationMessage("Failed to load assignments.", "error");
    }
  };

  const fetchTutors = async () => {
    try {
      const response = await fetch("/api/tutors");
      const data = await response.json();
      setTutors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      setTutors([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTutors();
  }, []);

  // Show notification message
  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

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
      showNotificationMessage("Status updated successfully!", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      showNotificationMessage("Failed to update status.", "error");
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
      // First update the price in the database
      const patchRes = await fetch(`/api/assignments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: parseFloat(editedAmount) }),
      });
      
      if (!patchRes.ok) throw new Error("Failed to update amount");
  
      // After successful price update, generate payment link and send email
      const paymentRes = await fetch(`/api/assignments/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(editedAmount) }),
      });
  
      if (!paymentRes.ok) throw new Error("Failed to generate payment link");
      const paymentData = await paymentRes.json();
      
      // Update the assignment in state with the correct format
      setAssignments(assignments.map(a => {
        if (a._id === id) {
          return { 
            ...a, 
            price: { $numberDecimal: editedAmount } // Keep the same format in state
          };
        }
        return a;
      }));
      
      setEditingId(null);
      showNotificationMessage("Amount updated and payment link sent to student!", "success");
    } catch (error) {
      console.error("Error updating amount:", error);
      showNotificationMessage("Failed to update amount: " + error.message, "error");
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
    if (!selectedTutor) {
      showNotificationMessage("Please select a tutor", "error");
      return;
    }
  
    try {
      const response = await fetch(`/api/assignments/${assignmentId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutor_id: selectedTutor }),
      });
  
      if (!response.ok) throw new Error("Failed to assign tutor");
  
      const updatedAssignment = await response.json();
  
      setAssignments(
        assignments.map((a) =>
          a._id === assignmentId ? { ...a, assigned_to: updatedAssignment.assignment.assigned_to } : a
        )
      );
  
      setAssigningAssignment(null);
      showNotificationMessage("Tutor assigned successfully!", "success");
    } catch (error) {
      console.error("Error assigning tutor:", error);
      showNotificationMessage("Failed to assign tutor.", "error");
    }
  };

  // Toggle sidebar visibility (for mobile)
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Submit new assignment
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
      fetchData(); // Refresh the list
    } catch (error) {
      showNotificationMessage("Submission failed: " + error.message, "error");
    }
    setLoading(false);
  };

  // Filter assignments based on active tab and search query
  const filteredAssignments = assignments.filter(assignment => {
    // First filter by tab
    const matchesTab = 
      activeTab === "all" ? true :
      activeTab === "accepted" ? assignment.status === "accepted" :
      activeTab === "in-progress" ? assignment.status === "pending" :
      activeTab === "completed" ? assignment.status === "completed" : 
      false;
    
    // Then filter by search if there's a query
    if (!matchesTab) return false;
    
    if (!searchQuery) return true;
    
    // Search in title, student name, or ID
    const assignmentTitle = assignment.title || `Assignment ${assignment._id.slice(-4)}`;
    const studentName = assignment.student_id?.name || "Unknown";
    
    return (
      assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      {/* Navbar */}
      <AssignmentNavbar />
      
      {/* Notification */}

      {showNotification && (
        <div className={`fixed top-20 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
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
      
      {/* Main Content with Sidebar and Dashboard Section */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-6 p-2 md:p-6 relative">
        {/* Mobile Sidebar Toggle Button */}
        {isMobile && (
          <button 
            className="fixed bottom-4 left-4 bg-orange-500 text-white p-3 rounded-full shadow-md"
            onClick={toggleSidebar}
          >
            {showSidebar ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        )}

        {/* Sidebar - Hidden on mobile by default */}
        {showSidebar && (
          <div className={`${isMobile ? 'fixed left-0 top-0 h-full bg-white shadow-lg w-60 transition-all duration-300' : 'w-60'}`}>
            <AssignmentSidebar />
          </div>
        )}
        
        {/* Overlay when mobile sidebar is open */}
        {isMobile && showSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${isMobile && showSidebar ? 'opacity-50' : 'opacity-100'}`}>
          <div className="bg-white shadow-md rounded-lg p-3 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Assignments</h2>
              <button 
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm flex items-center gap-2 justify-center"
                onClick={() => setIsOpen(true)}
              >
                + Add Assignment
              </button>
            </div>
            
            {/* Tabs - Scrollable on mobile */}
            <div className="border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap pb-2">
              <ul className="flex -mb-px min-w-max">
                <li className="mr-6">
                  <button 
                    className={`pb-3 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All Assignments
                  </button>
                </li>
                <li className="mr-6">
                  <button 
                    className={`pb-3 font-medium ${activeTab === 'accepted' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('accepted')}
                  >
                    Accepted
                  </button>
                </li>
                <li className="mr-6">
                  <button
                    className={`pb-3 font-medium ${activeTab === 'in-progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('in-progress')}
                  >
                    In Progress
                  </button>
                </li>
                <li>
                  <button
                    className={`pb-3 font-medium ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Search Bar and Results Count */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-gray-500">
                {filteredAssignments.length} {filteredAssignments.length === 1 ? 'assignment' : 'assignments'} found
              </div>
            </div>
            
            {/* Assignments Table with Responsive Handling */}
            <div className="overflow-x-auto -mx-3 md:mx-0">
              <table className="w-full border-collapse min-w-max md:min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment) => (
                      <tr key={assignment._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 md:py-4 text-xs md:text-sm font-medium text-gray-900">
                          {assignment.title || `Assignment ${assignment._id.slice(-4)}`}
                        </td>
                        <td className="px-4 py-2 md:py-4 text-xs md:text-sm text-gray-500">
                          {assignment.student_id?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-2 md:py-4 text-xs md:text-sm">
                          <select
                            className="border p-1 rounded text-xs md:text-sm bg-white"
                            value={assignment.status}
                            onChange={(e) => handleStatusChange(assignment._id, e.target.value)}
                          >
                            <option value="under_review">Under Review</option>
                            <option value="accepted">Accepted</option>
                            <option value="pending">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 md:py-4 text-xs md:text-sm flex items-center">
                          {editingId === assignment._id ? (
                            <input
                              type="number"
                              value={editedAmount}
                              onChange={(e) => setEditedAmount(e.target.value)}
                              className="border p-1 w-16 md:w-20 text-xs md:text-sm"
                            />
                          ) : (
                            <span>₹{assignment.price?.$numberDecimal || "0"}</span>
                          )}

                          {editingId === assignment._id ? (
                            <button
                              className="ml-1 md:ml-2 bg-green-500 text-white px-1 md:px-2 py-1 rounded text-xs"
                              onClick={() => handleSaveAmount(assignment._id)}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="ml-1 md:ml-2 bg-blue-500 text-white px-1 md:px-2 py-1 rounded text-xs"
                              onClick={() => handleEditClick(assignment._id, assignment.price?.$numberDecimal)}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-2 md:py-4 text-xs md:text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            assignment.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                            assignment.payment_status === 'refunded' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {assignment.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-2 md:py-4 text-xs md:text-sm">
                          {assignment.assigned_to ? (
                            <span>{assignment.assigned_to.name}</span>
                          ) : assignment.payment_status === "paid" ? (
                            assigningAssignment === assignment._id ? (
                              <div className="flex gap-1 md:gap-2 flex-col md:flex-row">
                                <select className="border px-1 md:px-2 py-1 text-xs md:text-sm rounded" onChange={(e) => setSelectedTutor(e.target.value)}>
                                  <option value="">Select Tutor</option>
                                  {Array.isArray(tutors) &&
                                    tutors.map((tutor) => (
                                      <option key={tutor._id} value={tutor._id}>
                                        {tutor.name}
                                      </option>
                                    ))}
                                </select>
                                <button className="bg-green-500 text-white px-1 md:px-2 py-1 rounded text-xs" onClick={() => handleAssignTutor(assignment._id)}>
                                  OK
                                </button>
                              </div>
                            ) : (
                              <button className="bg-indigo-500 text-white px-1 md:px-2 py-1 rounded text-xs" onClick={() => setAssigningAssignment(assignment._id)}>
                                Assign Tutor
                              </button>
                            )
                          ) : (
                            <span className="text-gray-400">Not Assigned</span>
                          )}
                        </td>
                        <td className="px-4 py-2 md:py-4 text-xs md:text-sm space-x-2">
                          <button
                            className="bg-gray-800 text-white px-2 md:px-3 py-1 rounded text-xs flex items-center gap-1 inline-flex"
                            onClick={() => handleDownload(assignment.file_url)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="hidden md:inline">Download</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-xs md:text-sm text-gray-500">
                        No assignments found in this category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination (optional) */}
            {filteredAssignments.length > 0 && (
              <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="text-xs md:text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredAssignments.length}</span> of <span className="font-medium">{assignments.length}</span> assignments
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-2 py-1 border border-gray-300 rounded text-xs md:text-sm disabled:opacity-50">Previous</button>
                  <span className="px-3 py-1 bg-blue-500 text-white rounded text-xs md:text-sm">1</span>
                  <button className="px-2 py-1 border border-gray-300 rounded text-xs md:text-sm disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Assignment Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 bg-orange-500">
              <h2 className="text-xl font-semibold text-white">Add New Assignment</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    placeholder="Student Full Name"
                    className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="student@email.com"
                    className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Description</label>
                  <textarea
                    placeholder="Please provide details about the assignment..."
                    className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
                  className="flex-1 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Add Assignment"}
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