"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // ✅ Fetch Booking Details from localStorage
  useEffect(() => {
    const storedBookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
    if (!storedBookingDetails) {
      alert("No booking found. Redirecting to booking page.");
      router.push("/bookings");
      return;
    }
    setBookingDetails(storedBookingDetails);
  }, []);

  // ✅ Handle Payment & Booking Flow
  const handleConfirmBooking = async () => {
    setPaymentProcessing(true);

    try {
      // ✅ Step 1: Create Tutor Slot (if not already created)
      const slotResponse = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
      });

      const slotData = await slotResponse.json();

      if (!slotResponse.ok || !slotData.success) {
        alert(`Error creating tutor slot: ${slotData.message}`);
        return;
      }

      const slot_id = slotData.slot_id; // ✅ Use slot_id for payment

      // ✅ Step 2: Start Payment Session with WorldPay
      const paymentResponse = await fetch("/api/payments/createPaymentSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session?.user?.id,
          amount: bookingDetails.amount,
          paymentType: "card",
          slot_id: slot_id, // ✅ Attach slot ID for reference
          booking_type: bookingDetails.booking_type, // ✅ Pass booking type
          date: bookingDetails.date, // ✅ Pass booking date
        }),
      });

      const paymentData = await paymentResponse.json();

      if (paymentResponse.ok && paymentData.success) {
        // ✅ Redirect to WorldPay Hosted Payment Page
        window.location.href = paymentData.redirectUrl;
      } else {
        alert(`Payment Failed: ${paymentData.message}`);
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (!bookingDetails) return <p className="text-center mt-10">Loading checkout details...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>

        <p className="text-gray-600 text-center mb-2">
          Booking with <span className="font-semibold">{bookingDetails.tutor_id}</span>
        </p>
        <p className="text-gray-600 text-center mb-4">
          {bookingDetails.day}, {bookingDetails.start_time} - {bookingDetails.end_time}
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total Amount:</span>
          <span className="text-xl font-bold text-green-500">₹{bookingDetails.amount}</span>
        </div>

        <button
          onClick={handleConfirmBooking}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${
            paymentProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={paymentProcessing}
        >
          {paymentProcessing ? "Processing Payment..." : "Confirm & Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
