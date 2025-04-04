"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import TutorNavbar from "@/components/TutorNavbar";
import { CldUploadWidget } from "next-cloudinary";
import { Download, PlusCircle, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function TutorAssignments() {
  const { data: session } = useSession();
  const [tutor, setTutor] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [solutionUrl, setSolutionUrl] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchTutor = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/tutors?email=${session.user.email}`);
          const data = await res.json();
          if (data.length > 0) {
            setTutor(data[0]);
            fetchAssignments(data[0]._id);
          }
        } catch (error) {
          console.error("Error fetching tutor data:", error);
        }
      }
    };
    fetchTutor();
  }, [session]);

  const fetchAssignments = async (tutorId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tutors/${tutorId}/assignments`);
      const data = await res.json();
      setAssignments(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedAssignment(null);
  };

  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setSolutionUrl("");
    setSubmitSuccess(false);
    setSubmitError("");
  };

  const handleSubmitSolution = async () => {
    if (!solutionUrl || !selectedAssignment) return;

    try {
      setSubmitLoading(true);
      const res = await fetch(`/api/assignments/${selectedAssignment._id}/solution`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solution_url: solutionUrl,
          status: "completed",
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        fetchAssignments(tutor._id); // Refresh assignments
        setTimeout(() => {
          setSelectedAssignment(null);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        const error = await res.json();
        setSubmitError(error.message || "Failed to submit solution");
      }
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (activeTab === "pending") {
      return assignment.status === "accepted";
    } else if (activeTab === "completed") {
      return assignment.status === "completed";
    }
    return false;
  });

  const handleDownload = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop();
    link.click();
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Progress</span>;
      case "completed":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F1f1f1]">
      <Sidebar active="My Assignments" />
      <div className="flex-1">
        <TutorNavbar />
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Assignments</h1>
            <p className="text-gray-600">Manage your assigned tasks and submit solutions</p>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex border-b">
              <button
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === "pending" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                }`}
                onClick={() => handleTabChange("pending")}
              >
                In Progress
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === "completed" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                }`}
                onClick={() => handleTabChange("completed")}
              >
                Completed
              </button>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredAssignments.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No assignments found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === "pending"
                      ? "You don't have any pending assignments at the moment."
                      : "You haven't completed any assignments yet."}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAssignments.map((assignment) => (
                    <div
                      key={assignment._id}
                      className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all ${
                        selectedAssignment?._id === assignment._id ? "border-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => handleSelectAssignment(assignment)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-medium truncate flex-1">{assignment.description || "Assignment"}</div>
                        {getStatusBadge(assignment.status)}
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Submitted:</span>{" "}
                        {format(new Date(assignment.createdAt), "MMM d, yyyy")}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        <span className="font-medium">Price:</span> ${parseFloat(assignment.price.$numberDecimal).toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={assignment.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                          onClick={() => handleDownload(assignment.file_url)}
                        >
                          <Download className="w-3 h-3" /> Download
                        </a>
                        {assignment.status === "completed" && (
                          <div className="text-xs flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Submitted
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedAssignment && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Submit Solution</h2>
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">Assignment Details</h3>
                <p className="text-gray-600 mb-2">{selectedAssignment.description || "No description provided"}</p>
                <div className="flex items-center gap-2 mb-4">
                  <a
                    href={selectedAssignment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                    onClick={() => handleDownload(selectedAssignment.file_url)}
                  >
                    <Download className="w-4 h-4" /> Download Assignment File
                  </a>
                </div>
              </div>

              {selectedAssignment.status !== "completed" ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Solution</label>
                    {solutionUrl ? (
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>File uploaded successfully</span>
                      </div>
                    ) : (
                      <CldUploadWidget
                        signatureEndpoint="/api/sign-cloudinary-params"
                        onSuccess={(result, { widget }) => {
                          setSolutionUrl(result?.info.secure_url);
                        }}
                        onQueuesEnd={(result, { widget }) => {
                          widget.close();
                        }}
                      >
                        {({ open }) => {
                          function handleOnClick() {
                            open();
                          }
                          return (
                            <button
                              onClick={handleOnClick}
                              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <PlusCircle className="w-5 h-5 mr-2 text-gray-400" />
                              Upload Solution File
                            </button>
                          );
                        }}
                      </CldUploadWidget>
                    )}
                  </div>

                  {submitError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5" />
                      {submitError}
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5" />
                      Solution submitted successfully!
                    </div>
                  )}

                  <button
                    onClick={handleSubmitSolution}
                    disabled={!solutionUrl || submitLoading}
                    className={`w-full py-2 px-4 rounded-md font-medium ${
                      !solutionUrl || submitLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {submitLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Solution"
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-md text-green-700">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-medium">Solution already submitted</span>
                  </div>
                  <p className="text-sm">
                    You have already completed this assignment. Check the Completed tab to review your submission.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}