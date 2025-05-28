// app/success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on success page load
    clearCart;
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
          🎉 Payment Successful!
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Thank you for your purchase. Your order has been placed.
        </p>
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
