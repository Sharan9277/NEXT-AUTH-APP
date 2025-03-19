"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { CldUploadWidget } from 'next-cloudinary';

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
      className="relative w-full min-h-[1218px] bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background wrapper.png')" }}
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
