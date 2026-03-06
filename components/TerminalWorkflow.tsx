"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import React, { useEffect, useMemo, useRef, useState } from "react";

type TerminalNode = {
  id: string;
  title: string;
  subtitle: string;
  command: string;
  output: string[];
  accent: string;
};

const nodes: TerminalNode[] = [
  {
    id: "onboard",
    title: "Onboard",
    subtitle: "Root context build",
    command: "devpilot /workspace/legacy-billing --mode=onboard --model=llama3",
    output: [
      "[scan] 128 files indexed",
      "[map] .devpilot/repomap.json",
      "[rel] .devpilot/relmap.json",
      "[docs] README_SUMMARY.md generated",
    ],
    accent: "border-[rgba(165,180,252,0.28)]",
  },
  {
    id: "explain",
    title: "Explain",
    subtitle: "Deep file reasoning",
    command:
      "devpilot src/services/invoice_service.py --mode=explain --model=llama3",
    output: [
      "[resolve] matched invoice_service.py",
      "[prompt] explain template selected",
      "[result] invoice flow + discount path",
    ],
    accent: "border-[rgba(125,211,252,0.28)]",
  },
  {
    id: "refactor",
    title: "Refactor",
    subtitle: "Code cleanup plan",
    command:
      "devpilot src/ui/BillingDashboard.tsx --mode=refactor --model=codellama",
    output: [
      "[issue] mixed render + domain logic",
      "[suggest] split into hook + mapper",
      "[risk] medium impact on billing totals",
    ],
    accent: "border-[rgba(147,197,253,0.28)]",
  },
  {
    id: "trace",
    title: "Trace",
    subtitle: "Impact and reachability",
    command: "devpilot --trace-symbol AuthService --trace-format mermaid",
    output: [
      "[trace] 8 files reached",
      "[graph] SYMBOL_TRACE_AuthService.mmd",
      "[impact] checkout/session_guard.py",
    ],
    accent: "border-[rgba(148,163,184,0.3)]",
  },
  {
    id: "review",
    title: "Review",
    subtitle: "Decision checkpoint",
    command: "devpilot --preview-prompt && devpilot --restore-log latest",
    output: [
      "[audit] prompt checked before run",
      "[logs] latest session restored",
      "[next] choose explain/refactor/trace branch",
    ],
    accent: "border-[rgba(196,181,253,0.3)]",
  },
];

type TerminalWindowProps = {
  node: TerminalNode;
  active: boolean;
  onActivate: (id: string) => void;
  delay: number;
};

const TerminalWindow = ({
  node,
  active,
  onActivate,
  delay,
}: TerminalWindowProps) => {
  const activeRingClass = "ring-1 ring-[rgba(165,180,252,0.42)]";

  return (
    <motion.button
      type="button"
      onClick={() => onActivate(node.id)}
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{}}
      whileTap={{ scale: 0.995 }}
      className={`relative z-10 w-full rounded-2xl border bg-[rgba(8,12,19,0.9)] p-4 text-left shadow-[0_16px_30px_rgba(0,0,0,0.45)] transition ${node.accent} ${
        active
          ? activeRingClass
          : "hover:ring-1 hover:ring-[rgba(165,180,252,0.28)]"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.07),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-1/2 h-24 w-[72%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(165,180,252,0.16),transparent)] blur-xl"
      />
      <div className="mb-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.12)] pb-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#94a3b8]" />
          <span className="h-2 w-2 rounded-full bg-[#a5b4fc]" />
          <span className="h-2 w-2 rounded-full bg-[#86efac]" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f939e]">
          {node.subtitle}
        </span>
      </div>

      <p className="mb-3 text-sm font-semibold text-[#dbe2ff]">{node.title}</p>

      <div className="rounded-lg border border-[rgba(165,180,252,0.25)] bg-[linear-gradient(180deg,rgba(5,6,9,0.94),rgba(3,4,6,0.96))] p-2 font-mono text-xs text-[#dbe2ff]">
        <span className="text-[#8f939e]">$ </span>
        {node.command}
      </div>

      <div className="mt-3 space-y-1.5 font-mono text-xs text-[#ced1d9]">
        {node.output.map((line) => (
          <p
            key={line}
            className="rounded-md border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-2 py-1.5"
          >
            {line}
          </p>
        ))}
      </div>
    </motion.button>
  );
};

const TerminalWorkflow = () => {
  const [activeNodeId, setActiveNodeId] = useState("onboard");
  const [snakePath, setSnakePath] = useState("");
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const graphRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({
    onboard: null,
    explain: null,
    refactor: null,
    trace: null,
    review: null,
  });

  const activeNode = useMemo(
    () => nodes.find((node) => node.id === activeNodeId) ?? nodes[0],
    [activeNodeId],
  );

  const onboard = nodes.find((n) => n.id === "onboard")!;
  const explain = nodes.find((n) => n.id === "explain")!;
  const refactor = nodes.find((n) => n.id === "refactor")!;
  const trace = nodes.find((n) => n.id === "trace")!;
  const review = nodes.find((n) => n.id === "review")!;

  useEffect(() => {
    const container = graphRef.current;
    if (!container) return;

    const f = (value: number) => value.toFixed(1);
    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y);
    const normalize = (dx: number, dy: number) => {
      const length = Math.hypot(dx, dy) || 1;
      return { x: dx / length, y: dy / length };
    };
    const buildRoundedPath = (
      rawPoints: Array<{ x: number; y: number }>,
      radius = 8,
    ) => {
      const points: Array<{ x: number; y: number }> = [];
      for (const point of rawPoints) {
        const last = points[points.length - 1];
        if (!last || last.x !== point.x || last.y !== point.y)
          points.push(point);
      }
      if (points.length < 2) return "";

      let d = `M ${f(points[0].x)} ${f(points[0].y)}`;
      for (let i = 1; i < points.length - 1; i += 1) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        const inDir = normalize(prev.x - curr.x, prev.y - curr.y);
        const outDir = normalize(next.x - curr.x, next.y - curr.y);
        const rIn = Math.min(radius, dist(prev, curr) / 2);
        const rOut = Math.min(radius, dist(curr, next) / 2);

        const pIn = { x: curr.x + inDir.x * rIn, y: curr.y + inDir.y * rIn };
        const pOut = {
          x: curr.x + outDir.x * rOut,
          y: curr.y + outDir.y * rOut,
        };

        d += ` L ${f(pIn.x)} ${f(pIn.y)} Q ${f(curr.x)} ${f(curr.y)} ${f(pOut.x)} ${f(pOut.y)}`;
      }

      const end = points[points.length - 1];
      d += ` L ${f(end.x)} ${f(end.y)}`;
      return d;
    };

    const computePath = () => {
      const containerRect = container.getBoundingClientRect();
      const toRect = (id: string) => {
        const el = nodeRefs.current[id];
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          left: rect.left - containerRect.left - 2.5,
          right: rect.right - containerRect.left + 2.5,
          top: rect.top - containerRect.top - 2.5,
          bottom: rect.bottom - containerRect.top + 2.5,
          centerX: rect.left - containerRect.left + rect.width / 2,
        };
      };

      const r1 = toRect("onboard");
      const r2 = toRect("explain");
      const r3 = toRect("refactor");
      const r4 = toRect("trace");
      const r5 = toRect("review");
      if (!r1 || !r2 || !r3 || !r4 || !r5) return;

      const sortedMid = [r2, r3, r4].sort((a, b) => a.centerX - b.centerX);
      const leftMid = sortedMid[0];
      const centerMid = sortedMid[1];
      const rightMid = sortedMid[2];

      const topBranchY =
        Math.min(leftMid.top, centerMid.top, rightMid.top) - 16;
      const bottomBranchY = r5.top - 16;
      const fromOnboardY = r1.bottom + 16;
      const afterRightY = rightMid.bottom + 16;

      const points = [
        { x: r1.left, y: r1.top },
        { x: r1.right, y: r1.top },
        { x: r1.right, y: r1.bottom },
        { x: r1.left, y: r1.bottom },
        { x: r1.left, y: r1.top },
        { x: r1.left, y: r1.bottom },
        { x: r1.centerX, y: r1.bottom },
        { x: r1.centerX, y: fromOnboardY },
        { x: leftMid.centerX, y: fromOnboardY },
        { x: leftMid.centerX, y: topBranchY },
        { x: leftMid.centerX, y: leftMid.top },
        { x: leftMid.left, y: leftMid.top },
        { x: leftMid.right, y: leftMid.top },
        { x: leftMid.right, y: leftMid.bottom },
        { x: leftMid.left, y: leftMid.bottom },
        { x: leftMid.left, y: leftMid.top },
        { x: leftMid.centerX, y: leftMid.top },
        { x: leftMid.centerX, y: topBranchY },
        { x: centerMid.centerX, y: topBranchY },
        { x: centerMid.centerX, y: centerMid.top },
        { x: centerMid.left, y: centerMid.top },
        { x: centerMid.right, y: centerMid.top },
        { x: centerMid.right, y: centerMid.bottom },
        { x: centerMid.left, y: centerMid.bottom },
        { x: centerMid.left, y: centerMid.top },
        { x: centerMid.centerX, y: centerMid.top },
        { x: centerMid.centerX, y: topBranchY },
        { x: rightMid.centerX, y: topBranchY },
        { x: rightMid.centerX, y: rightMid.top },
        { x: rightMid.left, y: rightMid.top },
        { x: rightMid.right, y: rightMid.top },
        { x: rightMid.right, y: rightMid.bottom },
        { x: rightMid.left, y: rightMid.bottom },
        { x: rightMid.left, y: rightMid.top },
        { x: rightMid.centerX, y: rightMid.top },
        { x: rightMid.centerX, y: afterRightY },
        { x: r5.centerX, y: afterRightY },
        { x: r5.centerX, y: bottomBranchY },
        { x: r5.centerX, y: r5.top },
        { x: r5.left, y: r5.top },
        { x: r5.right, y: r5.top },
        { x: r5.right, y: r5.bottom },
        { x: r5.left, y: r5.bottom },
        { x: r5.left, y: r5.top },
        { x: r5.centerX, y: r5.top },
      ];

      const path = buildRoundedPath(points, 20);

      setSnakePath(path);
      setSvgSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    computePath();
    const observer = new ResizeObserver(computePath);
    observer.observe(container);
    Object.values(nodeRefs.current).forEach((node) => {
      if (node) observer.observe(node);
    });
    window.addEventListener("resize", computePath);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", computePath);
    };
  }, []);

  return (
    <section className="mb-32">
      <SectionHeading
        title="Follow each CLI workflow from scan to review"
        description="Track how DevPilot moves through explain, refactor, trace, and review commands with a consistent terminal-first flow."
        stepLabel="Step 2 · Command journey"
      />

      <div ref={graphRef} className="relative">
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox={`0 0 ${svgSize.width || 100} ${svgSize.height || 100}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={snakePath}
            fill="none"
            stroke="rgba(148,163,184,0.16)"
            strokeWidth="0.52"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            d={snakePath}
            fill="none"
            stroke="rgba(148,163,184,0.52)"
            strokeWidth="0.82"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="0.065 0.935"
            animate={{ strokeDashoffset: [0, -1] }}
            transition={{ duration: 16.5, repeat: Infinity, ease: "linear" }}
            style={{
              filter:
                "drop-shadow(0 0 4px rgba(148,163,184,0.26)) drop-shadow(0 0 10px rgba(148,163,184,0.1))",
            }}
          />
        </svg>

        <div
          ref={(el) => {
            nodeRefs.current.onboard = el;
          }}
          className="relative z-10 mx-auto max-w-[620px]"
        >
          <TerminalWindow
            node={onboard}
            active={activeNode.id === onboard.id}
            onActivate={setActiveNodeId}
            delay={0}
          />
        </div>

        <div className="relative z-10 mx-auto mt-16 grid max-w-[1180px] gap-6 md:grid-cols-3">
          {[explain, refactor, trace].map((node, idx) => (
            <div
              key={node.id}
              ref={(el) => {
                nodeRefs.current[node.id] = el;
              }}
              className="relative"
            >
              <TerminalWindow
                node={node}
                active={activeNode.id === node.id}
                onActivate={setActiveNodeId}
                delay={0.08 + idx * 0.06}
              />
            </div>
          ))}
        </div>

        <div
          ref={(el) => {
            nodeRefs.current.review = el;
          }}
          className="relative z-10 mx-auto mt-16 max-w-155"
        >
          <TerminalWindow
            node={review}
            active={activeNode.id === review.id}
            onActivate={setActiveNodeId}
            delay={0.22}
          />
        </div>
      </div>
    </section>
  );
};

export default TerminalWorkflow;
