// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
}

// Fake content arrays
const fakeDescriptions = [
  "Crafted from premium materials for durability and style.",
  "Designed with comfort and elegance in mind, perfect for everyday use.",
  "An instant classic—versatile, sleek, and built to last.",
  "Elevate your routine with this must-have essential.",
  "Engineered for performance and aesthetics in equal measure.",
];

const fakeReviews = [
  {
    name: "Aarav",
    text: "Absolutely love it! Exceeded my expectations.",
    rating: 5,
  },
  {
    name: "Dia",
    text: "Good quality, fast shipping. Will recommend!",
    rating: 4,
  },
  {
    name: "Rahul",
    text: "Value for money. I get compliments all the time.",
    rating: 5,
  },
  { name: "Neha", text: "Looks great but sizing runs a bit small.", rating: 4 },
  {
    name: "Vikram",
    text: "Sturdy and reliable—perfect for daily wear.",
    rating: 5,
  },
];

const SearchResultPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentQuery = searchParams.get("query") || "";

  useEffect(() => {
    setLoading(true);
    fetch("/api/product")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data: Product[]) => setAllProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = currentQuery.toLowerCase().trim();
    setFilteredProducts(
      q
        ? allProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.category?.toLowerCase().includes(q)
          )
        : allProducts
    );
  }, [currentQuery, allProducts]);

  const relatedCategory = filteredProducts[0]?.category;
  const relatedProducts = relatedCategory
    ? allProducts
        .filter(
          (p) =>
            p.category === relatedCategory &&
            !filteredProducts.some((fp) => fp._id === p._id)
        )
        .slice(0, 4)
    : [];

  const handleRelatedClick = (name: string) => {
    router.push(`/search?query=${encodeURIComponent(name)}`);
  };

  return (
    <main className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors p-4">
      <div className="w-full max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-100">
          Results for “{currentQuery}”
        </h1>

        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            No products found. Try a different search term.
          </p>
        ) : (
          <>
            {/* Product List */}
            <div className="flex flex-col space-y-10">
              {filteredProducts.map((product) => {
                const desc =
                  product.description ||
                  fakeDescriptions[
                    Math.floor(Math.random() * fakeDescriptions.length)
                  ];
                const reviews = Array.from({ length: 2 }).map(
                  () =>
                    fakeReviews[Math.floor(Math.random() * fakeReviews.length)]
                );

                return (
                  <motion.div
                    key={product._id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 250 }}
                    className="w-full"
                  >
                    {/* Card */}
                    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row-reverse w-full">
                      {/* Images */}
                      <div className="md:w-1/2 w-full p-4 bg-gray-100 dark:bg-gray-900">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-80 object-cover rounded-xl mb-4"
                        />
                        <div className="flex space-x-2 overflow-x-auto">
                          {[1, 2, 3, 4].map((idx) => (
                            <img
                              key={idx}
                              src={product.image}
                              alt={`${product.name} ${idx}`}
                              className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border-2 border-transparent hover:border-blue-500 transition"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            {product.name}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-300 mb-6">
                            {desc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                            ₹{product.price}
                          </span>
                          <button
                            onClick={() => addToCart({ product, quantity: 1 })}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full shadow-lg transform hover:-translate-y-1 transition-all"
                          >
                            Add to Cart
                          </button>
                        </div>

                        <div className="flex items-center justify-end mb-6">
                          {[...Array(5)].map((_, idx) => (
                            <span
                              key={idx}
                              className={
                                idx < product.price % 5
                                  ? "text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                            {Math.floor(Math.random() * 200) + 20} reviews
                          </span>
                        </div>

                        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                          {reviews.map((r, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                                  {r.name.charAt(0)}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  {[...Array(r.rating)].map((_, si) => (
                                    <span key={si} className="text-yellow-400">
                                      ★
                                    </span>
                                  ))}
                                  {[...Array(5 - r.rating)].map((_, si) => (
                                    <span
                                      key={si}
                                      className="text-gray-300 dark:text-gray-600"
                                    >
                                      ★
                                    </span>
                                  ))}
                                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                                    {r.name}
                                  </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">
                                  {r.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  You might also like
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {relatedProducts.map((prod) => (
                    <motion.div
                      key={prod._id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleRelatedClick(prod.name)}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden cursor-pointer"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {prod.name}
                        </h3>
                        <p className="mt-2 text-blue-600 dark:text-blue-400 font-bold">
                          ₹{prod.price}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default SearchResultPage;
