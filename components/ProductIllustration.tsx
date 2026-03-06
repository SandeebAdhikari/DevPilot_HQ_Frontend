"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import React from "react";

const ProductIllustration = () => {
  return (
    <section className="mb-28 mt-4">
      <SectionHeading
        title="Review outputs across planning, chat, and diffs"
        description="Bring context, discussion, and code-level changes into one product surface so teams can validate decisions before merge."
        stepLabel="Step 3 · Product surfaces"
      />

      <div className="relative md:p-1">

        <div className="relative z-10 grid gap-4 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(8,12,19,0.7)] p-4 backdrop-blur-xl"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#9ba6bb]">
              Fig 0.1
            </p>
            <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(2,6,23,0.36)]">
              <svg viewBox="0 0 180 120" className="h-28 w-36 text-[#8192ad]/75">
                <path d="M20 75 L90 35 L160 75 L90 112 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M20 75 L20 42 L90 2 L160 42 L160 75" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M20 58 L90 18 L160 58" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <p className="mt-3 text-sm text-[#d8deeb]">Repository intake + context foundation.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(8,12,19,0.7)] p-4 backdrop-blur-xl"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#9ba6bb]">
              Fig 0.2
            </p>
            <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(2,6,23,0.36)]">
              <svg viewBox="0 0 180 120" className="h-28 w-36 text-[#8192ad]/75">
                <rect x="18" y="40" width="48" height="48" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="66" y="16" width="48" height="48" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="114" y="48" width="48" height="48" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="66" y="64" width="48" height="48" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <p className="mt-3 text-sm text-[#d8deeb]">Explain, Refactor, Trace as parallel paths.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(8,12,19,0.7)] p-4 backdrop-blur-xl"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#9ba6bb]">
              Fig 0.3
            </p>
            <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(2,6,23,0.36)]">
              <svg viewBox="0 0 180 120" className="h-28 w-36 text-[#8192ad]/75">
                {Array.from({ length: 9 }).map((_, i) => (
                  <rect
                    key={i}
                    x={26 + i * 10}
                    y={84 - i * 7}
                    width="34"
                    height={8 + i * 7}
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                ))}
              </svg>
            </div>
            <p className="mt-3 text-sm text-[#d8deeb]">Review surfaces with safe patch context.</p>
          </motion.div>
        </div>

        <div className="relative z-10 mt-5 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(7,10,16,0.66)] p-4 backdrop-blur-xl"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#9ba6bb]">
              Agent Conversation
            </p>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-3">
              <p className="font-mono text-sm text-[#e6ecf8]">Codex</p>
              <div className="mt-2 space-y-2 text-sm text-[#bac4d8]">
                <p>On it. Initialization complete for repo context.</p>
                <p>Searching for AGENTS.md and dependency entrypoints.</p>
                <p>Ready to run explain, refactor, or trace.</p>
              </div>
              <div className="mt-3 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(2,6,23,0.42)] px-3 py-2 text-[#909db3]">
                Reply...
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(7,10,16,0.66)] p-4 backdrop-blur-xl"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#9ba6bb]">
              Assign Agent
            </p>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-3 text-sm text-[#c6cedf]">
              {["Codex", "Steven", "Ema", "GitHub Copilot", "Cursor"].map((name, index) => (
                <div key={name} className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] py-2 last:border-b-0">
                  <span>{name}</span>
                  {index === 0 ? (
                    <span className="rounded-full border border-[rgba(165,180,252,0.45)] bg-[rgba(165,180,252,0.12)] px-2 py-0.5 text-xs text-[#dbe2ff]">
                      Active
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.44, delay: 0.18 }}
          className="relative z-10 mt-4 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(7,10,16,0.66)] p-4 backdrop-blur-xl"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#9ba6bb]">
            Code Diff Preview
          </p>
          <div className="grid overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(2,6,23,0.42)] md:grid-cols-2">
            <div className="border-b border-[rgba(255,255,255,0.08)] p-3 font-mono text-xs text-[#fca5a5] md:border-b-0 md:border-r">
              <p>- const {"{ isFullySynced }"} = useVehicleState()</p>
              <p>- if (!isFullySynced) return &lt;ActivityIndicator /&gt;</p>
              <p>- &lt;Dashboard state={"{vehicleState}"} /&gt;</p>
            </div>
            <div className="p-3 font-mono text-xs text-[#86efac]">
              <p>+ const {"{ syncStatus }"} = useVehicleState()</p>
              <p>+ if (syncStatus === SyncStatus.PENDING) return ...</p>
              <p>+ &lt;Dashboard state={"{vehicleState}"} syncStatus=... /&gt;</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ProductIllustration;
