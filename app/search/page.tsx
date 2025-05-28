"use client";

import React, { useState, useEffect, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Image from "next/image";

// Extended product type with discount and gallery
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  gallery?: string[];
  category: string;
  description: string;
  discount?: number;
}

const categories = ["All", "Electronics", "Fashion", "Books", "Home"];

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [darkMode, setDarkMode] = useState(false);

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/products?q=${query}`);
        const data = await resp.json();
        const prods = (data.products || []).map((p: any) => ({ ...p, gallery: p.gallery || [p.image] }));
        setProducts(prods);
      } catch {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchResults();
  }, [query]);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== "All") filtered = filtered.filter((p) => p.category === selectedCategory);
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange]);

  const openQuick = (prod: Product) => {
    setCurrent(prod);
    setOpen(true);
  };
  const handleAdd = (prod: Product) => {
    addToCart({ product: { _id: prod.id, name: prod.name, price: prod.price, image: prod.image, description: prod.description }, quantity: 1 });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* <Navbar darkMode={darkMode} setDarkMode={setDarkMode} /> */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Search results for "{query}"</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Filter</h2>
            <div className="mb-4">
              <label>Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full border p-2 rounded">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Price: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
              <div className="flex gap-2">
                <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} className="border p-1 rounded w-1/2" />
                <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} className="border p-1 rounded w-1/2" />
              </div>
            </div>
          </aside>

          <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? <p className="col-span-full text-center">Loading...</p> :
              filteredProducts.length ? filteredProducts.map((prod) => (
                <div key={prod.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
                  <div className="relative h-48">
                    <Image src={prod.image} alt={prod.name} fill className="object-cover rounded" />
                    {prod.discount && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">{prod.discount}% Off</span>}
                  </div>
                  <h3 className="mt-2 font-semibold truncate">{prod.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold">₹{(prod.price * (100 - (prod.discount || 0)) / 100).toFixed(0)}</span>
                    {prod.discount && <span className="text-xs line-through text-gray-500">₹{prod.price}</span>}
                  </div>
                  <div className="mt-auto flex gap-2 pt-2">
                    <button onClick={() => openQuick(prod)} className="flex-1 border p-2 rounded hover:bg-gray-100">Quick View</button>
                    <button onClick={() => handleAdd(prod)} className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add to Cart</button>
                  </div>
                </div>
              )) : <p className="col-span-full text-center">No products found.</p>
            }
          </main>
        </div>

        {current && (
          <Transition show={open} as={Fragment}>
            <Dialog onClose={setOpen} className="fixed inset-0 z-50">
              {/* Backdrop */}
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black/50" />
              </Transition.Child>

              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden max-w-lg w-full">
                    <div className="flex justify-end p-2">
                      <button onClick={() => setOpen(false)} className="text-xl">&times;</button>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(current.gallery ?? []).map((img, idx) => (
                          <div key={idx} className="relative h-32">
                            <Image src={img} alt={current.name} fill className="object-cover rounded" />
                          </div>
                        ))}
                      </div>
                      <Dialog.Title className="mt-4 text-xl font-bold">{current.name}</Dialog.Title>
                      <Dialog.Description className="mt-2 text-gray-600 dark:text-gray-300">{current.description}</Dialog.Description>
                      <div className="mt-4 flex items-center gap-4">
                        <span className="text-2xl font-semibold">₹{(current.price * (100 - (current.discount || 0)) / 100).toFixed(0)}</span>
                        {current.discount && <span className="line-through text-gray-500">₹{current.price}</span>}
                      </div>
                      <button onClick={() => handleAdd(current)} className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add to Cart</button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        )}
      </div>
    </div>
  );
}
