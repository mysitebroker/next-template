"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function HeroAnimations() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render animations on the server
  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Tennis Ball Animation */}
      <motion.div
        className="absolute"
        initial={{ x: -100, y: 50 }}
        animate={{
          x: ["-5vw", "105vw"],
          y: [50, 30, 50, 30, 50],
        }}
        transition={{
          x: { duration: 15, repeat: Infinity, ease: "linear" },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <TennisBall />
      </motion.div>

      {/* Second Tennis Ball (different path) */}
      <motion.div
        className="absolute"
        initial={{ x: -100, y: 150 }}
        animate={{
          x: ["-10vw", "110vw"],
          y: [150, 120, 150, 180, 150],
        }}
        transition={{
          x: { duration: 20, repeat: Infinity, ease: "linear", delay: 2 },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 },
        }}
      >
        <TennisBall scale={0.7} />
      </motion.div>


      {/* Court Lines */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
      >
        <CourtLines />
      </motion.div>
    </div>
  )
}

// Tennis Ball SVG
function TennisBall({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24 * scale}
      height={24 * scale}
      className="text-yellow-400 drop-shadow-md"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        fill="white"
        fillOpacity="0.5"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.42 0 8 3.58 8 8 0 1.65-.5 3.18-1.36 4.45-1.8-2.97-4.96-4.9-8.64-4.9-3.7 0-6.84 1.91-8.64 4.9C2.5 15.18 2 13.65 2 12c0-4.42 3.58-8 8-8z"
      />
      <path
        fill="white"
        fillOpacity="0.3"
        d="M9.54 3.42c-2.73 1.02-4.72 3.41-5.32 6.32 1.32-1.13 3.55-2.19 6.48-2.19 2.93 0 5.16 1.06 6.48 2.19-.59-2.91-2.59-5.3-5.32-6.32-.38 1.14-1.24 1.98-2.32 1.98s-1.95-.84-2.32-1.98z"
      />
    </svg>
  )
}

// Tennis Racquet SVG
function TennisRacquet() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="64"
      height="64"
      className="text-gray-200 drop-shadow-lg"
    >
      <path
        fill="currentColor"
        d="M12.5 2C9.42 2 7 4.41 7 7.5c0 1.25.38 2.4 1.03 3.35L3 17.5V21h3.5l6.67-6.67c.95.65 2.1 1.03 3.33 1.03 3.08 0 5.5-2.41 5.5-5.5 0-3.08-2.42-5.5-5.5-5.5h-4zm0 2h4c1.97 0 3.5 1.53 3.5 3.5S18.47 11 16.5 11 13 9.47 13 7.5 14.53 4 16.5 4h-4z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        d="M13 7.5c0-1.97 1.53-3.5 3.5-3.5 1.97 0 3.5 1.53 3.5 3.5S18.47 11 16.5 11 13 9.47 13 7.5z"
        strokeDasharray="1,1"
      />
    </svg>
  )
}

// Court Lines SVG
function CourtLines() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      className="text-white"
    >
      {/* Outer court */}
      <rect
        x="50"
        y="50"
        width="700"
        height="300"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Center line */}
      <line
        x1="400"
        y1="50"
        x2="400"
        y2="350"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Service lines */}
      <line
        x1="50"
        y1="150"
        x2="750"
        y2="150"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="50"
        y1="250"
        x2="750"
        y2="250"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Service boxes */}
      <line
        x1="200"
        y1="150"
        x2="200"
        y2="250"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="600"
        y1="150"
        x2="600"
        y2="250"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Net */}
      <line
        x1="50"
        y1="200"
        x2="750"
        y2="200"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="10,5"
      />
    </svg>
  )
}

// Button Animation Component
export function ButtonAnimation() {
  return (
    <motion.div
      className="absolute -right-6 top-1/2 -translate-y-1/2"
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1, opacity: 1, x: -5 }}
      transition={{ duration: 0.2 }}
    >
      <TennisBall scale={0.6} />
    </motion.div>
  )
}
