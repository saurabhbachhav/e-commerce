"use client";

import { useEffect, useState } from "react";
import Cart from "@/components/Cart";
import Navbar from "@/components/Navbar";
import SkeletonLoader from "@/components/SkeletonLoader";
import ProductGallery from "@/components/ProductGallery";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";

const headerVariant = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.6 },
  }),
};

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const greeting = session?.user?.name
    ? `${session.user.name.split(" ")[0]}'s Cart`
    : "Your Cart";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 via-gray-850 to-gray-800 text-gray-100"
          : "bg-gradient-to-b from-indigo-50 to-white text-gray-900"
      }`}
    >
      <Navbar
        onCategoryClick={() =>
          document.getElementById("product-gallery")?.scrollIntoView({
            behavior: "smooth",
          })
        }
        onToggleDarkMode={handleToggleDarkMode}
        darkMode={theme === "dark"}
      />

      {/* Hero */}
      <motion.header
        className="py-16 px-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600"
        variants={headerVariant}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
          🛒 {greeting}
        </h1>
        <p className="mt-3 text-lg text-indigo-100 max-w-xl mx-auto">
          Review your selected items or continue exploring our top picks below.
        </p>
      </motion.header>

      {/* Cart Section */}
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <AnimatePresence>
          {loading ? <SkeletonLoader type="cart" /> : <Cart />}
        </AnimatePresence>
      </motion.section>

      {/* CTA Banner */}
      <motion.section
        className="w-full bg-indigo-100 dark:bg-indigo-950 py-12 text-center transition-colors duration-300"
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Still Looking?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Discover more products picked just for you. Add more to your cart and
          save!
        </p>
        <button
          onClick={() =>
            document.getElementById("product-gallery")?.scrollIntoView({
              behavior: "smooth",
            })
          }
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Browse Products
        </button>
      </motion.section>

      {/* Recommended Gallery */}
      <motion.section
        id="product-gallery"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          You May Also Like
        </h3>
        <ProductGallery />
      </motion.section>

      <Footer />
    </div>
  );
}
