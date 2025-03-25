import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = "md", animated = true }) => {
  // Size configurations
  const sizes = {
    sm: {
      container: "w-8 h-8",
      font: "text-lg font-bold",
      iconSize: "w-6 h-6",
    },
    md: {
      container: "w-12 h-12",
      font: "text-2xl font-bold",
      iconSize: "w-9 h-9",
    },
    lg: {
      container: "w-16 h-16",
      font: "text-3xl font-bold",
      iconSize: "w-12 h-12",
    },
  };

  if (process.env.NODE_ENV === "development") {
    console.log("Logo rendering with size:", size);
  }

  return (
    <div className="flex items-center gap-2">
      {/* Logo icon */}
      <div
        className={`relative ${sizes[size].container} flex items-center justify-center`}
      >
        <div className="absolute inset-0 glass-panel rounded-md overflow-hidden shadow-blue-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/80 to-[#00b4d8]/20 backdrop-blur-sm"></div>
        </div>

        {animated ? (
          <motion.div
            className={`z-10 text-[#00b4d8] ${sizes[size].iconSize}`}
            initial={{ scale: 0.9 }}
            animate={{
              scale: [0.9, 1.1, 0.9],
              filter: [
                "drop-shadow(0 0 2px rgba(0, 180, 216, 0.7))",
                "drop-shadow(0 0 5px rgba(0, 180, 216, 0.9))",
                "drop-shadow(0 0 2px rgba(0, 180, 216, 0.7))",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5M15 5C16.6569 5 18 6.34315 18 8C18 9.65685 16.6569 11 15 11M15 5H9M9 5C7.34315 5 6 6.34315 6 8C6 9.65685 7.34315 11 9 11M18 15H6C3.79086 15 2 16.7909 2 19V22H22V19C22 16.7909 20.2091 15 18 15ZM12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z"
                strokeWidth="2"
                strokeLinecap="round"
                stroke="currentColor"
              />
              <circle
                cx="12"
                cy="9"
                r="2"
                fill="currentColor"
                className="animate-pulse"
              />
            </svg>
          </motion.div>
        ) : (
          <div
            className={`z-10 text-[#00b4d8] drop-shadow-glow ${sizes[size].iconSize}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5M15 5C16.6569 5 18 6.34315 18 8C18 9.65685 16.6569 11 15 11M15 5H9M9 5C7.34315 5 6 6.34315 6 8C6 9.65685 7.34315 11 9 11M18 15H6C3.79086 15 2 16.7909 2 19V22H22V19C22 16.7909 20.2091 15 18 15ZM12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z"
                strokeWidth="2"
                strokeLinecap="round"
                stroke="currentColor"
              />
              <circle cx="12" cy="9" r="2" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>

      {/* Logo text */}
      <div className="flex flex-col">
        <h1 className={`${sizes[size].font} text-white flex items-center`}>
          <span className="text-[#00b4d8] drop-shadow-glow">Bite</span>
          <span>Back</span>
        </h1>
        <p className="text-xs text-gray-400">Hayatta Kal</p>
      </div>
    </div>
  );
};

export default Logo;
