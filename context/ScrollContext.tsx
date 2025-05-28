// contexts/ScrollContext.tsx
"use client";
import React, { createContext, useContext, useRef } from "react";

type ScrollContextType = {
  scrollToGallery: () => void;
  registerGalleryRef: (ref: React.RefObject<HTMLElement>) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const galleryRef = React.useRef<HTMLElement>(null);

  const scrollToGallery = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const registerGalleryRef = (ref: React.RefObject<HTMLElement>) => {
    galleryRef.current = ref.current;
  };

  return (
    <ScrollContext.Provider value={{ scrollToGallery, registerGalleryRef }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) throw new Error("useScroll must be used within ScrollProvider");
  return context;
};
