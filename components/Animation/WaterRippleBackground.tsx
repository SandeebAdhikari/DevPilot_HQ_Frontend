"use client";

import React, { useEffect, useRef } from "react";

const CELL_SIZE = 5;
const DAMPING = 0.985;

const WaterRippleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const lowResCanvas = document.createElement("canvas");
    const lowResContext = lowResCanvas.getContext("2d");
    if (!lowResContext) return;

    let cols = 0;
    let rows = 0;
    let previous = new Float32Array(0);
    let current = new Float32Array(0);
    let next = new Float32Array(0);
    let imageData = lowResContext.createImageData(1, 1);
    let rafId = 0;
    let running = true;
    let pointerDown = false;
    let lastPointer:
      | { x: number; y: number; time: number; pointerId: number | null }
      | null = null;

    const indexAt = (x: number, y: number) => y * cols + x;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = true;

      cols = Math.max(32, Math.floor(width / CELL_SIZE));
      rows = Math.max(24, Math.floor(height / CELL_SIZE));

      lowResCanvas.width = cols;
      lowResCanvas.height = rows;
      imageData = lowResContext.createImageData(cols, rows);

      previous = new Float32Array(cols * rows);
      current = new Float32Array(cols * rows);
      next = new Float32Array(cols * rows);
    };

    const disturb = (clientX: number, clientY: number, force: number) => {
      if (!cols || !rows) return;

      const x = Math.floor((clientX / window.innerWidth) * cols);
      const y = Math.floor((clientY / window.innerHeight) * rows);
      const radius = 5;

      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const px = x + dx;
          const py = y + dy;

          if (px <= 1 || px >= cols - 1 || py <= 1 || py >= rows - 1) continue;

          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > radius) continue;

          const falloff = 1 - dist / radius;
          current[indexAt(px, py)] += force * falloff;
        }
      }
    };

    const drawTrail = (x0: number, y0: number, x1: number, y1: number, force: number) => {
      const dx = x1 - x0;
      const dy = y1 - y0;
      const distance = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.floor(distance / 10));

      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        disturb(x0 + dx * t, y0 + dy * t, force);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const now = performance.now();
      const x = event.clientX;
      const y = event.clientY;

      if (!lastPointer) {
        lastPointer = { x, y, time: now, pointerId: event.pointerId };
        disturb(x, y, 2.4);
        return;
      }

      const dt = Math.max(8, now - lastPointer.time);
      const travel = Math.hypot(x - lastPointer.x, y - lastPointer.y);
      const speed = travel / dt;
      const velocityForce = Math.min(4.8, 1.8 + speed * 16);
      const pressureBoost = event.pressure ? event.pressure * 1.8 : 0;
      const dragBoost = pointerDown ? 0.9 : 0;
      const force = velocityForce + pressureBoost + dragBoost;

      drawTrail(lastPointer.x, lastPointer.y, x, y, force);
      lastPointer = { x, y, time: now, pointerId: event.pointerId };
    };

    const handlePointerDown = (event: PointerEvent) => {
      pointerDown = true;
      lastPointer = {
        x: event.clientX,
        y: event.clientY,
        time: performance.now(),
        pointerId: event.pointerId,
      };
      disturb(event.clientX, event.clientY, 7.4);
    };

    const handlePointerUp = (event: PointerEvent) => {
      pointerDown = false;
      disturb(event.clientX, event.clientY, 5.2);
      lastPointer = null;
    };

    const handlePointerCancel = () => {
      pointerDown = false;
      lastPointer = null;
    };

    const stepSimulation = () => {
      for (let y = 1; y < rows - 1; y += 1) {
        for (let x = 1; x < cols - 1; x += 1) {
          const idx = indexAt(x, y);
          const wave =
            ((current[indexAt(x - 1, y)] +
              current[indexAt(x + 1, y)] +
              current[indexAt(x, y - 1)] +
              current[indexAt(x, y + 1)]) *
              0.5 -
              previous[idx]) *
            DAMPING;

          next[idx] = wave;
        }
      }

      [previous, current, next] = [current, next, previous];
    };

    const render = () => {
      const pixels = imageData.data;
      let p = 0;

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const idx = indexAt(x, y);
          const height = current[idx];
          const left = current[indexAt(Math.max(x - 1, 0), y)];
          const right = current[indexAt(Math.min(x + 1, cols - 1), y)];
          const up = current[indexAt(x, Math.max(y - 1, 0))];
          const down = current[indexAt(x, Math.min(y + 1, rows - 1))];

          const gradientX = right - left;
          const gradientY = down - up;
          const light = Math.max(0, Math.min(1, 0.5 + gradientX * 0.8 - gradientY * 0.65));
          const shimmer = Math.min(1, Math.abs(height) * 4);

          pixels[p] = Math.round(26 + 22 * light);
          pixels[p + 1] = Math.round(54 + 46 * light);
          pixels[p + 2] = Math.round(86 + 74 * light);
          pixels[p + 3] = Math.round(18 + shimmer * 82);
          p += 4;
        }
      }

      lowResContext.putImageData(imageData, 0, 0);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.drawImage(lowResCanvas, 0, 0, window.innerWidth, window.innerHeight);
    };

    const tick = () => {
      if (!running) return;
      stepSimulation();
      render();
      rafId = window.requestAnimationFrame(tick);
    };

    setup();
    tick();

    window.addEventListener("resize", setup);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerCancel, { passive: true });

    return () => {
      running = false;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setup);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
};

export default WaterRippleBackground;
