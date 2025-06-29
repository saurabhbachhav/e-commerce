"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function SuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [emailStatus, setEmailStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  let user1: any = null;

  // ✅ Safely read from localStorage and parse only if it exists
  if (typeof window !== "undefined") {
    const email = localStorage.getItem("user");
    if (email) {
      user1 = JSON.parse(email);
    } else {
      console.warn("No user found in localStorage.");
    }
  }

  useEffect(() => {
    try {
      clearCart();
    } catch (err) {
      console.error("Error clearing cart:", err);
    }

    const sendEmail = async () => {
      setIsSending(true);
      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user1?.email || "fallback@example.com",
            subject: "Order Confirmation",
            message:
              "Your order has been confirmed. Thank you for shopping with Spargen, a E-commerce WebApp by Saurabh!",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send email");
        }

        setEmailStatus("Email sent successfully!");
      } catch (error) {
        console.error("Error sending email:", error);
        setEmailStatus("Failed to send confirmation email.");
      } finally {
        setIsSending(false);
      }
    };

    sendEmail();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
          🎉 Payment Successful!
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Thank you for your purchase. Your order has been placed.
        </p>

        {isSending ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Sending confirmation email...
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {emailStatus}
          </p>
        )}

        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
