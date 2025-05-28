"use client";

import { FaShippingFast, FaTags, FaHeadset, FaLock } from "react-icons/fa";

export default function Features() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16">
      <div className="container mx-auto px-6 text-center max-w-5xl">
        <h2 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-8">
          Why Shop with Spargen?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
       
          <div className="flex flex-col items-center gap-4 px-4">
            <FaShippingFast className="text-pink-500 dark:text-pink-400 text-5xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Fast Shipping
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get your orders delivered quickly with our reliable shipping
              partners.
            </p>
          </div>

      
          <div className="flex flex-col items-center gap-4 px-4">
            <FaTags className="text-pink-500 dark:text-pink-400 text-5xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Best Deals
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Enjoy exclusive discounts and unbeatable prices every day.
            </p>
          </div>

    
          <div className="flex flex-col items-center gap-4 px-4">
            <FaHeadset className="text-pink-500 dark:text-pink-400 text-5xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              24/7 Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our friendly support team is always ready to help you with any
              questions.
            </p>
          </div>

      
          <div className="flex flex-col items-center gap-4 px-4">
            <FaLock className="text-pink-500 dark:text-pink-400 text-5xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Secure Payments
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Shop with confidence knowing your payment information is safe with
              us.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
