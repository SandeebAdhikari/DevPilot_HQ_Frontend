"use client";
import { motion } from "framer-motion";
import React from "react";

const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const } },
};

const FadeDivDown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={FADE_DOWN_ANIMATION_VARIANTS}
    >
      {children}
    </motion.div>
  );
};

export default FadeDivDown;
