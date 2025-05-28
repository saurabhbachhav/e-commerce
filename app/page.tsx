"use client";

import { useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PopularProducts from "@/components/PopularProducts";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { useScroll } from "../context/ScrollContext";

export default function HomePage() {
  const { data: session, status } = useSession();
  const { login, user } = useAuth();
  const galleryRef = useRef<HTMLDivElement>(null);
  const { registerGalleryRef } = useScroll();

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

  useEffect(() => {
    registerGalleryRef(galleryRef as React.RefObject<HTMLElement>);
  }, [registerGalleryRef]);

  return (
    <main>
      {/* <Navbar onCategoryClick={handleCategoryClick} /> */}
      <Hero />
      <div ref={galleryRef}>
        <ProductGallery />
      </div>
      <PopularProducts />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
