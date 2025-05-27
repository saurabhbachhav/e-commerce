"use client";

import { CartProvider } from "../context/CartContext";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";

// import { Toaster } from "react-hot-toast"; // uncomment if needed

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
      {/* <Toaster /> */}
    </SessionProvider>
  );
}
