"use client";
import React, { useEffect, useRef, useState } from "react";

const RippleCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [offScreen, setOffScreen] = useState(false);
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      setOffScreen(false);
    };
    const handleLeave = () => {
      setVisible(false);
      setOffScreen(true);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={rippleRef}
      style={{
        position: "fixed",
        left: offScreen ? -9999 : pos.x - 40,
        top: offScreen ? -9999 : pos.y - 40,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s",
      }}
    >
      <span className="ripple-cursor" />
    </div>
  );
};

export default RippleCursor;
