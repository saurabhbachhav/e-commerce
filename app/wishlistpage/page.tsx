// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

import Wishlist from "@/components/Wishlist";
import SkeletonLoader from "@/components/SkeletonLoader";
import ProductGallery from "@/components/ProductGallery";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 * i, duration: 0.6, ease: "easeOut" },
  }),
};

export default function WishlistPage() {
  const { darkMode } = useTheme();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const greeting = session?.user?.name
    ? `${session.user.name.split(" ")[0]}'s Wishlist`
    : "Your Wishlist";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-850 to-gray-800 text-gray-100"
          : "bg-gradient-to-b from-indigo-50 to-white text-gray-900"
      }`}
    >
      {/* Header */}
      <motion.header
        className="py-20 px-6 text-center bg-gradient-to-r from-indigo-700 to-purple-700 shadow-md"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow">
          💖 {greeting}
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto">
          Your saved items are waiting. Add them to cart or keep browsing!
        </p>
      </motion.header>

      {/* Wishlist Section */}
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <AnimatePresence>
          {loading ? <SkeletonLoader type="wishlist" /> : <Wishlist />}
        </AnimatePresence>
      </motion.section>

      {/* Prompt to Browse */}
      <motion.section
        className="w-full bg-pink-50 dark:bg-pink-950 py-12 text-center transition duration-300"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Want More Inspiration?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
          Check out our handpicked selections just for you!
        </p>
        <button
          onClick={() =>
            document.getElementById("product-gallery")?.scrollIntoView({
              behavior: "smooth",
            })
          }
          className="px-6 py-3 rounded-lg font-semibold bg-pink-600 hover:bg-pink-700 text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          Browse Products
        </button>
      </motion.section>

      {/* Related Products Gallery */}
      <motion.section
        id="product-gallery"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <h3 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-white text-center">
          You May Also Like
        </h3>
        <ProductGallery />
      </motion.section>

      <Footer />
    </div>
  );
}
