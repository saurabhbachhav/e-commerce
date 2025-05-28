
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ScrollProvider } from "../context/ScrollContext";
import { ThemeProvider } from "@/context/ThemeContext"; 
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

 
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <>
      <ThemeProvider>
        <ScrollProvider>
          <Navbar onToggleDarkMode={toggleDarkMode} darkMode={darkMode} />

          {children}
        </ScrollProvider>
      </ThemeProvider>
    </>
  );
}
