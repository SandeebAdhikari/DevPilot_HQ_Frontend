"use client";
import React from "react";
import { motion } from "framer-motion";

interface BlurDivInProps {
  children: React.ReactNode;
  className?: string;
}

const BlurDivIn: React.FC<BlurDivInProps> = ({ children, className }) => {
  const variants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 1 }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default BlurDivIn;
