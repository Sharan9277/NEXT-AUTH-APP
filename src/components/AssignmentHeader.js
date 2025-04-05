"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { CldUploadWidget } from 'next-cloudinary';
import { PlusCircle, Check } from "lucide-react";

export default function AssignmentHeader() {
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
      <div 
        className="relative w-full min-h-screen sm:min-h-[800px] md:min-h-[1000px] lg:min-h-[1218px] bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url('/Background_wrapper.png')" }}

      >
      {/* White Box Container */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-[1150px] flex flex-col md:flex-row gap-6">
          
          {/* Left Card */}
          <div className="bg-at-light-orange p-6 rounded-xl w-full md:w-1/2 shadow-md">
            <h2 className="text-[26px] font-inter font-bold mb-4 text-deepblue">We write any type of assignment in any discipline</h2>
            <div>
                <h3 className="text-[16px] font-regular text-black-text">Type of service</h3>
                <select className="w-full p-2 mb-4 border rounded-md text-black">
              <option>Select Option 1</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select></div>
            <div>
                <h3 className="text-[16px] font-regular text-black-text">Type of service</h3>
                <select className="w-full p-2 mb-4 border rounded-md text-black">
              <option>Select Option 1</option>
              <option>Option 1</option>
              <option>Option 2</option>
                </select>
            </div>
            <button className="w-full h-[60px] bg-black text-white text-[14px] py-2 rounded-md hover:bg-gray-800 transition" onClick={() => setIsOpen(true)}>Proceed to book assignment</button>
          </div>

          {/* Right Card */}
          <div className="bg-white p-6 rounded-xl w-full md:w-1/2 relative shadow-md">
            <h2 className="text-[26px] font-inter font-medium mb-4 text-black">How you can get your paper done super fast</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Fill out the order form.</li>
              <li>Pay for your assignment.</li>
              <li>Stay in touch with your expert.</li>
              <li>Download the finished work.</li>
            </ul>
            <div className="absolute bottom-4 right-4 w-24 h-24">
              <Image src="/img_paper-section-top.png" alt="Icon" width={96} height={96} className="rounded-md"/>
            </div>
          </div>

        </div>
      </div>

      {/* Submit Assignment Modal - Updated with improved UI from AssignmentsPage */}
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