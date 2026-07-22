"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const directionMap = {
    up: { x: 0, y: 36 },
    left: { x: -48, y: 0 },
    right: { x: 48, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initialPosition = directionMap[direction];

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: initialPosition.x,
        y: initialPosition.y,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: 0.35,
      }}
      transition={{
        duration: 1,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
