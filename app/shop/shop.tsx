// pages/shop.tsx
"use client";

import React from "react";
import { useCart } from "../../context/CartContext";

const products = [
  {
    productId: "1",
    name: "Bluetooth Headphones",
    price: 1500,
    image: "https://via.placeholder.com/200",
  },
  {
    productId: "2",
    name: "Laptop Stand",
    price: 800,
    image: "https://via.placeholder.com/200",
  },
  {
    productId: "3",
    name: "Wireless Mouse",
    price: 600,
    image: "https://via.placeholder.com/200",
  },
];

const ShopPage = () => {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map((product) => (
          <div
            key={product.productId}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mt-1">₹{product.price}</p>
            <button
              onClick={() => addToCart({ ...product, quantity: 1 })}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
