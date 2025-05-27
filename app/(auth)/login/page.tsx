"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // next/navigation for router in app dir
import { motion } from "framer-motion";
import { FaGoogle, FaFacebookF, FaInstagram } from "react-icons/fa";
import Animation_Page from "../../../components/ui/Animation_Page";

const socialProviders = [
  { icon: FaGoogle, name: "google" },
  { icon: FaFacebookF, name: "facebook" },
  { icon: FaInstagram, name: "instagram" },
];

const Login: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid credentials");
    } else if (res?.ok) {
      // Login success: Store user info (minimal) in localStorage
      // Usually, user info comes from session, but if you want to store some
      // minimal info here, you can do:
      localStorage.setItem("user", JSON.stringify({ email }));

      // Redirect to homepage or dashboard
      router.push("/");
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "google") {
      signIn("google", { callbackUrl: "/" }); // redirect to home, where session will be synced
    } else {
      alert("Only Google login is available for now.");
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-50 via-white to-blue-100">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col justify-start items-center md:w-1/3 w-full p-8 bg-gradient-to-b from-gray-100 to-gray-200 space-y-6 relative"
      >
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center space-x-2 cursor-pointer"
        >
          <div className="relative">
            <h1 className="text-5xl font-extrabold drop-shadow-md transition-transform transform hover:scale-110">
              <span className="text-blue-600">Spar</span>
              <span className="text-pink-400 animate-pulse">g</span>
              <span className="text-blue-600">en</span>
              <span className="text-pink-400 animate-bounce">✨</span>
            </h1>
            <p className="text-sm font-medium bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent absolute top-full left-0 mt-2 tracking-wide">
              Your Ultimate Shopping Partner
            </p>
          </div>
        </Link>

        <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
          <h2 className="text-2xl font-semibold text-blue-700">
            Welcome Back!
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Continue"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>

          <div className="flex items-center w-full max-w-sm my-6">
            <div className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-500">or Login with</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div className="flex space-x-6">
            {socialProviders.map(({ icon: Icon, name }) => (
              <motion.button
                key={name}
                onClick={() => handleSocialLogin(name)}
                aria-label={`Continue with ${name}`}
                initial={{
                  rotate: 0,
                  scale: 1,
                  boxShadow: "0px 0px 0px rgba(0,0,0,0)",
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 15,
                  boxShadow: `0 0 15px ${
                    name === "google"
                      ? "#DB4437"
                      : name === "facebook"
                        ? "#4267B2"
                        : "#E1306C"
                  }, 0 0 30px ${
                    name === "google"
                      ? "#DB4437"
                      : name === "facebook"
                        ? "#4267B2"
                        : "#E1306C"
                  }, 0 0 45px ${
                    name === "google"
                      ? "#DB4437"
                      : name === "facebook"
                        ? "#4267B2"
                        : "#E1306C"
                  }`,
                }}
                whileTap={{ scale: 0.9, rotate: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className={`p-3 rounded-full cursor-pointer 
                  bg-gradient-to-tr ${
                    name === "google"
                      ? "from-red-400 to-red-600"
                      : name === "facebook"
                        ? "from-blue-600 to-blue-800"
                        : "from-pink-500 to-pink-700"
                  } 
                  text-white shadow-lg 
                  hover:brightness-110 
                  active:brightness-90
                  flex items-center justify-center space-x-2
                  min-w-[120px]
                `}
              >
                <Icon size={24} />
                <span className="text-lg font-semibold capitalize">{name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <Animation_Page />
    </div>
  );
};

export default Login;
