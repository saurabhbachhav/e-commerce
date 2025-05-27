"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-blue-900 dark:text-blue-400 py-10 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-300 transition-colors duration-500">
            Spargen
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300 transition-colors duration-500">
            Sparking Savings, Inspiring Shopping! Discover top deals and shop
            with confidence.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="font-semibold mb-4 text-blue-800 dark:text-blue-300 transition-colors duration-500">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/categories", label: "Categories" },
              { href: "/cart", label: "Cart" },
              { href: "/profile", label: "Profile" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="font-semibold mb-4 text-blue-800 dark:text-blue-300 transition-colors duration-500">
            Subscribe to Our Newsletter
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-4 transition-colors duration-500">
            Get the latest updates, offers, and promotions directly to your
            inbox.
          </p>
          <form className="flex items-center space-x-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-blue-600 dark:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-colors duration-300 bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-8 border-t border-blue-200 dark:border-blue-700 pt-8 transition-colors duration-500">
        <div className="flex justify-center space-x-6">
          {/* Facebook */}
          <a
            href="#"
            aria-label="Facebook"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-6 h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.337v21.326C0 23.4.6 24 1.325 24H12v-9.294H9.293v-3.622H12V8.41c0-2.682 1.638-4.147 4.036-4.147 1.146 0 2.134.085 2.423.123v2.813l-1.664.001c-1.305 0-1.557.62-1.557 1.527v2.002h3.116l-.406 3.622h-2.71V24h5.314c.725 0 1.325-.6 1.325-1.337V1.337C24 .6 23.4 0 22.675 0z" />
            </svg>
          </a>
          {/* Twitter */}
          <a
            href="#"
            aria-label="Twitter"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-6 h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.164-2.724 9.865 9.865 0 01-3.127 1.195 4.916 4.916 0 00-8.379 4.482A13.94 13.94 0 011.671 3.149a4.916 4.916 0 001.523 6.556 4.903 4.903 0 01-2.228-.616c-.054 2.28 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.918 4.918 0 004.59 3.417 9.867 9.867 0 01-6.102 2.105c-.395 0-.787-.023-1.175-.069a13.945 13.945 0 007.548 2.212c9.056 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.014-.636A10.025 10.025 0 0024 4.557z" />
            </svg>
          </a>
          {/* Instagram */}
          <a
            href="#"
            aria-label="Instagram"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-6 h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.497 2.083a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
            </svg>
          </a>
        </div>
        <div className="mt-4 text-center text-sm text-blue-700 dark:text-blue-400 transition-colors duration-500">
          &copy; {new Date().getFullYear()} Spargen. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
