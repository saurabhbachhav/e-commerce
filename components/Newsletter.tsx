"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("Please enter a valid email.");
      return;
    }
    // Subscription logic yahan add kar sakte hain
    setMessage("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <section className="bg-blue-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-6 max-w-xl text-center">
        <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-4">
          Stay Updated!
        </h2>
        <p className="text-pink-600 dark:text-pink-400 mb-8">
          Subscribe to our newsletter and never miss out on the latest deals.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-5 py-3 rounded-full border-2 border-pink-300 dark:border-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-600 flex-grow text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
          />
          <button
            type="submit"
            className="bg-pink-400 hover:bg-pink-500 dark:bg-pink-600 dark:hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Subscribe
          </button>
        </form>
        {message && (
          <p className="mt-4 text-pink-600 dark:text-pink-400 font-medium">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
