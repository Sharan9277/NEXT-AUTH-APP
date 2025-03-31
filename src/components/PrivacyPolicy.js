import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        Welcome to Assign Tutors. Your privacy is critically important to us. This
        Privacy Policy outlines the types of personal information that is
        collected and recorded by Assign Tutors and how we use it.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p>
        We collect various types of information, including but not limited to:
        <ul className="list-disc pl-6">
          <li>Personal identification information (Name, email address, phone number, etc.)</li>
          <li>Log data such as IP address, browser type, and visit duration</li>
          <li>Cookies and tracking technologies</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p>
        Assign Tutors uses collected information for the following purposes:
        <ul className="list-disc pl-6">
          <li>To provide, operate, and maintain our website</li>
          <li>To improve user experience and personalize content</li>
          <li>To communicate with users regarding services</li>
          <li>To detect and prevent fraudulent activities</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Sharing of Information</h2>
      <p>
        We do not sell, trade, or rent users' personal identification information to others. However,
        we may share generic aggregated demographic information not linked to any personal identification
        information regarding visitors and users with our business partners and trusted affiliates.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p>
        We implement appropriate data collection, storage, and security measures to protect against unauthorized
        access, alteration, disclosure, or destruction of your personal information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have rights related to your personal data, including
        accessing, correcting, or deleting your personal information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, you can contact us at:
        <br /> <strong>Email:</strong> support@assigntutors.com
      </p>
    </div>
  );
};

export default PrivacyPolicy;
