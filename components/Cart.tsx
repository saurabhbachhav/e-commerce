"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { Product, CartItem } from "@/context/CartContext";

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   image?: string;
//   stock: number;
// }

// interface CartItem {
//   product: Product;
//   quantity: number;
// }

interface CartProps {
  userName?: string;
}

const Cart: React.FC<CartProps> = ({ userName }) => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { status } = useSession();
  const router = useRouter();
  const [donation, setDonation] = useState<number>(0);
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const all: Product[] = data.products;
        const top = all
          .slice(0, 4);
        setRecommended(top);
      })
      .catch(console.error);
  }, []);
  
  
  // console.log("********",recommended);

  const subtotal = cart.reduce((sum, item) => {
    if (!item.product || typeof item.product.price !== "number") return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  const gst = parseFloat((subtotal * 0.18).toFixed(2));
  const grandTotal = parseFloat((subtotal + gst + donation).toFixed(2));

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-80 h-40 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse shadow-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 py-8">
      <section className="lg:col-span-2 space-y-6">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your cart is empty.
            </p>
            <button
              onClick={() => router.push("/shop")}
              className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white rounded-lg font-medium focus:ring-2 focus:ring-indigo-400"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          cart.map((item, index) => {
            const product = item.product;
            if (!product) return null;

            return (
              <article
                key={`${product._id}-${index}`}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg"
              >
                <img
                  loading="lazy"
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-28 h-28 rounded-lg object-cover border"
                />
                <div className="flex-1 space-y-1 text-left">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ₹{product.price} × {item.quantity}
                  </div>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    ₹{product.price * item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => addToCart({ product, quantity: -1 })}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <FaMinus />
                  </button>
                  <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-100">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addToCart({ product, quantity: 1 })}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="ml-3 p-2 text-red-600 dark:text-red-400 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            );
          })
        )}

        {recommended.length > 0 && (
          <section className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommended.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg"
                >
                  <img
                    loading="lazy"
                    src={prod.image || "/placeholder.jpg"}
                    alt={prod.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {prod.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {prod.description}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      ₹{prod.price}
                    </span>
                    <button
                      onClick={() => addToCart({ product: prod, quantity: 1 })}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white rounded-md text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      {cart.length > 0 && (
        <aside className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl space-y-5 sticky top-24 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {userName ? `${userName}'s Order` : "Order Summary"}
          </h2>

          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="donation" className="flex items-center gap-2">
                Donation
                <input
                  id="donation"
                  type="number"
                  min={0}
                  value={donation}
                  onChange={(e) => setDonation(parseFloat(e.target.value) || 0)}
                  className="w-20 p-1 bg-gray-100 dark:bg-gray-700 rounded-md text-right"
                />
              </label>
              <span>₹{donation.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-300 dark:border-gray-700 flex justify-between text-base font-semibold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>

          <div className="pt-4 space-y-2">
            <button
              onClick={() => router.push("/checkout")}
              disabled={cart.length === 0}
              className={`w-full py-3 ${
                cart.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500"
              } text-white rounded-lg font-medium shadow focus:ring-2 focus:ring-indigo-400`}
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              You’ll be redirected to a secure Stripe page for payment.
            </p>

            <button
              onClick={clearCart}
              className="w-full text-red-600 dark:text-red-400 text-sm hover:underline"
            >
              Clear Cart
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Cart;
