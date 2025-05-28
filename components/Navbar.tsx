"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useScroll } from "../context/ScrollContext";

interface NavbarProps {
  onCategoryClick?: () => void;
  onToggleDarkMode?: () => void;
  darkMode?: boolean;
}

const Navbar = ({
  onCategoryClick,
  onToggleDarkMode,
  darkMode,
}: NavbarProps) => {
  const { data: session } = useSession();
  const { logout } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { scrollToGallery } = useScroll();

  return (
    <header className="sticky top-0 z-50 bg-gray-50 shadow-md font-work-sans dark:bg-gray-900">
      <nav className="container mx-auto flex justify-between items-center px-5 py-3">
        <Link href="/" className="select-none">
          <h1 className="text-3xl font-extrabold cursor-pointer">
            <span className="text-blue-600">Spar</span>
            <span className="text-pink-400 drop-shadow-lg">g</span>
            <span className="text-blue-600">en</span>
            <span className="text-pink-400 animate-pulse">✨</span>
          </h1>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-slate-800 dark:text-slate-200 font-semibold">
          <li>
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-pink-400 transition"
            >
              Home
            </Link>
          </li>
          <li>
            <button
             onClick={scrollToGallery}
              className="hover:text-blue-600 dark:hover:text-pink-400 transition"
            >
              Categories
            </button>
          </li>
          <li>
            <Link
              href="/cartpage"
              className="hover:text-blue-600 dark:hover:text-pink-400 transition"
            >
              Cart
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="hover:text-blue-600 dark:hover:text-pink-400 transition"
            >
              Profile
            </Link>
          </li>
          {onToggleDarkMode && (
            <li>
              <button
                onClick={onToggleDarkMode}
                className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
          )}
          {session?.user ? (
            <>
              <li>
                <Link
                  href="/startup/create"
                  className="hover:text-blue-600 dark:hover:text-pink-400 transition"
                >
                  Create
                </Link>
              </li>
              <li className="text-pink-400 font-medium">{session.user.name}</li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-red-500 font-semibold hover:underline"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">
                <button className="bg-blue-600 hover:bg-pink-400 text-white px-4 py-2 rounded-full shadow-md transition duration-300">
                  Login
                </button>
              </Link>
            </li>
          )}
        </ul>

        <button
          className="md:hidden text-blue-600 hover:text-pink-400 transition text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 shadow-md px-5 py-4 border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <ul className="flex flex-col gap-4 text-slate-800 dark:text-slate-200 font-semibold">
            <li>
              <Link
                href="/"
                className="block py-2 hover:text-blue-600 dark:hover:text-pink-400 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  onCategoryClick?.();
                  setMenuOpen(false);
                }}
                className="block py-2 text-left hover:text-blue-600 dark:hover:text-pink-400 transition"
              >
                Categories
              </button>
            </li>
            <li>
              <Link
                href="/cartpage"
                className="block py-2 hover:text-blue-600 dark:hover:text-pink-400 transition"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="block py-2 hover:text-blue-600 dark:hover:text-pink-400 transition"
              >
                Profile
              </Link>
            </li>
            {onToggleDarkMode && (
              <li>
                <button
                  onClick={() => {
                    onToggleDarkMode();
                    setMenuOpen(false);
                  }}
                  className="block w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded"
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </li>
            )}
            {session?.user ? (
              <>
                <li>
                  <Link
                    href="/startup/create"
                    className="block py-2 hover:text-blue-600 dark:hover:text-pink-400 transition"
                  >
                    Create
                  </Link>
                </li>
                <li className="text-pink-400 font-medium py-2">
                  {session.user.name}
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="text-red-500 font-semibold hover:underline py-2"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login">
                  <button className="w-full bg-blue-600 hover:bg-pink-400 text-white px-4 py-2 rounded-full shadow-md transition duration-300">
                    Login
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
