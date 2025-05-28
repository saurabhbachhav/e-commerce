"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string; 
  rating?: number;
}

const cardVariant = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  hover: { scale: 1.07, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" },
};

const blobVariant = {
  animate: (i: number) => ({
    x: [0, 40, -30, 0],
    y: [0, -25, 25, 0],
    transition: { duration: 15 + i * 4, repeat: Infinity, ease: "easeInOut" },
  }),
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  
  return (
    <div className="flex justify-center mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? "text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`${star <= rating ? "Filled" : "Empty"} star`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.462a1 1 0 00-.364 1.118l1.287 3.973c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.386 2.462c-.784.57-1.838-.196-1.54-1.118l1.287-3.973a1 1 0 00-.364-1.118L3.612 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
        </svg>
      ))}
    </div>
  );
};

const PopularProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPage(page);
  }, [page]);

  const fetchPage = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (!Array.isArray(data.products)) throw new Error("Invalid data format");
      
      const enriched = data.products.map((p: Product) => ({
        ...p,
        description: p.description || "Best quality product at great price.",
        rating: p.rating ?? Math.floor(Math.random() * 5) + 1,
      }));
      setProducts((prev) => [...prev, ...enriched]);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const extendedProducts = [...products, ...products];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrame: number;
    const speed = 0.7;

    const animateScroll = () => {
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += speed;
      }
      animationFrame = requestAnimationFrame(animateScroll);
    };

    animationFrame = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [products]);

  return (
    <section className="relative w-full overflow-hidden py-20 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={blobVariant}
          animate="animate"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 300,
            height: 300,
            top: `${15 + i * 25}%`,
            left: `${10 + i * 35}%`,
            backgroundColor: `rgba(${200 - i * 50}, ${100 + i * 50}, 255, 0.2)`,
            filter: "blur(80px)",
            opacity: 0.3,
            mixBlendMode: "screen",
            zIndex: 0,
          }}
        />
      ))}

      <motion.h2
        className="relative z-10 text-center text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg select-none mb-14"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        🔥 Trending Products
      </motion.h2>

      <div
        ref={scrollRef}
        className="relative z-10 flex space-x-8 px-8 overflow-x-hidden select-none cursor-grab"
        aria-label="Trending products banner carousel"
      >
        {extendedProducts.map((product, index) => (
          <motion.div
            key={`${product.id}-${index}`}
            className="flex-shrink-0 w-72 sm:w-80 md:w-96 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl dark:shadow-black/70 p-6 hover:shadow-[0_25px_50px_rgba(0,0,0,0.4)] transition-shadow cursor-pointer"
            variants={cardVariant}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            tabIndex={0}
            role="group"
            aria-label={`${product.name} product banner`}
          >
            <div className="relative h-56 md:h-64 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain rounded-xl"
                priority={true}
              />
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                {product.name}
              </h3>
              <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm italic select-text">
                {product.description}
              </p>
              <p className="mt-3 text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                ₹{product.price.toFixed(2)}
              </p>
              <StarRating rating={product.rating || 0} />
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center justify-center w-72">
            <motion.div
              className="text-white font-semibold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
              aria-live="polite"
            >
              Loading...
            </motion.div>
          </div>
        )}
      </div>

      {error && (
        <p
          className="mt-6 text-center text-red-400 font-semibold select-none relative z-10"
          role="alert"
        >
          {error}
        </p>
      )}
    </section>
  );
};

export default PopularProducts;
