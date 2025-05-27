"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PopularProducts from "@/components/PopularProducts";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";

export default function HomePage() {
  const { data: session, status } = useSession();
  const { login, user } = useAuth(); // get user from context
  const galleryRef = useRef<HTMLDivElement>(null);

  // Add state for dark mode
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Memoize login to avoid unnecessary re-renders
  const stableLogin = useCallback(login, [login]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.email &&
      !user // check if already logged in
    ) {
      const userData = {
        id: (session.user as any)?.id || session.user.email,
        name: session.user.name || "",
        email: session.user.email,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      stableLogin(userData);
    }
  }, [status, session, stableLogin, user]);

  const handleScrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Pass dark mode toggle handler to Navbar
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <main>
      <Navbar
        onCategoryClick={handleScrollToGallery}
        onToggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />
      <Hero />
      <ProductGallery ref={galleryRef} />
      <PopularProducts />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
