// src/components/Razorpay.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Razorpay({ event }) {
  const navigate = useNavigate();

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_test_1234567890abcdef", // ⚠️ Replace with your Razorpay key
      amount: event.price * 100, // amount in paise
      currency: "INR",
      name: "Event Registration",
      description: event.name,
      image: "https://via.placeholder.com/100",
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // 👉 Save user + payment info to Firebase/DB here

        // Redirect based on team size
        if (event.maxTeamSize > 1) {
          navigate(`/event/${event.id}/add-members`);
        } else {
          navigate("/success"); // create a success page for solo registrations
        }
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
    >
      Register & Pay
    </button>
  );
}