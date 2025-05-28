"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiChevronRight } from "react-icons/fi";
import { motion, useMotionValue, animate } from "framer-motion";
import VoiceSearch from "./VoiceSearch";

const rotatingWords = ["Savings", "Deals", "Shopping", "Confidence"];

type BlobControl = {
  x: any;
  y: any;
  scale: any;
  size: number;
  color: string;
};

export default function Hero() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { id: number; name: string }[]
  >([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // motion values declared outside loop
  const x1 = useMotionValue(0);
  const y1 = useMotionValue(0);
  const scale1 = useMotionValue(1);

  const x2 = useMotionValue(0);
  const y2 = useMotionValue(0);
  const scale2 = useMotionValue(1);

  const x3 = useMotionValue(0);
  const y3 = useMotionValue(0);
  const scale3 = useMotionValue(1);

  const blobs: BlobControl[] = [
    {
      x: x1,
      y: y1,
      scale: scale1,
      size: 300,
      color: "bg-pink-400 dark:bg-pink-500",
    },
    {
      x: x2,
      y: y2,
      scale: scale2,
      size: 250,
      color: "bg-blue-400 dark:bg-blue-500",
    },
    {
      x: x3,
      y: y3,
      scale: scale3,
      size: 280,
      color: "bg-purple-400 dark:bg-purple-500",
    },
  ];
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!query.trim()) return setSuggestions([]);
    (async () => {
      try {
        const res = await fetch(`/api/products?q=${query}`);
        const data = await res.json();
        console.log(data)
        setSuggestions(data.products || []);
        setHighlightedIndex(-1);
      } catch {
        setSuggestions([]);
      }
    })();
  }, [query]);

  useEffect(() => {
    const cb = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setDropdownVisible(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", cb);
    return () => document.removeEventListener("mousedown", cb);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
    setDropdownVisible(false);
    setHighlightedIndex(-1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownVisible || !suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    }
    if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const name = suggestions[highlightedIndex].name;
      router.push(`/search?query=${encodeURIComponent(name)}`);
    }
    if (e.key === "Escape") {
      setDropdownVisible(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    if (highlightedIndex < 0 || !suggestionsRef.current) return;
    const ul = suggestionsRef.current;
    const li = ul.children[highlightedIndex] as HTMLElement;
    if (!li) return;
    const top = li.offsetTop,
      bottom = top + li.offsetHeight;
    if (top < ul.scrollTop) ul.scrollTop = top;
    else if (bottom > ul.scrollTop + ul.clientHeight)
      ul.scrollTop = bottom - ul.clientHeight;
  }, [highlightedIndex]);

  useEffect(() => {
    if (!hasMounted) return;

    const random = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const tick = () => {
      const durationMultiplier = 1.5;

      [x1, x2, x3].forEach((x, i) => {
        const size = blobs[i].size;
        animate(
          x,
          random(
            -window.innerWidth / 2 - size / 2,
            window.innerWidth / 2 + size / 2
          ),
          { duration: random(1.2, 2) * durationMultiplier, ease: "easeInOut" }
        );
      });

      [y1, y2, y3].forEach((y) => {
        animate(y, random(-window.innerHeight / 2, window.innerHeight / 2), {
          duration: random(1.2, 2) * durationMultiplier,
          ease: "easeInOut",
        });
      });

      [scale1, scale2, scale3].forEach((scale) => {
        animate(scale, random(0.8, 1.2), {
          duration: random(1.2, 2) * durationMultiplier,
          ease: "easeInOut",
        });
      });
    };

    tick();
    const iv = setInterval(tick, 1800);
    return () => clearInterval(iv);
  }, [hasMounted]);

  return (
    <section className="relative py-24 overflow-visible bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {hasMounted && (
        <div className="pointer-events-none absolute inset-0">
          {blobs.map((ctrl, i) => (
            <motion.div
              key={i}
              style={{
                x: ctrl.x,
                y: ctrl.y,
                scale: ctrl.scale,
                width: ctrl.size,
                height: ctrl.size,
              }}
              className={`${ctrl.color} rounded-full mix-blend-multiply opacity-60 absolute`}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
          Spark Your&nbsp;
          <span
            aria-live="polite"
            className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 animate-gradient-x"
          >
            {rotatingWords[currentWordIndex]}
          </span>
          ,<br />
          Shop with Confidence
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-12 text-lg md:text-xl leading-relaxed">
          Discover amazing deals, explore top products, and enjoy effortless
          shopping with Spargen.
        </p>

        <form
          onSubmit={handleSearch}
          ref={formRef}
          className="relative mx-auto max-w-xl"
          role="search"
          aria-label="Product Search"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDropdownVisible(true);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search for products..."
            aria-controls="search-list"
            aria-expanded={isDropdownVisible}
            className="w-full rounded-full px-6 py-4 pr-14 text-gray-900 dark:text-gray-100 text-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-600 transition duration-300 placeholder-gray-400 dark:placeholder-gray-500 focus:scale-[1.02]"
          />
          <VoiceSearch/>
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-600 transition"
          >
            <FiSearch size={24} />
          </button>

          {isDropdownVisible && suggestions.length > 0 && (
            <ul
              id="search-list"
              role="listbox"
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-2xl animate-slide-down scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 dark:scrollbar-thumb-purple-700 dark:scrollbar-track-gray-700"
            >
              {suggestions.map((p, idx) => (
                <li
                  key={p.id}
                  role="option"
                  aria-selected={highlightedIndex === idx}
                  onMouseDown={() => {
                    setQuery(p.name);
                    setDropdownVisible(false);
                    setHighlightedIndex(-1);
                    router.push(`/search?query=${encodeURIComponent(p.name)}`);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`flex cursor-pointer items-center justify-between px-6 py-3 text-gray-900 dark:text-gray-100 hover:bg-purple-100 dark:hover:bg-purple-900 ${
                    highlightedIndex === idx
                      ? "bg-purple-200 dark:bg-purple-800 font-semibold"
                      : ""
                  }`}
                >
                  <span>{p.name}</span>
                  <FiChevronRight
                    size={20}
                    className={`transition-transform ${
                      highlightedIndex === idx ? "translate-x-1" : ""
                    }`}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </section>
  );
}
