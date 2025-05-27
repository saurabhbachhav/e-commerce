"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";


type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

const categories = ["All", "Electronics", "Fashion", "Books", "Home"];

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?q=${query}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchResults();
  }, [query]);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange]);

  return (
    <>
    <Navbar/>
      <div className="relative min-h-screen bg-white text-gray-800 overflow-hidden">
        {/* Animated Background Circles */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-300 rounded-full opacity-30 animate-pulse blur-3xl z-0"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-300 rounded-full opacity-30 animate-ping blur-3xl z-0"></div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Search results for "{query}"
          </h1>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Filters */}
            <aside className="w-full lg:w-72 bg-gradient-to-b from-purple-100 to-pink-100 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-purple-700 border-b border-purple-300 pb-3">
                Filter
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block mb-2 text-purple-700 font-medium">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-purple-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block mb-2 text-purple-700 font-medium">
                  Price Range (${priceRange[0]} - ${priceRange[1]})
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([+e.target.value, priceRange[1]])
                    }
                    className="w-1/2 bg-white border border-purple-300 rounded-md p-2"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], +e.target.value])
                    }
                    className="w-1/2 bg-white border border-purple-300 rounded-md p-2"
                  />
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <main className="flex-1 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {loading ? (
                <div className="col-span-full flex justify-center items-center gap-3">
                  <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg text-purple-500 font-medium">
                    Loading...
                  </span>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-2xl border border-gray-100 transition-transform hover:scale-105 duration-300"
                  >
                    <div className="relative h-52 rounded-lg overflow-hidden mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      {/* Fake Quick View button */}
                      <button className="absolute top-2 right-2 bg-white/80 text-sm text-purple-600 font-semibold px-2 py-1 rounded hover:bg-white">
                        Quick View
                      </button>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-lg font-semibold truncate text-purple-700">
                        {product.name}
                      </h3>
                      <span className="bg-pink-500 text-white px-3 py-1 text-xs font-bold rounded-full">
                        ₹{product.price}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 capitalize mb-3">
                      {product.category}
                    </p>

                    {/* Fake e-commerce buttons */}
                    <div className="flex justify-between gap-2">
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-1 text-sm rounded-lg shadow hover:brightness-110 transition">
                        Add to Cart
                      </button>
                      <button className="flex items-center justify-center bg-white text-pink-500 border border-pink-400 rounded-lg w-10 h-10 hover:bg-pink-100">
                        ♥
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-pink-500 text-lg font-semibold">
                  No products found for "{query}".
                </p>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
