"use client";

import React, { useEffect, useState, forwardRef } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

const tabVariant = {
  active: {
    color: "#3B82F6", 
    scale: 1.15,
    borderBottom: "3px solid #3B82F6",
  },
  inactive: {
    color: "#6B7280", 
    scale: 1,
    borderBottom: "3px solid transparent",
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: {
    scale: 1.05,
    rotate: [0, 1.5, -1.5, 0],
    boxShadow: "0px 15px 30px rgba(0,0,0,0.1)",
  },
};

const ProductGallery = forwardRef<HTMLDivElement, {}>((_props, ref) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/gallery_products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();

        setProducts(data);

        const cats = Array.from(new Set(data.map((p) => p.category)));
        setActiveCat(cats[0] || "");

        const counts: Record<string, number> = {};
        cats.forEach((c) => {
          counts[c] = 4; 
        });
        setVisibleCount(counts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    })();
  }, []);

  const categorized = React.useMemo(() => {
    return products.reduce<Record<string, Product[]>>((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {});
  }, [products]);

  const activeProducts = categorized[activeCat] || [];
  const visible = visibleCount[activeCat] || 0;

  const handleViewMore = (cat: string) => {
    setVisibleCount((prev) => ({ ...prev, [cat]: (prev[cat] || 0) + 4 }));
  };

  return (
    <section
      ref={ref}
      className="relative border-t border-blue-200 dark:border-blue-700 overflow-hidden py-20 px-8 bg-gradient-to-br from-[#E0ECFF] via-[#FBEFFF] to-[#FFE6EA] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
    
      <motion.div
        className="absolute top-[-100px] left-1/3 w-[500px] h-[500px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 -z-10"
        animate={{ x: [-50, 50], y: [0, -80] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-100px] right-1/3 w-[600px] h-[600px] bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 -z-10"
        animate={{ x: [50, -50], y: [-60, 0] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-5xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-12 tracking-tight"
      >
        🛒 Explore Our Products
      </motion.h1>

      <motion.div
        className="flex justify-center gap-6 mb-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {Object.keys(categorized).map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCat(cat)}
            variants={tabVariant}
            animate={activeCat === cat ? "active" : "inactive"}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              color:
                activeCat === cat
                  ? "#3B82F6"
                  : "#6B7280" ,
              borderBottom:
                activeCat === cat
                  ? "3px solid #3B82F6"
                  : "3px solid transparent",
            }}
            className={`pb-2 text-lg font-semibold border-b-2 ${
              activeCat === cat
                ? "dark:text-blue-400 dark:border-blue-400"
                : "dark:text-gray-400"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

    
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {activeProducts.slice(0, visible).map((product, idx) => (
            <motion.div
              key={product._id}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all"
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className="relative h-56 w-full group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`absolute top-2 left-2 text-xs px-3 py-1 rounded-full shadow-md ${
                    product.stock > 0
                      ? "bg-blue-600 text-white"
                      : "bg-gray-400 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Sold Out"}
                </motion.div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₹{product.price}
                  </p>
                  <motion.button
                    onClick={() => {
                      addToCart({
                        product,
                        quantity: 1,
                      });
                    }}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium shadow-md"
                    whileTap={{
                      scale: 0.9,
                      opacity: 0.7,
                      transition: { duration: 0.2 },
                    }}
                    whileHover={{ scale: 1.08 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

     
      {visible < activeProducts.length && (
        <div className="flex justify-center mt-10">
          <motion.button
            onClick={() => handleViewMore(activeCat)}
            className="px-8 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-full font-semibold shadow-lg"
            whileHover={{
              scale: 1.1,
              rotate: -5,
              transition: { duration: 0.5, type: "spring", stiffness: 300 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 View More
          </motion.button>
        </div>
      )}
    </section>
  );
});

ProductGallery.displayName = "ProductGallery";

export default ProductGallery;
