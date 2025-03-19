'use client';

import { FaAward, FaCreditCard, FaFileAlt } from 'react-icons/fa';

const AssignmentSteps = () => {
  const steps = [
    {
      icon: <FaAward className="text-4xl text-blue-900 w-[95px] h-[95px]" />, 
      title: 'Place Assignment Order',
      description: "Fill 'Submit Your Requirement' form to place your order with assignment requirement details."
    },
    {
      icon: <FaCreditCard className="text-4xl text-blue-900 w-[95px] h-[95px]" />, 
      title: 'Pay for Your Order',
      description: "Get the best quote from our online experts. Use Payment Gateway to securely process your payment."
    },
    {
      icon: <FaFileAlt className="text-4xl text-blue-900 w-[95px] h-[95px]" />, 
      title: 'Get Assignment Solution',
      description: "Get unique and quality assignments delivered to your inbox before the deadline."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-[32px] font-inter font-bold text-blue-900">Easy 3 Steps to Seek Help with Assignment Writing</h2>
      <p className="mt-2 text-gray-600">Get a delightful academic experience and instant assignment solutions by India Assignment Help following 3 easy steps</p>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-at-light-orange p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">{step.icon}</div>
            <h3 className="text-[23px] font-inter font-semibold text-blue-900">{step.title}</h3>
            <p className="mt-2 text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentSteps;
