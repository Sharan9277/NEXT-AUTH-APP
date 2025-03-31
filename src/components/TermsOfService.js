import React from "react";

const TermsOfService = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
      <p className="mb-4">Welcome to Assign Tutors. By accessing our website and services, you agree to abide by these Terms of Service. Please read them carefully.</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p>By using Assign Tutors, you confirm that you accept these terms and conditions. If you do not agree, please do not use our services.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">2. User Responsibilities</h2>
        <p>Users must comply with all applicable laws and regulations while using Assign Tutors. You are responsible for maintaining the confidentiality of your account credentials.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">3. Prohibited Activities</h2>
        <p>Users are prohibited from engaging in fraudulent, illegal, or harmful activities, including but not limited to:</p>
        <ul className="list-disc pl-6">
          <li>Unauthorized access to our systems</li>
          <li>Misuse of intellectual property</li>
          <li>Harassment or abuse of other users</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">4. Intellectual Property</h2>
        <p>All content on Assign Tutors, including logos, text, and graphics, is the property of Assign Tutors and is protected by copyright laws.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">5. Limitation of Liability</h2>
        <p>Assign Tutors is not responsible for any direct, indirect, or incidental damages resulting from the use of our services.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">6. Termination of Services</h2>
        <p>We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">7. Changes to Terms</h2>
        <p>Assign Tutors reserves the right to modify these terms at any time. We will notify users of significant changes through our website.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">8. Governing Law</h2>
        <p>These Terms of Service are governed by the laws of the jurisdiction in which Assign Tutors operates.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">9. Contact Information</h2>
        <p>If you have any questions regarding these Terms of Service, you can contact us at <strong>support@assigntutors.com</strong>.</p>
      </section>
    </div>
  );
};

export default TermsOfService;
