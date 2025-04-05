"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { CldUploadWidget } from 'next-cloudinary';
import { MessageSquare, FileCheck, BookOpen, FileText, PlusCircle, Check } from "lucide-react";

export default function AssignmentHelpFeatures() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState();

  const handleSubmit = async () => {
    if (!fileUrl) {
      alert("Please upload a file before submitting.");
      return;
    }

    if (!name || !email || !description) {
      alert("Please fill in all fields.");
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
    <div className="bg-at-light-orange py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[#1e2859] text-4xl font-bold mb-4">Our Distinctive Features for Assignment Help</h1>
          <p className="text-[#1e2859] max-w-4xl mx-auto">
            India Assignment Help is the best choice among students for all their academic needs as we deliver
            assignment writing services with unparalleled features.
          </p>
        </div>

        <div className="bg-[#fdfdfd] p-8 rounded-lg shadow-md mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 relative">
                <div className="w-20 h-20 flex items-center justify-center">
                  <MessageSquare className="w-16 h-16 text-[#e6a43a] stroke-[1.5]" />
                  <div className="absolute top-1 right-1 bg-white rounded-md px-1 border border-[#e6a43a]">
                    <span className="text-red-500 font-bold text-sm">LIVE</span>
                  </div>
                  <div className="absolute bottom-1 left-4 flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-[#e6a43a]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#e6a43a]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#e6a43a]"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-[#1e2859] text-xl font-bold mb-2">24/7 Live Sessions</h3>
              <p className="text-[#1e2859] text-sm">
                Connect with our online experts any time you want, call or live chat and get instant academic help. We
                are available round the clock for professional assistance and one-to-one sessions in English, Hindi, and
                Punjabi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <div className="w-20 h-20 flex items-center justify-center">
                  <FileCheck className="w-16 h-16 text-[#e6a43a] stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-[#1e2859] text-xl font-bold mb-2">Quality Guarantee</h3>
              <p className="text-[#1e2859] text-sm">
                Each assignment is checked by our quality assurance team before submission. Our experts strictly adhere
                to marking criteria of each and every assignment to ensure the best quality.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <div className="w-20 h-20 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#e6a43a] stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-[#1e2859] text-xl font-bold mb-2">Services for All Subjects</h3>
              <p className="text-[#1e2859] text-sm">
                Stuck with your complex assignment? Get flawless assignment writing services on any subject at any level
                by our subject matter experts. Let us help you achieve the grades you aspire for.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <div className="w-20 h-20 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-[#e6a43a] stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-[#1e2859] text-xl font-bold mb-2">Credible References</h3>
              <p className="text-[#1e2859] text-sm">
                We only use credible academic sources such as peer-reviewed journal articles, books, research articles,
                government websites, and reputed newspapers in our assignments as a reference.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            className="bg-transparent hover:bg-[#1e2859] text-[#1e2859] hover:text-white border-2 border-[#1e2859] rounded-full py-3 px-8 font-medium transition-colors duration-300"
            onClick={() => setIsOpen(true)}
          >
            Place Your Order
          </button>
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