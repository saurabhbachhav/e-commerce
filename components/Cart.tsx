"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

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
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((all: Product[]) => {
        const top = all
          .filter((p) => p.stock > 0)
          .sort((a, b) => b.stock - a.stock)
          .slice(0, 4);
        setRecommended(top);
      })
      .catch(console.error);
  }, []);

  const subtotal = cart.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );
  const gst = parseFloat((subtotal * 0.18).toFixed(2));
  const grandTotal = parseFloat((subtotal + gst + donation).toFixed(2));

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <div className="w-80 h-40 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse shadow-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 py-8 transition-colors duration-500">
      <section className="lg:col-span-2 space-y-6" aria-labelledby="cart-items">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-500">
              Your cart is empty.
            </p>
            <button
              onClick={() => router.push("/shop")}
              className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white rounded-lg font-medium transition focus:ring-2 focus:ring-indigo-400"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          cart.map((item) => (
            <article
              key={item.product._id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-black/50 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                loading="lazy"
                src={item.product.image || "/placeholder.jpg"}
                alt={item.product.name}
                className="w-28 h-28 rounded-lg object-cover border border-gray-300 dark:border-gray-700"
              />
              <div className="flex-1 w-full space-y-1 text-left">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  {item.product.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
                  {item.product.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <span>₹{item.product.price} each</span>
                  <span>× {item.quantity}</span>
                </div>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
                  ₹{item.product.price * item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <button
                  aria-label="Decrease quantity"
                  onClick={() =>
                    addToCart({ product: item.product, quantity: -1 })
                  }
                  className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <FaMinus />
                </button>
                <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  {item.quantity}
                </span>
                <button
                  aria-label="Increase quantity"
                  onClick={() =>
                    addToCart({ product: item.product, quantity: 1 })
                  }
                  className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <FaPlus />
                </button>
                <button
                  aria-label="Remove item"
                  onClick={() => removeFromCart(item.product._id)}
                  className="ml-3 p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <FaTrash />
                </button>
              </div>
            </article>
          ))
        )}

        {recommended.length > 0 && (
          <section className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommended.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md dark:shadow-black/40 hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    loading="lazy"
                    src={prod.image || "/placeholder.jpg"}
                    alt={prod.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {prod.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
                    {prod.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold transition-colors duration-300">
                      ₹{prod.price}
                    </span>
                    <button
                      onClick={() => addToCart({ product: prod, quantity: 1 })}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white rounded-md text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
        <aside
          className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl dark:shadow-black/60 space-y-5 sticky top-24 h-fit transition-colors duration-500"
          aria-labelledby="order-summary"
          role="complementary"
        >
          <h2
            id="order-summary"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300"
          >
            {userName ? `${userName}'s Order` : "Order Summary"}
          </h2>

          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-400 transition-colors duration-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="donation"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 transition-colors duration-300"
              >
                Donation
                <input
                  id="donation"
                  type="number"
                  min={0}
                  value={donation}
                  onChange={(e) => setDonation(parseFloat(e.target.value) || 0)}
                  className="w-20 p-1 bg-gray-100 dark:bg-gray-700 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300"
                  aria-label="Donation amount"
                />
              </label>
              <span>₹{donation.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-300 dark:border-gray-700 flex justify-between text-base font-semibold text-gray-900 dark:text-white transition-colors duration-300">
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
              } text-white rounded-lg font-medium shadow focus:ring-2 focus:ring-indigo-400 transition`}
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 transition-colors duration-300">
              You’ll be redirected to a secure Stripe page for payment.
            </p>

            <button
              onClick={clearCart}
              className="w-full text-red-600 dark:text-red-400 text-sm hover:underline transition-colors duration-300"
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
