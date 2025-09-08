"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const SearchAI = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log("Search query:", searchValue);
    }
  };

  // Convertir hex a rgba
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const borderColor = hexToRgba("#FCBBDA", 0.15);

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-8">
      {/* Container con borde rosa */}
      <motion.div
        className="relative p-[6px] rounded-[24px] overflow-hidden"
        style={{
          border: `2px solid ${borderColor}`,
          backgroundColor: "#fff",
          zIndex: 102,
          boxShadow: isFocused
            ? "0 8px 32px rgba(252, 187, 218, 0.25), 0 4px 16px rgba(29, 36, 252, 0.15)"
            : "0 4px 16px rgba(0, 0, 0, 0.08)",
        }}
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Cometa blanco/rosa rotando en el borde */}
        <motion.div
          className="absolute inset-0 rounded-[24px]"
          style={{
            background: `
              conic-gradient(
                from 0deg,
                rgba(252, 187, 218, 0.8) 0deg 20deg,
                rgba(29, 36, 252, 0.6) 20deg 40deg,
                transparent 40deg 360deg
              )
            `,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            zIndex: 1,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* Contenedor del formulario */}
        <form
          onSubmit={handleSubmit}
          className="relative bg-white rounded-[20px] overflow-hidden w-full"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.08)",
            zIndex: 10,
          }}
        >
          <div className="flex items-center">
            {/* Input de búsqueda */}
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Describe your form idea..."
              className="flex-1 px-6 py-5 text-lg bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium leading-relaxed"
              style={{
                fontSize: isFocused ? "1.125rem" : "1rem",
                zIndex: 20,
                position: "relative",
              }}
            />

            {/* Botón de envío */}
            <motion.button
              type="submit"
              className="m-2 p-3.5 bg-gradient-to-r from-[#1D24FC] to-[#FCBBDA] rounded-xl text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ zIndex: 15, position: "relative" }}
              whileHover={searchValue.trim() ? { scale: 1.05 } : {}}
              whileTap={searchValue.trim() ? { scale: 0.95 } : {}}
              disabled={!searchValue.trim()}
            >
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transform rotate-45"
                animate={{ rotate: isFocused ? 90 : 45 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </motion.button>
          </div>
        </form>

        {/* Efecto de brillo adicional al enfocar */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-[24px]"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(29, 36, 252, 0.4) 0deg 30deg, rgba(252, 187, 218, 0.3) 30deg 60deg, transparent 60deg 360deg)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              zIndex: 2,
              pointerEvents: "none",
            }}
            initial={{ opacity: 0 }}
            animate={{
              rotate: -360,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        )}
      </motion.div>

      {/* Texto de ayuda */}
      <motion.p
        className="text-center text-sm text-gray-600 mt-4 font-medium"
        style={{ letterSpacing: "0.025em" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="inline-flex items-center gap-1">
          Powered by AI
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 bg-gradient-to-r from-[#1D24FC] to-[#FCBBDA] rounded-full"
          />
          Press Enter to search
        </span>
      </motion.p>
    </div>
  );
};

export default SearchAI;


