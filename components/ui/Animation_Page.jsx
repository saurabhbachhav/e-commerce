import React, { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import {
  FiCheckCircle,
  FiShoppingCart,
  FiGift,
  FiZap,
  FiStar,
} from "react-icons/fi";

export default function EnhancedLandingSection() {
  const rotatingWords = ["Deals", "Savings", "Quality"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showStars, setShowStars] = useState(false);

  // 1) Rotate headline words
  useEffect(() => {
    const id = setInterval(
      () => setCurrentWordIndex(i => (i + 1) % rotatingWords.length),
      3000
    );
    return () => clearInterval(id);
  }, []);

  // 2) Show stars once “Spargen” letters finish popping
  useEffect(() => {
    const delay = "Spargen".length * 0.1 * 1000 + 1500;
    const timer = setTimeout(() => setShowStars(true), delay);
    return () => clearTimeout(timer);
  }, []);

  // 3) Safe dims
  const winW = typeof window !== "undefined" ? window.innerWidth : 0;
  const winH = typeof window !== "undefined" ? window.innerHeight : 0;

  // 4) Blob motion values (hard-coded six times)
  const b1x = useMotionValue(Math.random() * winW),
        b1y = useMotionValue(Math.random() * winH),
        b1s = useMotionValue(1);

  const b2x = useMotionValue(Math.random() * winW),
        b2y = useMotionValue(Math.random() * winH),
        b2s = useMotionValue(2);

  const b3x = useMotionValue(Math.random() * winW),
        b3y = useMotionValue(Math.random() * winH),
        b3s = useMotionValue(1);

  // 5) Animate all six at lightning speed
  useEffect(() => {
    const animateBlob = (x, y, s) => {
      const loop = () => {
        animate(x, Math.random() * winW,     { duration: 1,   ease: "easeInOut" });
        animate(y, Math.random() * winH,     { duration: 1,   ease: "easeInOut" });
        animate(s, Math.random() * 0.6 + 0.7,{ duration: 6, ease: "easeInOut" });
        setTimeout(loop, Math.random() * 700 + 300);
      };
      loop();
    };

    [ [b1x,b1y,b1s],
      [b2x,b2y,b2s],
      [b3x,b3y,b3s],
    ].forEach(([x,y,s]) => animateBlob(x,y,s));
  }, [winW, winH, b1x,b1y,b1s, b2x,b2y,b2s, b3x,b3y,b3s]);

  // 6) Company name + stars
  const company = "Spargen";
  const letters = company.split("");
  const starPositions = [
    { x: -60, y: -30, d: 0 },
    { x: 100, y: -20, d: 200 },
    { x: -20, y: 60, d: 400 },
    { x: 80,  y: 70, d: 600 },
  ];

  // 7) Blob configs (sizes/colors)
  const blobs = [
    { x: b1x, y: b1y, s: b1s, size:  Math.random()*200+200, color:"bg-[#FF6F61]",  opacity:0.6, blur:"blur-2xl" },
    { x: b2x, y: b2y, s: b2s, size:  Math.random()*200+200, color:"bg-[#5D8BF4]",  opacity:0.5, blur:"blur-xl"  },
    { x: b3x, y: b3y, s: b3s, size:  Math.random()*200+200, color:"bg-[#F4C63D]",  opacity:0.55,blur:"blur-2xl" },
  ];

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col items-center justify-center
                    bg-gradient-to-br from-[#F7F7F7] via-[#E6F0FF] to-[#F7F7F7] px-6">
      {/* Fast, full-coverage blobs */}
      <div className="pointer-events-none absolute inset-0">
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            style={{ x: b.x, y: b.y, scale: b.s, width: b.size, height: b.size }}
            className={`
              ${b.color}
              opacity-${Math.floor(b.opacity * 100)}
              absolute
              ${b.blur}
              rounded-full
              mix-blend-multiply
            `}
          />
        ))}
      </div>

      {/* “Spargen” + twinkling stars */}
      <div className="relative z-10 flex items-center justify-center mb-6">
        {letters.map((char, idx) => (
          <motion.span
            key={idx}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: [0, -10, 0], opacity: 1, scale: [1, 1.2, 1] }}
            transition={{ delay: idx * 0.1, duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="
              text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold
              text-transparent bg-clip-text bg-gradient-to-r
              from-[#5D8BF4] to-[#FF6F61] drop-shadow-lg
            "
          >
            {char}
          </motion.span>
        ))}
        {showStars && starPositions.map(({x,y,d}, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0.5,1.2,1] }}
            transition={{ delay: d/1000, duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
            className="absolute"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
          >
            <FiStar size={24} className="text-[#FF6F61]" />
          </motion.div>
        ))}
      </div>

      {/* Rotating headline */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: [0,-8,0] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="relative z-10 text-3xl md:text-5xl font-serif text-[#2A2A2A] drop-shadow-lg text-center flex items-center"
      >
        <FiZap className="inline-block mr-3 text-[#FF6F61] animate-bounce" size={32} />
        {`Unwrap ${rotatingWords[currentWordIndex]}`}
      </motion.h2>

      {/* Subheading & features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.6,1,0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 mt-6 text-center text-[#2A2A2A] max-w-xl space-y-4 font-sans"
      >
        <p className="text-lg md:text-xl">
          Explore hand-picked collections, member-only discounts and a
          lightning-fast checkout experience—only on Spargen.
        </p>
        <ul className="list-none text-base md:text-lg space-y-3">
          <li className="flex items-center justify-center">
            <FiGift className="mr-2 text-[#F4C63D]" size={20} /> Member-only discounts
          </li>
          <li className="flex items-center justify-center">
            <FiShoppingCart className="mr-2 text-[#5D8BF4]" size={20} /> Curated top-brand collections
          </li>
          <li className="flex items-center justify-center">
            <FiCheckCircle className="mr-2 text-[#4CAF50]" size={20} /> Secure checkout & fast delivery
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
