"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";

export default function Contact_Us() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          message: ""
        });
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Contact Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-[48px] fonr-inter font-medium text-gray-900 mb-2">Contact Us</h1>
              <p className="text-gray-600">Call us at +1 800-525-54-589 during our business hours.</p>
              <div className="h-px bg-gray-200 w-full my-6"></div>
            </div>
            
            <div className="flex items-start">
              <MdLocationOn className="text-blue-600 text-xl mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                <p className="text-gray-600">403, Port Washington Road, Canada.</p>
              </div>
            </div>
            
            <div className="h-px bg-gray-200 w-full"></div>
            
            <div className="flex items-start">
              <MdPhone className="text-blue-600 text-xl mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Contact Details</h3>
                <p className="text-gray-600">+1 800-525-54-589</p>
              </div>
            </div>
            
            <div className="h-px bg-gray-200 w-full"></div>
            
            <div className="flex items-start">
              <MdEmail className="text-blue-600 text-xl mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-600">info@wdesignkit.com</p>
              </div>
            </div>
            
            <div className="h-px bg-gray-200 w-full"></div>
            
            <div>
              <div className="flex items-center mb-4">
                <h3 className="font-medium text-gray-900">Follow Us : </h3>
                <div className="flex ml-4 space-x-3">
                  <a href="#" className="h-8 w-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                    <FaFacebook />
                  </a>
                  <a href="#" className="h-8 w-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:text-pink-600 transition-colors">
                    <FaInstagram />
                  </a>
                  <a href="#" className="h-8 w-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:text-blue-400 transition-colors">
                    <FaTwitter />
                  </a>
                  <a href="#" className="h-8 w-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:text-blue-700 transition-colors">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6 text-black" >
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Write here..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-at-button-light hover:bg-orange-600 text-white font-medium rounded-md transition-colors inline-flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {submitStatus && (
                <div className={`mt-4 p-3 rounded ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}