"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebookF, FaInstagram } from "react-icons/fa";
import Animation_Page from "../../../components/ui/Animation_Page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../context/ThemeContext";

const socialProviders = [
  { icon: FaGoogle, name: "google" },
  { icon: FaFacebookF, name: "facebook" },
  { icon: FaInstagram, name: "instagram" },
];

const SignupPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "google") {
      signIn(provider, { callbackUrl: "/" });
    } else {
      alert(`Working on ${provider}! Please login with google`);
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen bg-gradient-to-r ${
        darkMode
          ? "from-gray-800 via-gray-900 to-black"
          : "from-blue-50 via-white to-blue-100"
      }`}
    >
  
      {/* Left Panel: Form */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`w-full md:w-1/3 flex flex-col justify-start items-center p-6 sm:p-8 lg:p-12 bg-gradient-to-b ${
          darkMode ? "from-gray-700 to-gray-800" : "from-gray-100 to-gray-200"
        } text-${darkMode ? "white" : "black"}`}
      >
        <div className="w-full max-w-md mt-16 space-y-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className={`hover:underline ${darkMode ? "text-blue-300" : "text-blue-600"}`}
              >
                Login
              </Link>
            </p>
          </form>

          <div className="flex items-center justify-center w-full">
            <div className="flex-grow border-t" />
            <span className="px-2 text-sm">or Login with</span>
            <div className="flex-grow border-t" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {socialProviders.map(({ icon: Icon, name }) => (
              <motion.button
                key={name}
                onClick={() => handleSocialLogin(name)}
                aria-label={`Continue with ${name}`}
                initial={{ rotate: 0, scale: 1 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className={`flex items-center justify-center space-x-2 px-4 py-3 min-w-[100px] rounded-full shadow-lg bg-gradient-to-tr ${
                  name === "google"
                    ? "from-red-400 to-red-600"
                    : name === "facebook"
                      ? "from-blue-600 to-blue-800"
                      : "from-pink-500 to-pink-700"
                } text-white hover:brightness-110 active:brightness-90`}
              >
                <Icon size={20} />
                <span className="text-sm sm:text-base font-semibold capitalize">
                  {name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Panel: Animation Page */}
      <div className="hidden md:flex md:w-2/3 items-center justify-center ">
        <Animation_Page />
      </div>
    </div>
  );
};

export default SignupPage;
